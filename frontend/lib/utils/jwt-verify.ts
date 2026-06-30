// lib/utils/jwt-verify.ts
import { jwtVerify, importSPKI } from "jose";

/**
 * JWT Signature Verification Utility
 *
 * PROFESSOR'S REQUIREMENT:
 * "The frontend must verify the JWT signature using the public key before decoding.
 * The frontend may read the role from the JWT payload only after verification.
 * If a token is tampered with:
 *   - Client-side verification fails
 *   - Backend rejects the token and returns no sensitive data"
 *
 * SECURITY MODEL:
 * 1. Backend signs JWTs with PRIVATE key (never exposed)
 * 2. Frontend verifies JWTs with PUBLIC key (safe to expose)
 * 3. Public key can ONLY verify, NOT create signatures
 * 4. Tampered tokens fail verification on both client and server
 *
 * CRYPTOGRAPHIC ALGORITHM: RS256 (RSA + SHA-256)
 * - Industry standard for JWT signing
 * - Asymmetric cryptography (public/private key pair)
 * - OWASP-compliant
 *
 * USAGE:
 * ```typescript
 * const result = await verifyAndDecodeJWT(token)
 * if (result.valid && result.payload) {
 *   const { userId, email, role } = result.payload
 *   // ✅ Safe to use - signature verified
 * } else {
 *   // ❌ Token tampered or invalid
 *   throw new Error(result.error)
 * }
 * ```
 */

/**
 * JWT Payload Structure (after verification)
 * Maps to backend's JWT payload format
 */
/**
 * Verified JWT Payload Structure
 * Matches backend's exact JWT claims: { id, role, iat, exp }
 */
export interface VerifiedJWTPayload {
  /**
   * User ID from JWT 'id' claim
   * Backend uses 'id' (not standard 'sub')
   */
  userId: string;

  /**
   * User role for RBAC
   * Values: 'admin' | 'committee' | 'student'
   */
  role: "admin" | "committee" | "student";

  /**
   * Token expiration timestamp (Unix epoch seconds)
   * Standard JWT claim: 'exp'
   */
  exp: number;

  /**
   * Token issued at timestamp (Unix epoch seconds)
   * Standard JWT claim: 'iat'
   */
  iat: number;
}

/**
 * Verification result structure
 */
export interface JWTVerificationResult {
  /**
   * True if signature is valid and token not expired
   */
  valid: boolean;

  /**
   * Decoded payload (only if valid=true)
   */
  payload?: VerifiedJWTPayload;

  /**
   * Error message (only if valid=false)
   */
  error?: string;
}

/**
 * Get RSA public key from environment variable
 * Expected format: PEM string (-----BEGIN PUBLIC KEY-----)
 *
 * SECURITY NOTE: Public keys are NOT secrets
 * - Safe to expose in frontend code
 * - Only used for signature verification
 * - Cannot be used to create signatures
 */
function getPublicKey(): string {
  const key = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY;

  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_JWT_PUBLIC_KEY not configured in environment variables",
    );
  }

  // Validate PEM format
  if (!key.includes("BEGIN PUBLIC KEY") || !key.includes("END PUBLIC KEY")) {
    throw new Error(
      "Invalid public key format - expected PEM format (BEGIN/END markers)",
    );
  }

  // Fix common environment variable formatting issues:
  // 1. Replace literal \n with actual newlines
  // 2. Ensure proper PEM structure
  let formattedKey = key.replace(/\\n/g, "\n");

  // If key is on a single line, ensure proper line breaks
  if (!formattedKey.includes("\n")) {
    // Split into header, body, footer
    formattedKey = formattedKey
      .replace("-----BEGIN PUBLIC KEY-----", "-----BEGIN PUBLIC KEY-----\n")
      .replace("-----END PUBLIC KEY-----", "\n-----END PUBLIC KEY-----");
  }

  return formattedKey;
}

/**
 * Verify JWT signature and decode payload
 *
 * SECURITY FLOW:
 * 1. Load public key from environment
 * 2. Import key using jose library (validates format)
 * 3. Verify signature using RS256 algorithm
 * 4. Check expiration automatically (jose does this)
 * 5. Extract and type-cast payload
 * 6. Return verified data OR error
 *
 * @param token - JWT string (format: header.payload.signature)
 * @returns Verification result with payload or error
 *
 * SECURITY GUARANTEES:
 * - If valid=true, token signature is cryptographically verified
 * - If valid=true, token is not expired
 * - If valid=false, payload should NEVER be trusted
 * - Timing-safe comparison (protects against timing attacks)
 */
export async function verifyAndDecodeJWT(
  token: string,
): Promise<JWTVerificationResult> {
  // ==================== INPUT VALIDATION ====================
  if (!token || typeof token !== "string") {
    return {
      valid: false,
      error: "Invalid token format - expected non-empty string",
    };
  }

  // JWT must have 3 parts: header.payload.signature
  const parts = token.split(".");
  if (parts.length !== 3) {
    return {
      valid: false,
      error:
        "Invalid token structure - expected 3 parts (header.payload.signature)",
    };
  }

  let publicKeyPEM: string;
  try {
    publicKeyPEM = getPublicKey();
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to load public key";
    console.error("❌ JWT Verification - Public Key Error:", errorMsg);
    return {
      valid: false,
      error: errorMsg,
    };
  }

  // ==================== SIGNATURE VERIFICATION ====================
  try {
    // Import PEM-encoded public key
    const publicKey = await importSPKI(publicKeyPEM, "RS256");

    // Verify signature and decode payload
    // This function:
    // - Validates signature using RS256
    // - Checks expiration (exp claim)
    // - Checks not-before time (nbf claim, if present)
    // - Returns payload only if ALL checks pass
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ["RS256"], // ✅ Only allow RS256 (prevent algorithm confusion attacks)
      clockTolerance: 30, // Allow 30 seconds clock skew between client/server
    });

    // ==================== PAYLOAD EXTRACTION ====================
    // Extract claims matching backend's JWT structure: { id, role, iat, exp }
    const verifiedPayload: VerifiedJWTPayload = {
      userId: payload.id as string,
      role: payload.role as "admin" | "committee",
      exp: payload.exp as number,
      iat: payload.iat as number,
    };

    // ==================== PAYLOAD VALIDATION ====================
    if (!verifiedPayload.userId || !verifiedPayload.role) {
      return {
        valid: false,
        error: "Invalid token payload - missing required fields (id, role)",
      };
    }

    if (!["admin", "committee", "student"].includes(verifiedPayload.role)) {
      return {
        valid: false,
        error: `Invalid role: ${verifiedPayload.role}`,
      };
    }

    // ✅ SUCCESS: Token verified and payload extracted
    console.log("✅ JWT verified:", {
      userId: verifiedPayload.userId,
      role: verifiedPayload.role,
      expiresAt: new Date(verifiedPayload.exp * 1000).toISOString(),
    });

    return {
      valid: true,
      payload: verifiedPayload,
    };
  } catch (error) {
    // ==================== ERROR HANDLING ====================
    let errorMessage = "Token verification failed";

    if (error instanceof Error) {
      // Categorize error types
      if (error.message.includes("expired")) {
        errorMessage = "Token expired";
      } else if (error.message.includes("signature")) {
        errorMessage = "Invalid token signature";
      } else if (error.message.includes("malformed")) {
        errorMessage = "Malformed token structure";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      valid: false,
      error: errorMessage,
    };
  }
}

/**
 * SECURITY TEST SCENARIOS:
 *
 * 1. Valid Token:
 *    Input: Genuine token from backend
 *    Expected: valid=true, payload extracted
 *
 * 2. Tampered Payload:
 *    Input: Token with modified role (committee → admin)
 *    Expected: valid=false, error="Invalid token signature"
 *
 * 3. Tampered Signature:
 *    Input: Token with last character changed
 *    Expected: valid=false, error="Invalid token signature"
 *
 * 4. Expired Token:
 *    Input: Token past exp timestamp
 *    Expected: valid=false, error="Token expired"
 *
 * 5. Missing Public Key:
 *    Input: Valid token but no NEXT_PUBLIC_JWT_PUBLIC_KEY
 *    Expected: valid=false, error="Public key not configured"
 *
 * 6. Wrong Algorithm:
 *    Input: Token signed with HS256 (symmetric)
 *    Expected: valid=false (RS256 enforced)
 */

/**
 * INTEGRATION WITH AUTH FLOW:
 *
 * 1. Login Response:
 *    ```typescript
 *    const { token } = await apiClient.post('/auth/login', credentials)
 *
 *    // ✅ Verify before trusting
 *    const verification = await verifyAndDecodeJWT(token)
 *    if (!verification.valid) {
 *      throw new Error('Backend sent invalid token')
 *    }
 *
 *    // ✅ Now safe to use
 *    useAuthStore.getState().setAccessToken(token)
 *    useAuthStore.getState().setUser({
 *      id: verification.payload.userId,
 *      email: verification.payload.email,
 *      role: verification.payload.role,
 *    })
 *    ```
 *
 * 2. Token Refresh:
 *    ```typescript
 *    const { token: newToken } = await axios.post('/auth/refresh')
 *
 *    // ✅ Verify refreshed token too
 *    const verification = await verifyAndDecodeJWT(newToken)
 *    if (!verification.valid) {
 *      // Refresh token gave us bad token - force logout
 *      redirectToLogin()
 *      return
 *    }
 *
 *    useAuthStore.getState().setAccessToken(newToken)
 *    ```
 *
 * 3. Role Check Before Route Access:
 *    ```typescript
 *    const token = useAuthStore.getState().accessToken
 *    if (token) {
 *      const verification = await verifyAndDecodeJWT(token)
 *      if (verification.valid && verification.payload.role === 'committee') {
 *        // Block access to admin routes
 *      }
 *    }
 *    ```
 */

/**
 * OWASP COMPLIANCE:
 *
 * A02:2021 - Cryptographic Failures:
 * ✅ Uses industry-standard RS256 (RSA-SHA256)
 * ✅ Verifies signatures before trusting payload
 * ✅ Public key safely exposed (cannot sign, only verify)
 * ✅ Rejects expired tokens automatically
 * ✅ Enforces single algorithm (no algorithm confusion)
 *
 * A07:2021 - Identification and Authentication Failures:
 * ✅ Multi-layer validation (signature + expiration + structure)
 * ✅ Role extracted only after verification
 * ✅ Defense against token tampering
 * ✅ Clear error messages for debugging
 */

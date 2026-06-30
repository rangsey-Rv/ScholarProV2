import loginService from "@services/auth/login.service";
import { db } from "@db";
import { users } from "@db/schema/user";
import { userTokens } from "@db/schema/user-token";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/generate-token";

// Mock dependencies
jest.mock("@db", () => ({
  db: {
    select: jest.fn(),
    update: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("@utils/generate-token", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

jest.mock("@services/user/get-profile.service", () => jest.fn());

describe("Login Service", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    role: "admin",
    password: "hashedPassword",
    isActive: true,
  };

  let mockSelect: any;
  let mockUpdate: any;
  let mockInsert: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup chainable mocks
    mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockUser]),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelect);

    mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };
    (db.update as jest.Mock).mockReturnValue(mockUpdate);

    mockInsert = {
      values: jest.fn().mockReturnThis(),
    };
    (db.insert as jest.Mock).mockReturnValue(mockInsert);
  });

  it("should return success with tokens for valid credentials", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateAccessToken as jest.Mock).mockReturnValue("access_token");
    (generateRefreshToken as jest.Mock).mockReturnValue("refresh_token");

    const result = await loginService(
      "test@example.com",
      "password",
      "1.2.3.4"
    );

    expect(result.success).toBe(true);
    expect(result.accessToken).toBe("access_token");
    expect(result.refreshToken).toBe("refresh_token");
    expect(generateRefreshToken).toHaveBeenCalled();
  });

  it("should return failure for invalid email (user not found)", async () => {
    mockSelect.limit.mockResolvedValue([]); // No user found

    const result = await loginService(
      "wrong@example.com",
      "password",
      "1.2.3.4"
    );

    expect(result.success).toBe(false);
    expect(result.msg).toBe("Invalid email or password");
  });

  it("should return failure for invalid password", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await loginService(
      "test@example.com",
      "wrongpassword",
      "1.2.3.4"
    );

    expect(result.success).toBe(false);
    expect(result.msg).toBe("Invalid email or password");
  });
});

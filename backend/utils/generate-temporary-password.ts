import crypto from "crypto";

export default function generatePassword(length: number): string {
    // Define the character sets
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_-+=[]{}|;:,.<>?';

    // Combine all character sets
    const allChars = lowercase + uppercase + numbers + symbols;
    const allCharsLength = allChars.length;

    let password = '';
    
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes[i] % allCharsLength;
        password += allChars.charAt(randomIndex);
    }

    return password;
}

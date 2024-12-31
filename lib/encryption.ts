import crypto from 'crypto';
import "server-only"
const ALG = 'aes-256-cbc';

const normalizeKey = (key: string): Buffer => {
    // Ensure the key is 32 bytes long
    return Buffer.from(key.padEnd(32, '0').slice(0, 32), 'utf8');
};

export const symmetricEncrypt = (data: string) => {
    let key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALG, normalizeKey(key), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

export const symmetricDecrypt = (encrypted: string) => {
    let key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    const textParts = encrypted.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALG, normalizeKey(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

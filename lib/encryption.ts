import crypto from 'crypto';
import "server-only"
const ALG = 'aes-256-cbc';

export const symmetricEncrypt = (data: string) => {
    let key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    // Ensure the key is 32 bytes long
    if (key.length !== 32) {
        key = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALG, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

export const symmetricDecrypt = (encrypted: string) => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    const textParts = encrypted.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

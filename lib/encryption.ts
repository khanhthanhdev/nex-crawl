import crypto from 'crypto';

const ALG = 'aes-256-cbc';


export const symmetricEncrypt = (data: string) => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;

}

export const symmetricDecrypt = (data: string) => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    const [iv, encrypted] = data.split(':');
    const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

import crypto from 'crypto';

const ALG = 'aes-256-cbc';


export const symmetricEncrypt = (data: string) => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('Encryption key not found');
    }

    const iv = crypto.randomBytes(16);
    
}

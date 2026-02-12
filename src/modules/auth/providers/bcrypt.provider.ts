import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider extends HashingProvider {
    public async createHash(
        data: string | Buffer,
        salt: string | number = 10,
    ): Promise<string> {
        return await bcrypt.hash(data, salt);
    }

    public async comparePassword(
        data: string | Buffer,
        encrypted: string,
    ): Promise<boolean> {
        return await bcrypt.compare(data, encrypted);
    }
}

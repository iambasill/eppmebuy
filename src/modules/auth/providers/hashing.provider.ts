import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract createHash(
        data: string | Buffer,
        salt?: string | number,
    ): Promise<string>;

    abstract comparePassword(
        data: string | Buffer,
        encrypted: string,
    ): Promise<boolean>;
}

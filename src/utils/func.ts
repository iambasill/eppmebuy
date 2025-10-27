
import jwt from 'jsonwebtoken';
import { prismaclient } from '../lib/prisma-postgres';
import { config } from '../config/envConfig';

export function checkUser(id:string){
    const user = prismaclient.user.findUnique({
        where:{id},
    })
return user
}

export const generateAuthToken = (userId: string) => {
    let accessToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '1h' });
    let refreshToken = jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '1d' });
    return { accessToken, refreshToken };
  }
export const generateLoginToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '1h' });
};


export const verifyToken = (token: string,type:string="auth") => {
    if (!token) throw new Error('Token is required');
    const secret =
        type === 'reset'
            ? (config.AUTH_JWT_RESET_TOKEN as string)
            : (config.AUTH_JWT_TOKEN as string);

        const payload = jwt.verify(token, secret) as {
            id?: string;
            iat?: number;
            exp?: number;
            [key: string]: any;
        };

        if (!payload || typeof payload !== 'object' || !payload.id) {
            throw new Error('Invalid token payload');
        }

        return payload;
    }


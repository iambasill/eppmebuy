
import jwt from 'jsonwebtoken';
import { prismaclient } from '../lib/prisma-postgres';
import { config } from '../config/envConfig';

export function checkUser(id:string){
    const user = prismaclient.user.findUnique({
        where:{id},
    })
return user
}

export const generateAuthToken =async (userId: string) => {
    let accessToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '1h' });
    let refreshToken = jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '5h' });
    return { accessToken, refreshToken };
  }


  export const generateToken =async (userId: string) => {
    let resetToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '24h' });
    return resetToken ;
  }


export const verifyToken = async(token: string,type:string="auth") => {
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

export const createUserSession = async (userId:string, refreshToken:string, req:any) => {
    await prismaclient.userSession.updateMany({
        where: { userId: userId, loggedOutAt: null },
        data: { loggedOutAt: new Date() },
      });

        await prismaclient.userSession.create({
          data: {
            userId: userId, 
            refreshToken,
            userAgent: req.headers['user-agent'] || 'Unknown',
            ipAddress: req.ip,
          },
        });
}
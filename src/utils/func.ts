
import jwt from 'jsonwebtoken';
import { prismaclient } from '../lib/prisma-postgres';
import { config } from '../config';
import { BadRequestError } from '../logger/exceptions';

export function checkUser(id:string){
    const user = prismaclient.user.findUnique({
        where:{id},
    })
return user
}

export const generateAuthToken =async (userId: string) => {
    let accessToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string);
    return {accessToken }
  }


  export const generateToken =async (userId: string) => {
    let resetToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '24h' });
    return resetToken ;
  }


export const verifyToken = async(token: string,type:string="auth") => {
    if (!token) throw new BadRequestError('Token is required');
    try {
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
            throw new BadRequestError('Invalid or expired token');
        }

        return payload;
        } catch (err) {
           throw new BadRequestError('Invalid or Expired token!');
        }
    }

export const createUserSession = async (userId:string, req:any) => {
    await prismaclient.userSession.updateMany({
        where: { userId: userId, loggedOutAt: null },
        data: { loggedOutAt: new Date() },
      });

        await prismaclient.userSession.create({
          data: {
            userId: userId, 
            userAgent: req.headers['user-agent'] || 'Unknown',
            ipAddress: req.ip
          },
        });
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function getBoundingBox(lat: number, lon: number, radiusKm: number) {
  const latDelta = radiusKm / 111.32; // 1 degree latitude ≈ 111.32 km
  const lonDelta = radiusKm / (111.32 * Math.cos(toRad(lat)));
  
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

import { SetMetadata } from '@nestjs/common';

export const PublicRoute = () => {
    return SetMetadata('isPublic', true);
};

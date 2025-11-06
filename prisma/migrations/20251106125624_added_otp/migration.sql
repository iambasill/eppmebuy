-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otp" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

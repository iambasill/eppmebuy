/*
  Warnings:

  - The values [NOT_REQUIRED] on the enum `KYCStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KYCStatus_new" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."users" ALTER COLUMN "kyc_status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "kyc_status" TYPE "KYCStatus_new" USING ("kyc_status"::text::"KYCStatus_new");
ALTER TYPE "KYCStatus" RENAME TO "KYCStatus_old";
ALTER TYPE "KYCStatus_new" RENAME TO "KYCStatus";
DROP TYPE "public"."KYCStatus_old";
ALTER TABLE "users" ALTER COLUMN "kyc_status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ALTER COLUMN "kyc_status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "user_follows" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_support" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_support_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_follows_follower_id_idx" ON "user_follows"("follower_id");

-- CreateIndex
CREATE INDEX "user_follows_following_id_idx" ON "user_follows"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_follows_follower_id_following_id_key" ON "user_follows"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `user_sessions` table. All the data in the column will be lost.
  - Changed the type of `category` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "is_online" SET DEFAULT 'true',
ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "user_sessions" DROP COLUMN "refresh_token";

-- DropEnum
DROP TYPE "public"."EventCategory";

-- CreateTable
CREATE TABLE "idempontency_key" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "idempontency_key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

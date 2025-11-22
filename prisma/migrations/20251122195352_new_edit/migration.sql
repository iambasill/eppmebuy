/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
ADD COLUMN     "organization_name" TEXT;

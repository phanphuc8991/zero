/*
  Warnings:

  - You are about to drop the column `tokenHash` on the `PasswordResetToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PasswordResetToken_tokenHash_key";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "tokenHash",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

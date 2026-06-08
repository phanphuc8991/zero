/*
  Warnings:

  - You are about to drop the column `duration_seconds` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "duration_seconds",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0;

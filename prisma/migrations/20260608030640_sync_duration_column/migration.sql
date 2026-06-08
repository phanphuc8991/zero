/*
  Warnings:

  - You are about to drop the column `duration_hours` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "duration_hours",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0;

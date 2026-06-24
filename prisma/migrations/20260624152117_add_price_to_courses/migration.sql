/*
  Warnings:

  - You are about to drop the column `current_plan_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_PlanToCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlanToCourse" DROP CONSTRAINT "_PlanToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlanToCourse" DROP CONSTRAINT "_PlanToCourse_B_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_current_plan_id_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "current_plan_id";

-- DropTable
DROP TABLE "_PlanToCourse";

-- DropTable
DROP TABLE "plans";

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,
    "price_paid" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `schoolId` on the `students` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_schoolId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "schoolId";

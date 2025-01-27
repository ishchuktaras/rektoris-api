/*
  Warnings:

  - You are about to drop the column `ocupation` on the `parents` table. All the data in the column will be lost.
  - Added the required column `occupation` to the `parents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parents" DROP COLUMN "ocupation",
ADD COLUMN     "occupation" TEXT NOT NULL;

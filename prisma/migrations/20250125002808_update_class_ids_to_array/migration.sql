/*
  Warnings:

  - You are about to drop the column `expirience` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappNo` on the `teachers` table. All the data in the column will be lost.
  - Added the required column `contactMethod` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsappNumber` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "expirience",
DROP COLUMN "whatsappNo",
ADD COLUMN     "contactMethod" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "whatsappNumber" TEXT NOT NULL,
ALTER COLUMN "employeeId" DROP NOT NULL,
ALTER COLUMN "qualification" DROP NOT NULL,
ALTER COLUMN "qualification" DROP DEFAULT,
ALTER COLUMN "qualification" SET DATA TYPE TEXT;

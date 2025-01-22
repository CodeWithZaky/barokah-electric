/*
  Warnings:

  - The `bank` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BankName" AS ENUM ('BRI', 'BNI', 'BTN', 'BSI', 'MANDIRI');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "bank",
ADD COLUMN     "bank" "BankName";

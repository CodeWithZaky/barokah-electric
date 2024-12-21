/*
  Warnings:

  - The values [COD] on the enum `ShippingMethod` will be removed. If these variants are still used in the database, this will fail.
  - The `paymentMethod` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'BANK_TRANSFER');

-- AlterEnum
BEGIN;
CREATE TYPE "ShippingMethod_new" AS ENUM ('JNT', 'JNE', 'SICEPAT', 'POS_INDONESIA', 'TIKI');
ALTER TABLE "Order" ALTER COLUMN "shippingMethod" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "shippingMethod" TYPE "ShippingMethod_new" USING ("shippingMethod"::text::"ShippingMethod_new");
ALTER TYPE "ShippingMethod" RENAME TO "ShippingMethod_old";
ALTER TYPE "ShippingMethod_new" RENAME TO "ShippingMethod";
DROP TYPE "ShippingMethod_old";
ALTER TABLE "Order" ALTER COLUMN "shippingMethod" SET DEFAULT 'JNT';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "shippingMethod" SET DEFAULT 'JNT';

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD';

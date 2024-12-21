/*
  Warnings:

  - You are about to drop the column `apartment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryService` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderNotice` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `province` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('COD', 'JNT');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "apartment",
DROP COLUMN "deliveryService",
DROP COLUMN "lastname",
DROP COLUMN "orderNotice",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "shippingMethod" "ShippingMethod" NOT NULL DEFAULT 'COD',
ALTER COLUMN "country" SET DEFAULT 'Indonesia';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DEFAULT 0;

-- DropEnum
DROP TYPE "DeliveryService";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Order` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryService" AS ENUM ('COD', 'JNT');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dateTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryService" "DeliveryService" NOT NULL DEFAULT 'COD',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

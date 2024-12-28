-- This is an empty migration.

ALTER TABLE "Address" RENAME COLUMN "adress" TO "address"; 
ALTER TABLE "Order" RENAME COLUMN "adress" TO "address";
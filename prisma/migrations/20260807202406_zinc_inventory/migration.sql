-- CreateEnum
CREATE TYPE "public"."ZincTransactionType" AS ENUM ('PURCHASE', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "public"."ZincInventory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."ZincTransactionType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "ratePerKg" DOUBLE PRECISION,
    "supplier" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZincInventory_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Contractor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Furnace` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductionBatch` table. All the data in the column will be lost.
  - Added the required column `itemCategoryId` to the `ContractorRate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Shift" AS ENUM ('DAY', 'NIGHT');

-- AlterTable
ALTER TABLE "public"."Challan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."ChallanItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Contractor" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."ContractorRate" ADD COLUMN     "itemCategoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Dispatch" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."DispatchItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Furnace" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."ProductionBatch" DROP COLUMN "updatedAt",
ADD COLUMN     "shift" "public"."Shift";

-- CreateTable
CREATE TABLE "public"."ItemCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_name_key" ON "public"."ItemCategory"("name");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_idx" ON "public"."ContractorRate"("contractorId");

-- CreateIndex
CREATE INDEX "ContractorRate_itemCategoryId_idx" ON "public"."ContractorRate"("itemCategoryId");

-- CreateIndex
CREATE INDEX "ProductionBatch_contractorId_idx" ON "public"."ProductionBatch"("contractorId");

-- CreateIndex
CREATE INDEX "ProductionBatch_furnaceId_idx" ON "public"."ProductionBatch"("furnaceId");

-- CreateIndex
CREATE INDEX "ProductionBatchItem_productionBatchId_idx" ON "public"."ProductionBatchItem"("productionBatchId");

-- CreateIndex
CREATE INDEX "ProductionBatchItem_challanItemId_idx" ON "public"."ProductionBatchItem"("challanItemId");

-- AddForeignKey
ALTER TABLE "public"."ContractorRate" ADD CONSTRAINT "ContractorRate_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

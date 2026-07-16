/*
  Warnings:

  - You are about to drop the column `outputWeight` on the `ChallanItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincAddedWeight` on the `ChallanItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincCost` on the `ChallanItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincPercentage` on the `ChallanItem` table. All the data in the column will be lost.
  - You are about to drop the column `contractorAmount` on the `ProductionBatch` table. All the data in the column will be lost.
  - You are about to drop the column `contractorRate` on the `ProductionBatch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partyId,challanNumber]` on the table `Challan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractorId,itemCategoryId,size,effectiveFrom]` on the table `ContractorRate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemCategoryId` to the `ChallanItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `contractorId` on table `ProductionBatch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `furnaceId` on table `ProductionBatch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shift` on table `ProductionBatch` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `contractorAmount` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractorRate` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputWeight` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zincAddedWeight` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zincPercentage` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductionBatch" DROP CONSTRAINT "ProductionBatch_contractorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductionBatch" DROP CONSTRAINT "ProductionBatch_furnaceId_fkey";

-- AlterTable
ALTER TABLE "public"."ChallanItem" DROP COLUMN "outputWeight",
DROP COLUMN "zincAddedWeight",
DROP COLUMN "zincCost",
DROP COLUMN "zincPercentage",
ADD COLUMN     "itemCategoryId" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "public"."ContractorRate" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "public"."ProductionBatch" DROP COLUMN "contractorAmount",
DROP COLUMN "contractorRate",
ALTER COLUMN "contractorId" SET NOT NULL,
ALTER COLUMN "furnaceId" SET NOT NULL,
ALTER COLUMN "shift" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductionBatchItem" ADD COLUMN     "contractorAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "contractorRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "outputWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "zincAddedWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "zincPercentage" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "Challan_partyId_idx" ON "public"."Challan"("partyId");

-- CreateIndex
CREATE INDEX "Challan_receivedDate_idx" ON "public"."Challan"("receivedDate");

-- CreateIndex
CREATE UNIQUE INDEX "Challan_partyId_challanNumber_key" ON "public"."Challan"("partyId", "challanNumber");

-- CreateIndex
CREATE INDEX "ChallanItem_challanId_idx" ON "public"."ChallanItem"("challanId");

-- CreateIndex
CREATE INDEX "ChallanItem_itemCategoryId_idx" ON "public"."ChallanItem"("itemCategoryId");

-- CreateIndex
CREATE INDEX "ChallanItem_itemCategoryId_size_idx" ON "public"."ChallanItem"("itemCategoryId", "size");

-- CreateIndex
CREATE INDEX "ChallanItem_status_idx" ON "public"."ChallanItem"("status");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_itemCategoryId_size_idx" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "size");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_itemCategoryId_size_effectiveFr_idx" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "size", "effectiveFrom");

-- CreateIndex
CREATE INDEX "ContractorRate_isActive_idx" ON "public"."ContractorRate"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ContractorRate_contractorId_itemCategoryId_size_effectiveFr_key" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "size", "effectiveFrom");

-- CreateIndex
CREATE INDEX "Dispatch_dispatchDate_idx" ON "public"."Dispatch"("dispatchDate");

-- CreateIndex
CREATE INDEX "ProductionBatch_processDate_idx" ON "public"."ProductionBatch"("processDate");

-- CreateIndex
CREATE INDEX "ProductionBatchItem_productionBatchId_challanItemId_idx" ON "public"."ProductionBatchItem"("productionBatchId", "challanItemId");

-- CreateIndex
CREATE INDEX "ProductionBatchItem_createdAt_idx" ON "public"."ProductionBatchItem"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."ChallanItem" ADD CONSTRAINT "ChallanItem_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionBatch" ADD CONSTRAINT "ProductionBatch_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionBatch" ADD CONSTRAINT "ProductionBatch_furnaceId_fkey" FOREIGN KEY ("furnaceId") REFERENCES "public"."Furnace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

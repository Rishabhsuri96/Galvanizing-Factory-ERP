/*
  Warnings:

  - You are about to drop the column `size` on the `ChallanItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincAddedWeight` on the `ProductionBatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincPercentage` on the `ProductionBatchItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productionBatchId,challanItemId]` on the table `ProductionBatchItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sizeId` to the `ChallanItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `itemCategoryId` on table `ChallanItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contractorAmount` on table `ProductionBatchItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contractorRate` on table `ProductionBatchItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."ChallanItem" DROP CONSTRAINT "ChallanItem_itemCategoryId_fkey";

-- DropIndex
DROP INDEX "public"."ChallanItem_itemCategoryId_size_idx";

-- AlterTable
ALTER TABLE "public"."ChallanItem" DROP COLUMN "size",
ADD COLUMN     "sizeId" INTEGER NOT NULL,
ALTER COLUMN "itemCategoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductionBatch" ALTER COLUMN "shift" SET DEFAULT 'DAY';

-- AlterTable
ALTER TABLE "public"."ProductionBatchItem" DROP COLUMN "zincAddedWeight",
DROP COLUMN "zincPercentage",
ADD COLUMN     "rateSourceId" INTEGER,
ALTER COLUMN "contractorAmount" SET NOT NULL,
ALTER COLUMN "contractorRate" SET NOT NULL;

-- CreateIndex
CREATE INDEX "ChallanItem_itemCategoryId_sizeId_idx" ON "public"."ChallanItem"("itemCategoryId", "sizeId");

-- CreateIndex
CREATE INDEX "ChallanItem_sizeId_idx" ON "public"."ChallanItem"("sizeId");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_itemCategoryId_sizeId_isActive_idx" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "sizeId", "isActive");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_itemCategoryId_isActive_idx" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionBatchItem_productionBatchId_challanItemId_key" ON "public"."ProductionBatchItem"("productionBatchId", "challanItemId");

-- AddForeignKey
ALTER TABLE "public"."ChallanItem" ADD CONSTRAINT "ChallanItem_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChallanItem" ADD CONSTRAINT "ChallanItem_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionBatchItem" ADD CONSTRAINT "ProductionBatchItem_rateSourceId_fkey" FOREIGN KEY ("rateSourceId") REFERENCES "public"."ContractorRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

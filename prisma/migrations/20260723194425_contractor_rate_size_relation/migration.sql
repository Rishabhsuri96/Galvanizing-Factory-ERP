/*
  Warnings:

  - You are about to drop the column `size` on the `ContractorRate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contractorId,itemCategoryId,sizeId,effectiveFrom]` on the table `ContractorRate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."ContractorRate_contractorId_itemCategoryId_size_effectiveFr_idx";

-- DropIndex
DROP INDEX "public"."ContractorRate_contractorId_itemCategoryId_size_effectiveFr_key";

-- DropIndex
DROP INDEX "public"."ContractorRate_contractorId_itemCategoryId_size_idx";

-- AlterTable
ALTER TABLE "public"."ContractorRate" DROP COLUMN "size",
ADD COLUMN     "sizeId" INTEGER;

-- CreateIndex
CREATE INDEX "ContractorRate_sizeId_idx" ON "public"."ContractorRate"("sizeId");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_itemCategoryId_sizeId_idx" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "sizeId");

-- CreateIndex
CREATE INDEX "ContractorRate_contractorId_itemCategoryId_sizeId_effective_idx" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "sizeId", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "ContractorRate_contractorId_itemCategoryId_sizeId_effective_key" ON "public"."ContractorRate"("contractorId", "itemCategoryId", "sizeId", "effectiveFrom");

-- AddForeignKey
ALTER TABLE "public"."ContractorRate" ADD CONSTRAINT "ContractorRate_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

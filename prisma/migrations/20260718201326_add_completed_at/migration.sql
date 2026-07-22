-- DropForeignKey
ALTER TABLE "public"."ChallanItem" DROP CONSTRAINT "ChallanItem_itemCategoryId_fkey";

-- AlterTable
ALTER TABLE "public"."ProductionBatchItem" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ProductionBatchItem_completedAt_idx" ON "public"."ProductionBatchItem"("completedAt");

-- AddForeignKey
ALTER TABLE "public"."ChallanItem" ADD CONSTRAINT "ChallanItem_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

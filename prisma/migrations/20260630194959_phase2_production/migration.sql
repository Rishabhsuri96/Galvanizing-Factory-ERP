-- AlterTable
ALTER TABLE "public"."ChallanItem" ADD COLUMN     "outputWeight" DOUBLE PRECISION,
ADD COLUMN     "zincAddedWeight" DOUBLE PRECISION,
ADD COLUMN     "zincCost" DOUBLE PRECISION,
ADD COLUMN     "zincPercentage" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."Contractor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "ratePerKg" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Furnace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Furnace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductionBatch" (
    "id" SERIAL NOT NULL,
    "batchNo" TEXT NOT NULL,
    "processDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contractorId" INTEGER,
    "furnaceId" INTEGER,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductionBatchItem" (
    "id" SERIAL NOT NULL,
    "productionBatchId" INTEGER NOT NULL,
    "challanItemId" INTEGER NOT NULL,
    "processedWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionBatchItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionBatch_batchNo_key" ON "public"."ProductionBatch"("batchNo");

-- AddForeignKey
ALTER TABLE "public"."ProductionBatch" ADD CONSTRAINT "ProductionBatch_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionBatch" ADD CONSTRAINT "ProductionBatch_furnaceId_fkey" FOREIGN KEY ("furnaceId") REFERENCES "public"."Furnace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionBatchItem" ADD CONSTRAINT "ProductionBatchItem_productionBatchId_fkey" FOREIGN KEY ("productionBatchId") REFERENCES "public"."ProductionBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductionBatchItem" ADD CONSTRAINT "ProductionBatchItem_challanItemId_fkey" FOREIGN KEY ("challanItemId") REFERENCES "public"."ChallanItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

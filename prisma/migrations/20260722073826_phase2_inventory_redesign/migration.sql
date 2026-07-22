/*
  Warnings:

  - The values [STORED,IN_PRODUCTION] on the enum `ItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currentWeight` on the `ChallanItem` table. All the data in the column will be lost.
  - You are about to drop the column `actualOutputWeight` on the `DispatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `dispatchedWeight` on the `DispatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincAddedWeight` on the `DispatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincPercentage` on the `DispatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `outputWeight` on the `ProductionBatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `processedWeight` on the `ProductionBatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincAddedWeight` on the `ProductionBatchItem` table. All the data in the column will be lost.
  - You are about to drop the column `zincPercentage` on the `ProductionBatchItem` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Challan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendingProductionWeight` to the `ChallanItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ChallanItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Contractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ContractorRate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Dispatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputWeight` to the `DispatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputWeight` to the `DispatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DispatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Furnace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ItemCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductionBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputWeight` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductionBatchItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ItemStatus_new" AS ENUM ('RECEIVED', 'PARTIALLY_PRODUCED', 'READY', 'PARTIALLY_DISPATCHED', 'COMPLETED');
ALTER TABLE "public"."ChallanItem" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."ChallanItem" ALTER COLUMN "status" TYPE "public"."ItemStatus_new" USING ("status"::text::"public"."ItemStatus_new");
ALTER TYPE "public"."ItemStatus" RENAME TO "ItemStatus_old";
ALTER TYPE "public"."ItemStatus_new" RENAME TO "ItemStatus";
DROP TYPE "public"."ItemStatus_old";
ALTER TABLE "public"."ChallanItem" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Challan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ChallanItem" DROP COLUMN "currentWeight",
ADD COLUMN     "pendingProductionWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "readyWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Contractor" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ContractorRate" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Dispatch" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."DispatchItem" DROP COLUMN "actualOutputWeight",
DROP COLUMN "dispatchedWeight",
DROP COLUMN "zincAddedWeight",
DROP COLUMN "zincPercentage",
ADD COLUMN     "inputWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "outputWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Furnace" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ItemCategory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Party" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductionBatch" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductionBatchItem" DROP COLUMN "outputWeight",
DROP COLUMN "processedWeight",
DROP COLUMN "zincAddedWeight",
DROP COLUMN "zincPercentage",
ADD COLUMN     "inputWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "ChallanItem_readyWeight_idx" ON "public"."ChallanItem"("readyWeight");

-- CreateIndex
CREATE INDEX "ChallanItem_pendingProductionWeight_idx" ON "public"."ChallanItem"("pendingProductionWeight");

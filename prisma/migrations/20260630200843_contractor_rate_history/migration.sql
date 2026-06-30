/*
  Warnings:

  - You are about to drop the column `ratePerKg` on the `Contractor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Contractor" DROP COLUMN "ratePerKg";

-- AlterTable
ALTER TABLE "public"."ProductionBatch" ADD COLUMN     "contractorAmount" DOUBLE PRECISION,
ADD COLUMN     "contractorRate" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."ContractorRate" (
    "id" SERIAL NOT NULL,
    "contractorId" INTEGER NOT NULL,
    "ratePerKg" DOUBLE PRECISION NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractorRate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ContractorRate" ADD CONSTRAINT "ContractorRate_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

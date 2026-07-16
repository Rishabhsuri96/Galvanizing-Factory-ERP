/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Furnace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Contractor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "public"."ContractorRate" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Furnace_name_key" ON "public"."Furnace"("name");

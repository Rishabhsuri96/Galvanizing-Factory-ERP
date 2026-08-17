/*
  Warnings:

  - Added the required column `type` to the `ChemicalInventory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ChemicalType" AS ENUM ('IN', 'OUT');

-- AlterTable
ALTER TABLE "public"."ChemicalInventory" ADD COLUMN     "type" "public"."ChemicalType" NOT NULL;

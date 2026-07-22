ALTER TABLE "public"."ProductionBatchItem"
ALTER COLUMN "outputWeight" DROP NOT NULL,
ALTER COLUMN "zincAddedWeight" DROP NOT NULL,
ALTER COLUMN "zincPercentage" DROP NOT NULL,
ALTER COLUMN "contractorRate" DROP NOT NULL,
ALTER COLUMN "contractorAmount" DROP NOT NULL;

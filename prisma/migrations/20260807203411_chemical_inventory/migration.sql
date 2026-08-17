-- CreateTable
CREATE TABLE "public"."ChemicalInventory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chemical" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "supplier" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChemicalInventory_pkey" PRIMARY KEY ("id")
);

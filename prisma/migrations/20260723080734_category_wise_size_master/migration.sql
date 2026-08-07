-- CreateTable
CREATE TABLE "public"."Size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "itemCategoryId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Size_itemCategoryId_idx" ON "public"."Size"("itemCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Size_itemCategoryId_name_key" ON "public"."Size"("itemCategoryId", "name");

-- AddForeignKey
ALTER TABLE "public"."Size" ADD CONSTRAINT "Size_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "public"."ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

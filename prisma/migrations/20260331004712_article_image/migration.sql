-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "public"."Article"("publishedAt");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "public"."Article"("slug");

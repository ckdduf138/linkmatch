-- AlterTable
ALTER TABLE "Room" ADD COLUMN "frozenAt" DATETIME;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "sourceId" TEXT;

-- CreateIndex
CREATE INDEX "Room_frozenAt_idx" ON "Room"("frozenAt");

-- CreateIndex
CREATE INDEX "Question_sourceId_idx" ON "Question"("sourceId");

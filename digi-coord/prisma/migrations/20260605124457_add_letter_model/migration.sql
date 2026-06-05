-- CreateTable
CREATE TABLE "Letter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workerId" INTEGER NOT NULL,
    "sender" TEXT,
    "purpose" TEXT,
    "actionRequired" TEXT,
    "deadline" DATETIME,
    "explanation" TEXT,
    "photoPath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "aiRaw" TEXT,
    "aiConfidence" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Letter_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Letter_workerId_idx" ON "Letter"("workerId");

-- CreateIndex
CREATE INDEX "Letter_workerId_createdAt_idx" ON "Letter"("workerId", "createdAt");

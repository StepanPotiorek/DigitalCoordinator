-- CreateTable
CREATE TABLE "FaqFeedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faqId" INTEGER NOT NULL,
    "helpful" BOOLEAN NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FaqFeedback_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "Faq" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FaqFeedback_faqId_idx" ON "FaqFeedback"("faqId");

-- CreateIndex
CREATE INDEX "FaqFeedback_helpful_idx" ON "FaqFeedback"("helpful");

-- DropIndex
DROP INDEX "Accommodation_workerId_idx";

-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "countryOfResidence" TEXT,
    "currentEmployer" TEXT,
    "currentPosition" TEXT,
    "englishLevel" TEXT,
    "preferredPosition" TEXT,
    "availableStartDate" TEXT,
    "interestedLongTerm" BOOLEAN,
    "validPassport" BOOLEAN,
    "validDriversLicense" BOOLEAN,
    "driversLicenseCategory" TEXT,
    "drivingExperience" TEXT,
    "additionalComments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Worker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "employer" TEXT,
    "city" TEXT,
    "accommodation" TEXT,
    "arrivalDate" DATETIME,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
    "onboardingStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "employeeCardStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Worker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Worker" ("accommodation", "arrivalDate", "city", "createdAt", "email", "emergencyContactName", "emergencyContactPhone", "employeeCardStatus", "employer", "id", "name", "onboardingStatus", "status", "updatedAt", "whatsapp") SELECT "accommodation", "arrivalDate", "city", "createdAt", "email", "emergencyContactName", "emergencyContactPhone", "employeeCardStatus", "employer", "id", "name", "onboardingStatus", "status", "updatedAt", "whatsapp" FROM "Worker";
DROP TABLE "Worker";
ALTER TABLE "new_Worker" RENAME TO "Worker";
CREATE UNIQUE INDEX "Worker_userId_key" ON "Worker"("userId");
CREATE UNIQUE INDEX "Worker_email_key" ON "Worker"("email");
CREATE INDEX "Worker_employer_idx" ON "Worker"("employer");
CREATE INDEX "Worker_status_idx" ON "Worker"("status");
CREATE INDEX "Worker_onboardingStatus_idx" ON "Worker"("onboardingStatus");
CREATE INDEX "Worker_createdAt_idx" ON "Worker"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_userId_key" ON "CandidateProfile"("userId");

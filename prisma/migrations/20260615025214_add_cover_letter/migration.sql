-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'wishlist',
    "source" TEXT NOT NULL DEFAULT 'other',
    "coverLetter" BOOLEAN NOT NULL DEFAULT false,
    "appliedDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Application" ("appliedDate", "company", "createdAt", "id", "jobUrl", "notes", "role", "source", "status", "updatedAt") SELECT "appliedDate", "company", "createdAt", "id", "jobUrl", "notes", "role", "source", "status", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'wishlist',
    "appliedDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

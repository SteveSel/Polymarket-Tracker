-- CreateTable
CREATE TABLE "Whale" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

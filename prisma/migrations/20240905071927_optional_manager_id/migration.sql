-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "managerId" TEXT,
    "status" BOOLEAN NOT NULL
);
INSERT INTO "new_Employee" ("emailAddress", "firstName", "id", "lastName", "managerId", "status", "telephoneNumber") SELECT "emailAddress", "firstName", "id", "lastName", "managerId", "status", "telephoneNumber" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_emailAddress_key" ON "Employee"("emailAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

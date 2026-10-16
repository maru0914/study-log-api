-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "api_token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_api_token_key" ON "users"("api_token");

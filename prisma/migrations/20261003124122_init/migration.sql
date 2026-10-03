-- CreateTable
CREATE TABLE "study_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "studied_at" DATETIME NOT NULL,
    "started_at" DATETIME,
    "ended_at" DATETIME,
    "subject" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "study_logs_user_id_studied_at_idx" ON "study_logs"("user_id", "studied_at");

-- CreateIndex
CREATE INDEX "study_logs_user_id_started_at_idx" ON "study_logs"("user_id", "started_at");

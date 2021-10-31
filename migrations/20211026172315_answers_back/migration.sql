-- DropIndex
DROP INDEX "Poll_answers_key";

-- CreateIndex
CREATE INDEX "Poll_answers_idx" ON "Poll"("answers");

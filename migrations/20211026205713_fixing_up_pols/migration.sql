/*
  Warnings:

  - You are about to drop the column `answers` on the `Poll` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_answers_fkey";

-- DropIndex
DROP INDEX "Poll_answers_idx";

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "answers";

-- AlterTable
ALTER TABLE "PollAnswer" ADD COLUMN     "poll" TEXT;

-- CreateIndex
CREATE INDEX "PollAnswer_poll_idx" ON "PollAnswer"("poll");

-- AddForeignKey
ALTER TABLE "PollAnswer" ADD CONSTRAINT "PollAnswer_poll_fkey" FOREIGN KEY ("poll") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

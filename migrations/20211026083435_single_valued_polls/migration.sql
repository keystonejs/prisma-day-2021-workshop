/*
  Warnings:

  - You are about to drop the column `poll` on the `PollAnswer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[answers]` on the table `Poll` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PollAnswer" DROP CONSTRAINT "PollAnswer_poll_fkey";

-- DropIndex
DROP INDEX "PollAnswer_poll_idx";

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "answers" TEXT;

-- AlterTable
ALTER TABLE "PollAnswer" DROP COLUMN "poll";

-- CreateIndex
CREATE UNIQUE INDEX "Poll_answers_key" ON "Poll"("answers");

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_answers_fkey" FOREIGN KEY ("answers") REFERENCES "PollAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

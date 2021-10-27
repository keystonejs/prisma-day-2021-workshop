/*
  Warnings:

  - You are about to drop the column `pollAnswers` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pollAnswers_fkey";

-- DropIndex
DROP INDEX "User_pollAnswers_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pollAnswers";

-- CreateTable
CREATE TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PollAnswer_answeredByUsers_User_pollAnswers_AB_unique" ON "_PollAnswer_answeredByUsers_User_pollAnswers"("A", "B");

-- CreateIndex
CREATE INDEX "_PollAnswer_answeredByUsers_User_pollAnswers_B_index" ON "_PollAnswer_answeredByUsers_User_pollAnswers"("B");

-- AddForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" ADD FOREIGN KEY ("A") REFERENCES "PollAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

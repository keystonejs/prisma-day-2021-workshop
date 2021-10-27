/*
  Warnings:

  - You are about to drop the `_PollAnswer_answeredByUsers_User_pollAnswers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" DROP CONSTRAINT "_PollAnswer_answeredByUsers_User_pollAnswers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" DROP CONSTRAINT "_PollAnswer_answeredByUsers_User_pollAnswers_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pollAnswers" TEXT;

-- DropTable
DROP TABLE "_PollAnswer_answeredByUsers_User_pollAnswers";

-- CreateIndex
CREATE INDEX "User_pollAnswers_idx" ON "User"("pollAnswers");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pollAnswers_fkey" FOREIGN KEY ("pollAnswers") REFERENCES "PollAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `_Label_posts_Post_labels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PollAnswer_answeredByUsers_User_pollAnswers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Label_posts_Post_labels" DROP CONSTRAINT "_Label_posts_Post_labels_A_fkey";

-- DropForeignKey
ALTER TABLE "_Label_posts_Post_labels" DROP CONSTRAINT "_Label_posts_Post_labels_B_fkey";

-- DropForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" DROP CONSTRAINT "_PollAnswer_answeredByUsers_User_pollAnswers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" DROP CONSTRAINT "_PollAnswer_answeredByUsers_User_pollAnswers_B_fkey";

-- DropTable
DROP TABLE "_Label_posts_Post_labels";

-- DropTable
DROP TABLE "_PollAnswer_answeredByUsers_User_pollAnswers";

-- CreateTable
CREATE TABLE "_Label_posts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PollAnswer_answeredByUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Label_posts_AB_unique" ON "_Label_posts"("A", "B");

-- CreateIndex
CREATE INDEX "_Label_posts_B_index" ON "_Label_posts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PollAnswer_answeredByUsers_AB_unique" ON "_PollAnswer_answeredByUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_PollAnswer_answeredByUsers_B_index" ON "_PollAnswer_answeredByUsers"("B");

-- AddForeignKey
ALTER TABLE "_Label_posts" ADD FOREIGN KEY ("A") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Label_posts" ADD FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers" ADD FOREIGN KEY ("A") REFERENCES "PollAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

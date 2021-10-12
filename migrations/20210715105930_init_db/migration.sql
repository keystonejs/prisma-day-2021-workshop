-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "status" TEXT,
    "publishedDate" TIMESTAMP(3),
    "author" TEXT,
    "intro" JSONB,
    "content" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "label" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollAnswer" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "poll" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT,
    "githubUsername" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "canManageContent" BOOLEAN,
    "canManageUsers" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Label_posts_Post_labels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post.slug_unique" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post.author_index" ON "Post"("author");

-- CreateIndex
CREATE INDEX "PollAnswer.poll_index" ON "PollAnswer"("poll");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE INDEX "User.role_index" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "_Label_posts_Post_labels_AB_unique" ON "_Label_posts_Post_labels"("A", "B");

-- CreateIndex
CREATE INDEX "_Label_posts_Post_labels_B_index" ON "_Label_posts_Post_labels"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PollAnswer_answeredByUsers_User_pollAnswers_AB_unique" ON "_PollAnswer_answeredByUsers_User_pollAnswers"("A", "B");

-- CreateIndex
CREATE INDEX "_PollAnswer_answeredByUsers_User_pollAnswers_B_index" ON "_PollAnswer_answeredByUsers_User_pollAnswers"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollAnswer" ADD FOREIGN KEY ("poll") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Label_posts_Post_labels" ADD FOREIGN KEY ("A") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Label_posts_Post_labels" ADD FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" ADD FOREIGN KEY ("A") REFERENCES "PollAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

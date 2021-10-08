/*
  Warnings:

  - Made the column `name` on table `Label` required. This step will fail if there are existing NULL values in that column.
  - Made the column `label` on table `Poll` required. This step will fail if there are existing NULL values in that column.
  - Made the column `label` on table `PollAnswer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `intro` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageContent` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canManageUsers` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `githubUsername` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Label" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT E'';

-- AlterTable
ALTER TABLE "Poll" ALTER COLUMN "label" SET NOT NULL,
ALTER COLUMN "label" SET DEFAULT E'';

-- AlterTable
ALTER TABLE "PollAnswer" ALTER COLUMN "label" SET NOT NULL,
ALTER COLUMN "label" SET DEFAULT E'';

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT E'',
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "slug" SET DEFAULT E'',
ALTER COLUMN "status" SET DEFAULT E'draft',
ALTER COLUMN "intro" SET NOT NULL,
ALTER COLUMN "intro" SET DEFAULT E'[{"type":"paragraph","children":[{"text":""}]}]',
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT E'[{"type":"paragraph","children":[{"text":""}]}]';

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT E'',
ALTER COLUMN "canManageContent" SET NOT NULL,
ALTER COLUMN "canManageContent" SET DEFAULT false,
ALTER COLUMN "canManageUsers" SET NOT NULL,
ALTER COLUMN "canManageUsers" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT E'',
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DEFAULT E'',
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "githubUsername" SET NOT NULL,
ALTER COLUMN "githubUsername" SET DEFAULT E'';

-- RenameIndex
ALTER INDEX "PollAnswer.poll_index" RENAME TO "PollAnswer_poll_idx";

-- RenameIndex
ALTER INDEX "Post.author_index" RENAME TO "Post_author_idx";

-- RenameIndex
ALTER INDEX "Post.slug_unique" RENAME TO "Post_slug_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.role_index" RENAME TO "User_role_idx";

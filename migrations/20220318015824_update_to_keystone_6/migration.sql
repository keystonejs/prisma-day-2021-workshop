
ALTER TABLE "_Label_posts_Post_labels" RENAME TO "_Label_posts";
ALTER INDEX "_Label_posts_Post_labels_AB_unique" RENAME TO "_Label_posts_AB_unique";
ALTER INDEX "_Label_posts_Post_labels_B_index" RENAME TO "_Label_posts_B_index";
ALTER TABLE "_Label_posts" RENAME CONSTRAINT "_Label_posts_Post_labels_A_fkey" TO "_Label_posts_A_fkey";
ALTER TABLE "_Label_posts" RENAME CONSTRAINT "_Label_posts_Post_labels_B_fkey" TO "_Label_posts_B_fkey";


ALTER TABLE "_PollAnswer_answeredByUsers_User_pollAnswers" RENAME TO "_PollAnswer_answeredByUsers";
ALTER INDEX "_PollAnswer_answeredByUsers_User_pollAnswers_AB_unique" RENAME TO "_PollAnswer_answeredByUsers_AB_unique";
ALTER INDEX "_PollAnswer_answeredByUsers_User_pollAnswers_B_index" RENAME TO "_PollAnswer_answeredByUsers_B_index";
ALTER TABLE "_PollAnswer_answeredByUsers" RENAME CONSTRAINT "_PollAnswer_answeredByUsers_User_pollAnswers_A_fkey" TO "_PollAnswer_answeredByUsers_A_fkey";
ALTER TABLE "_PollAnswer_answeredByUsers" RENAME CONSTRAINT "_PollAnswer_answeredByUsers_User_pollAnswers_B_fkey" TO "_PollAnswer_answeredByUsers_B_fkey";

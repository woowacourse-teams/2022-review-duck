SET
FOREIGN_KEY_CHECKS = 0;

truncate table template;
alter table template AUTO_INCREMENT = 1;
truncate table review;
alter table review AUTO_INCREMENT = 1;
truncate table review_form;
alter table review_form AUTO_INCREMENT = 1;
truncate table review_form_question;
alter table review_form_question AUTO_INCREMENT = 1;
truncate table template_question;
alter table template_question AUTO_INCREMENT = 1;
truncate table answer;
alter table answer AUTO_INCREMENT = 1;
truncate table question_answer;
alter table question_answer AUTO_INCREMENT = 1;
truncate table member;
alter table member AUTO_INCREMENT = 1;
truncate table notification;
alter table notification AUTO_INCREMENT = 1;

SET
FOREIGN_KEY_CHECKS = 1;

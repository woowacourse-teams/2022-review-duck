SET
FOREIGN_KEY_CHECKS = 0;

truncate table template;
alter table template AUTO_INCREMENT = 1;
truncate table review;
alter table review AUTO_INCREMENT = 1;
truncate table review_form;
alter table review_form AUTO_INCREMENT = 1;
truncate table question;
alter table question AUTO_INCREMENT = 1;
truncate table answer;
alter table answer AUTO_INCREMENT = 1;
truncate table question_answer;
alter table question_answer AUTO_INCREMENT = 1;

SET
FOREIGN_KEY_CHECKS = 1;

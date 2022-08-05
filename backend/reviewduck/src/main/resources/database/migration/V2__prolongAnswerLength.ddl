SET FOREIGN_KEY_CHECKS = 0;
alter table answer drop column answer_value;
alter table answer add answer_value text not null;
alter table review_form_question drop column question_value;
alter table review_form_question add question_value text not null;
alter table template_question drop column question_value;
alter table template_question add question_value text not null;
SET FOREIGN_KEY_CHECKS = 1;

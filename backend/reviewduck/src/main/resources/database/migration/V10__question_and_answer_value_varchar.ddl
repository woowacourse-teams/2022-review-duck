alter table answer
    rename column answer_value to old_answer_value;

alter table answer
    add column answer_value varchar(8000) not null;

update answer
    set answer_value = old_answer_value;

alter table answer
    drop column old_answer_value;

alter table review_form_question
    rename column question_value to old_question_value;

alter table review_form_question
    add column question_value varchar(8000) not null;

update review_form_question
    set question_value = old_question_value;

alter table review_form_question
    drop column old_question_value;

alter table template_question
    rename column question_value to old_question_value;

alter table template_question
    add column question_value varchar(8000) not null;

update template_question
    set question_value = old_question_value;

alter table template_question
    drop column old_question_value;

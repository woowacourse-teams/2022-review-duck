alter table review_form_question
    rename column description to old_description;

alter table review_form_question
    add column description varchar(8000) not null;

update review_form_question
    set description = old_description;

alter table review_form_question
    drop column old_description;

alter table template_question
    rename column description to old_description;

alter table template_question
    add column description varchar(8000) not null;

update template_question
    set description = old_description;

alter table template_question
    drop column old_description;

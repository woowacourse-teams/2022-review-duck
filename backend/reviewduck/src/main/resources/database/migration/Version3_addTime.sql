alter table review
    add column created_at DATETIME;

alter table review
    add column updated_at DATETIME;

alter table review_form
    add column created_at DATETIME;

alter table review_form
    add column updated_at DATETIME;

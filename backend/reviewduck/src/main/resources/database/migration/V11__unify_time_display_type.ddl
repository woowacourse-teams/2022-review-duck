alter table review rename column created_at to old_created_at;
alter table review rename column updated_at to old_updated_at;

alter table review add column created_at timestamp not null;
alter table review add column updated_at timestamp not null;

update review set created_at = old_created_at;
update review set updated_at = old_updated_at;

alter table review drop column old_created_at;
alter table review drop column old_updated_at;


alter table review_form rename column created_at to old_created_at;
alter table review_form rename column updated_at to old_updated_at;

alter table review_form add column created_at timestamp not null;
alter table review_form add column updated_at timestamp not null;

update review_form set created_at = old_created_at;
update review_form set updated_at = old_updated_at;

alter table review_form drop column old_created_at;
alter table review_form drop column old_updated_at;

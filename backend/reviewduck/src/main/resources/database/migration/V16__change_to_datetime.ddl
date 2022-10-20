-- review form created_at
alter table review_form
    rename column created_at to old_created_at;

alter table review_form
    add column created_at DATETIME(3) not null;

update review_form
set created_at = old_created_at;

alter table review_form drop column old_created_at;

-- review form updated_at
alter table review_form
    rename column updated_at to old_updated_at;

alter table review_form
    add column updated_at DATETIME(3) not null;

update review_form
set updated_at = old_updated_at;

alter table review_form drop column old_updated_at;

-- review created_at
alter table review
    rename column created_at to old_created_at;

alter table review
    add column created_at DATETIME(3) not null;

update review
set created_at = old_created_at;

alter table review drop column old_created_at;

-- review updated_at
alter table review
    rename column updated_at to old_updated_at;

alter table review
    add column updated_at DATETIME(3) not null;

update review
set updated_at = old_updated_at;

alter table review drop column old_updated_at;

-- template created_at
alter table template
    rename column created_at to old_created_at;

alter table template
    add column created_at DATETIME(3) not null;

update template
set created_at = old_created_at;

alter table template drop column old_created_at;

-- template updated_at
alter table template
    rename column updated_at to old_updated_at;

alter table template
    add column updated_at DATETIME(3) not null;

update template
set updated_at = old_updated_at;

alter table template drop column old_updated_at;

-- member created_at
alter table member
    rename column created_at to old_created_at;

alter table member
    add column created_at DATETIME(3) not null;

update member
set created_at = old_created_at;

alter table member drop column old_created_at;

-- member updated_at
alter table member
    rename column updated_at to old_updated_at;

alter table member
    add column updated_at DATETIME(3) not null;

update member
set updated_at = old_updated_at;

alter table member drop column old_updated_at;

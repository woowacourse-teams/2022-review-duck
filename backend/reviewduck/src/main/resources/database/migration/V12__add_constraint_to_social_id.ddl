alter table member
    rename column social_id to old_social_id;

alter table member
    add column social_id varchar(255) not null;

update member
    set social_id = old_social_id;

alter table member
    drop column old_social_id;

alter table member add constraint uk_member_social_id unique (social_id);

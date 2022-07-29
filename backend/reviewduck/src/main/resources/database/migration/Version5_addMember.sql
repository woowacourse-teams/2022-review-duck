create table member
(
    id          bigint       not null auto_increment,
    nickname    varchar(255) not null,
    profile_url varchar(255) not null,
    social_id   varchar(255) not null,
    primary key (id)
);

alter table review
    add column member_id bigint;

alter table review_form
    add column member_id bigint;

alter table template
    add column member_id bigint;

alter table review
    add foreign key (member_id) references member (id);

alter table review_form
    add foreign key (member_id) references member (id);

alter table template
    add foreign key (member_id) references member (id);

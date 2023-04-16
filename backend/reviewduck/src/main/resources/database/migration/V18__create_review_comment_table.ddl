create table review_comment
(
    id         bigint        not null auto_increment,
    review_id  bigint,
    member_id  bigint,
    content    varchar(8000) not null,
    created_at DATETIME      not null,
    updated_at DATETIME      not null,
    primary key (id)
);

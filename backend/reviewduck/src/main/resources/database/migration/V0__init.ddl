create table member
(
    id          bigint not null auto_increment,
    nickname    varchar(255),
    social_nickname varchar(255),
    profile_url varchar(255),
    social_id   varchar(255),
    primary key (id)
);

create table review_form
(
    id           bigint       not null auto_increment,
    code         varchar(255) not null,
    review_title varchar(255) not null,
    created_at   DATETIME,
    updated_at   DATETIME,
    is_active    boolean      not null,
    member_id    bigint,
    primary key (id),
    foreign key (member_id) references member (id)
);

create table answer
(
    id           bigint       not null auto_increment,
    answer_value varchar(255) not null,
    primary key (id)
);

create table review_form_question
(
    id             bigint       not null auto_increment,
    question_value varchar(255) not null,
    review_form_id bigint,
    position       integer      not null,
    primary key (id),
    foreign key (review_form_id) references review_form (id)
);

create table template
(
    id                   bigint       not null auto_increment,
    created_at           timestamp,
    updated_at           timestamp,
    template_description varchar(255) not null,
    template_title       varchar(255) not null,
    member_id            bigint,
    primary key (id),
    foreign key (member_id) references member (id)
);

create table template_question
(
    id             bigint       not null auto_increment,
    question_value varchar(255) not null,
    template_id    bigint,
    position       integer      not null,
    primary key (id),
    foreign key (template_id) references template (id)
);


create table review
(
    id             bigint not null auto_increment,
    review_form_id bigint,
    created_at     DATETIME,
    updated_at     DATETIME,
    member_id      bigint,
    primary key (id),
    foreign key (review_form_id) references review_form (id),
    foreign key (member_id) references member (id)
);

create table question_answer
(
    id                      bigint  not null auto_increment,
    answer_id               bigint,
    review_form_question_id bigint,
    review_id               bigint,
    position                integer not null,
    primary key (id),
    foreign key (answer_id) references answer (id),
    foreign key (review_form_question_id) references review_form_question (id),
    foreign key (review_id) references review (id)
);

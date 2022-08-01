SET
FOREIGN_KEY_CHECKS = 0;
create table review_form
(
    id           bigint       not null auto_increment,
    code         varchar(255) not null,
    review_title varchar(255) not null,
    created_at   DATETIME,
    updated_at   DATETIME,
    primary key (id)
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
    template_description varchar(255) not null,
    template_title       varchar(255) not null,
    primary key (id)
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
    id             bigint       not null auto_increment,
    nickname       varchar(255) not null,
    review_form_id bigint,
    created_at     DATETIME,
    updated_at     DATETIME,
    primary key (id),
    foreign key (review_form_id) references review_form (id)
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

SET
FOREIGN_KEY_CHECKS = 1;

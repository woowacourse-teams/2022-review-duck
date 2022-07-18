create table review_form
(
    id           bigint       not null auto_increment,
    code         varchar(255) not null,
    review_title varchar(255) not null,
    primary key (id)
);

create table answer
(
    id           bigint not null auto_increment,
    answer_value varchar(255),
    primary key (id)
);

create table question
(
    id             bigint       not null auto_increment,
    question_value varchar(255) not null,
    review_form_id bigint       not null,
    primary key (id),
    foreign key (review_form_id) references review_form(id)
);

create table review
(
    id             bigint       not null auto_increment,
    nickname       varchar(255) not null,
    review_form_id bigint       not null,
    primary key (id),
    foreign key (review_form_id) references review_form(id)
);


create table question_answer
(
    id                     bigint not null auto_increment,
    answer_id              bigint not null,
    question_id            bigint not null,
    review_id              bigint not null,
    question_answers_order integer,
    primary key (id),
    foreign key (answer_id) references answer(id),
    foreign key (question_id) references question(id),
    foreign key (review_id) references review(id)
);

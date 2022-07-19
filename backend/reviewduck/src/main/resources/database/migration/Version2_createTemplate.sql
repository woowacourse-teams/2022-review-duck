create table template
(
    id                   bigint       not null auto_increment,
    template_description varchar(255) not null,
    template_title       varchar(255) not null,
    primary key (id)
);

alter table question
    add column template_id bigint;

alter table question
    add foreign key (template_id) references template(id);

CREATE TABLE review_comment
(
    id         BITINT        NOT NULL AUTO_INCREMENT,
    review_id  BIGINT        NOT NULL,
    member_id  BIGINT        NOT NULL,
    content    VARCHAR(8000) NOT NULL,
    created_at DATETIME      NOT NULL,
    updated_at DATETIME      NOT NULL,
    PRIMARY KEY (id);
);
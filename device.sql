SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS resource_type;
CREATE TABLE resource_type
(
    id          int(11)     NOT NULL AUTO_INCREMENT,
    name        varchar(50) NOT NULL,
    table_name  varchar(50) NOT NULL,
    description varchar(200)         DEFAULT NULL,
    create_time datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)          DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS resource;
CREATE TABLE resource
(
    id          int(11)     NOT NULL AUTO_INCREMENT,
    name        varchar(50) NOT NULL,
    description varchar(200)         DEFAULT NULL,
    create_time datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)          DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS state;
CREATE TABLE state
(
    id          int(11)     NOT NULL AUTO_INCREMENT,
    name        varchar(50) NOT NULL,
    description varchar(200)         DEFAULT NULL,
    create_time datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)          DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS analyzer;
CREATE TABLE analyzer
(
    id            int(11)     NOT NULL AUTO_INCREMENT,
    name          varchar(50) NOT NULL,
    description   varchar(200)         DEFAULT NULL,
    image         varchar(100)         DEFAULT NULL,
    organization_id int(10) unsigned NOT NULL COMMENT '组织id',
    manager_id    int(10) unsigned NOT NULL COMMENT '管理员id',
    state_id      int(10) unsigned NOT NULL COMMENT '状态id',
    create_time   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time   datetime(3)          DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS borrow;
CREATE TABLE borrow
(
    id            int(11)     NOT NULL AUTO_INCREMENT,
    user_id       int(10) unsigned NOT NULL COMMENT '用户id',
    resource_type int(10) unsigned NOT NULL COMMENT '资源类型id',
    resource_id   int(10) unsigned NOT NULL COMMENT '资源id',
    comment       varchar(200)         DEFAULT NULL,
    borrow_data   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    expect_return_data  datetime(3) NOT NULL,
    return_data   datetime(3),
    update_time   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

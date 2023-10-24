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

DROP TABLE IF EXISTS phone;
CREATE TABLE phone
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
    resource_type varchar(50)      NOT NULL COMMENT '资源类型',
    resource_id   int(10) unsigned NOT NULL COMMENT '资源id',
    borrow_reason varchar(200)         DEFAULT NULL,
    borrow_date   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    expect_return_date  datetime(3) NOT NULL,
    return_date   datetime(3),
    comment       varchar(200)         DEFAULT NULL,
    create_time   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time   datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time   datetime(3)          DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 插入数据
-- ----------------------------
BEGIN;
INSERT INTO state(id, name, description) VALUES
  (1,'空闲','可领出'),
  (2,'领出','已领出'),
  (3,'禁用','禁止领出');

INSERT INTO resource_type(id, name, table_name, description) VALUES
  (1,'抓包工具','analyzer','无线抓包工具'),
  (2,'手机','phone','测试手机');

INSERT INTO analyzer(id, name, description, organization_id, manager_id, state_id) VALUES
  (1,'Ellisys','行政部',1,1,1),
  (2,'Ellisys','测试部',1,1,1),
  (3,'Ellisys','行政部',2,2,1),
  (4,'Frontline','行政部',2,2,1),
  (5,'Ellisys','行政部',3,4,1),
  (6,'Ellisys','测试部',4,5,1);

INSERT INTO phone(id, name, description, organization_id, manager_id, state_id) VALUES
  (1,'iPhone8','iOS 15.7',1,3,1),
  (2,'mate30-TAS-AL00','Harmony OS 2.0.0',1,3,1),
  (3,'OPPO Find X3','Android 13',1,3,1),
  (4,'iQOO Z1x','Android 11',1,3,1),
  (5,'MI 11','Android 12',1,3,1),
  (6,'iPhone8','iOS 15.7',3,6,1),
  (7,'mate20 Pro','',3,6,1),
  (8,'MI 5X','',3,6,1);

COMMIT;

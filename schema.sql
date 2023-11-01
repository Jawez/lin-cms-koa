SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 文件表
-- ----------------------------
DROP TABLE IF EXISTS lin_file;
CREATE TABLE lin_file
(
    id          int(10) unsigned NOT NULL AUTO_INCREMENT,
    path        varchar(500)     NOT NULL,
    type        varchar(10)      NOT NULL DEFAULT 'LOCAL' COMMENT 'LOCAL 本地，REMOTE 远程',
    name        varchar(100)     NOT NULL,
    extension   varchar(50)               DEFAULT NULL,
    size        int(11)                   DEFAULT NULL,
    md5         varchar(40)               DEFAULT NULL COMMENT 'md5值，防止上传重复文件',
    create_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)               DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY md5_del (md5, delete_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 日志表
-- ----------------------------
DROP TABLE IF EXISTS lin_log;
CREATE TABLE lin_log
(
    id          int(10) unsigned NOT NULL AUTO_INCREMENT,
    message     varchar(450)              DEFAULT NULL,
    user_id     int(10) unsigned NOT NULL,
    username    varchar(24)               DEFAULT NULL,
    status_code int(11)                   DEFAULT NULL,
    method      varchar(20)               DEFAULT NULL,
    path        varchar(50)               DEFAULT NULL,
    permission  varchar(100)              DEFAULT NULL,
    create_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)               DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 权限表
-- ----------------------------
DROP TABLE IF EXISTS lin_permission;
CREATE TABLE lin_permission
(
    id          int(10) unsigned NOT NULL AUTO_INCREMENT,
    name        varchar(60)      NOT NULL COMMENT '权限名称，例如：访问首页',
    module      varchar(50)      NOT NULL COMMENT '权限所属模块，例如：人员管理',
    mount       tinyint(1)       NOT NULL DEFAULT 1 COMMENT '0：关闭 1：开启',
    create_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)               DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 分组表
-- ----------------------------
DROP TABLE IF EXISTS lin_group;
CREATE TABLE lin_group
(
    id          int(10) unsigned NOT NULL AUTO_INCREMENT,
    name        varchar(60)      NOT NULL COMMENT '分组名称，例如：搬砖者',
    info        varchar(255)              DEFAULT NULL COMMENT '分组信息：例如：搬砖的人',
    level       tinyint(2)       NOT NULL DEFAULT 3 COMMENT '分组级别 1：root 2：guest 3：user（root、guest分组只能存在一个)',
    create_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)               DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY name_del (name, delete_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 分组-权限表
-- ----------------------------
DROP TABLE IF EXISTS lin_group_permission;
CREATE TABLE lin_group_permission
(
    id            int(10) unsigned NOT NULL AUTO_INCREMENT,
    group_id      int(10) unsigned NOT NULL COMMENT '分组id',
    permission_id int(10) unsigned NOT NULL COMMENT '权限id',
    PRIMARY KEY (id),
    KEY group_id_permission_id (group_id, permission_id) USING BTREE COMMENT '联合索引'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 用户基本信息表
-- ----------------------------
DROP TABLE IF EXISTS lin_user;
CREATE TABLE lin_user
(
    id          int(10) unsigned NOT NULL AUTO_INCREMENT,
    username    varchar(24)      NOT NULL COMMENT '用户名，唯一',
    nickname    varchar(24)               DEFAULT NULL COMMENT '用户昵称',
    avatar      varchar(500)              DEFAULT NULL COMMENT '头像url',
    email       varchar(100)              DEFAULT NULL COMMENT '邮箱',
    create_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time datetime(3)               DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY username_del (username, delete_time),
    UNIQUE KEY email_del (email, delete_time)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 用户授权信息表
# id
# user_id
# identity_type 登录类型（手机号 邮箱 用户名）或第三方应用名称（微信 微博等）
# identifier 标识（手机号 邮箱 用户名或第三方应用的唯一标识）
# credential 密码凭证（站内的保存密码，站外的不保存或保存token）
-- ----------------------------
DROP TABLE IF EXISTS lin_user_identity;
CREATE TABLE lin_user_identity
(
    id            int(10) unsigned NOT NULL AUTO_INCREMENT,
    user_id       int(10) unsigned NOT NULL COMMENT '用户id',
    identity_type varchar(100)     NOT NULL,
    identifier    varchar(100),
    credential    varchar(100),
    create_time   datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    update_time   datetime(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    delete_time   datetime(3)               DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

-- ----------------------------
-- 用户-分组表
-- ----------------------------
DROP TABLE IF EXISTS lin_user_group;
CREATE TABLE lin_user_group
(
    id       int(10) unsigned NOT NULL AUTO_INCREMENT,
    user_id  int(10) unsigned NOT NULL COMMENT '用户id',
    group_id int(10) unsigned NOT NULL COMMENT '分组id',
    PRIMARY KEY (id),
    KEY user_id_group_id (user_id, group_id) USING BTREE COMMENT '联合索引'
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- 组织表
-- ----------------------------
DROP TABLE IF EXISTS organization;
CREATE TABLE organization
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

-- ----------------------------
-- 插入数据
-- ----------------------------
BEGIN;
INSERT INTO lin_user(id, username, nickname) VALUES
  ( 1, 'root', '超级管理员'),
  ( 2, 'device', '设备管理员'),
  ( 3, 'analyzer1', '抓包工具管理员1'),
  ( 4, 'analyzer2', '抓包工具管理员2'),
  ( 5, 'phone1', '测试手机管理员1'),
  ( 6, 'phone2', '测试手机管理员2'),
  ( 7, 'user1', '用户1'),
  ( 8, 'user2', '用户2'),
  ( 9, 'user3', '用户3'),
  (10, 'user4', '用户4'),
  (11, 'user5', '用户5'),
  (12, 'user6', '用户6'),
  (13, 'user7', '用户7'),
  (14, 'user8', '用户8'),
  (15, 'user9', '用户9');

INSERT INTO lin_user_identity (id, user_id, identity_type, identifier, credential) VALUES
  ( 1,  1, 'USERNAME_PASSWORD', 'root', 'sha1$cf896d1f$1$d205a303c782feaddb82c6de1d1bbbf4e777dc96'),
  ( 2,  2, 'USERNAME_PASSWORD', 'device', 'sha1$fa12be6b$1$010620b08931337a30a66cc18f6e163c79e85a47'),
  ( 3,  3, 'USERNAME_PASSWORD', 'analyzer1', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  ( 4,  4, 'USERNAME_PASSWORD', 'analyzer2', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  ( 5,  5, 'USERNAME_PASSWORD', 'phone1', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  ( 6,  6, 'USERNAME_PASSWORD', 'phone2', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  ( 7,  7, 'USERNAME_PASSWORD', 'user1', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  ( 8,  8, 'USERNAME_PASSWORD', 'user2', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  ( 9,  9, 'USERNAME_PASSWORD', 'user3', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  (10, 10, 'USERNAME_PASSWORD', 'user4', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  (11, 11, 'USERNAME_PASSWORD', 'user5', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  (12, 12, 'USERNAME_PASSWORD', 'user6', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  (13, 13, 'USERNAME_PASSWORD', 'user7', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  (14, 14, 'USERNAME_PASSWORD', 'user8', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07'),
  (15, 15, 'USERNAME_PASSWORD', 'user9', 'sha1$c419e500$1$84869e5560ebf3de26b6690386484929456d6c07');

INSERT INTO lin_group(id, name, info, level) VALUES
  (1, 'root', '超级用户组', 1),
  (2, 'device', '设备管理组', 2),
  (3, 'analyzer', '抓包工具管理组', 3),
  (4, 'phone', '测试手机管理组', 3),
  (5, 'user', '普通用户组', 4);

INSERT INTO lin_user_group(id, user_id, group_id) VALUES
  ( 1, 1, 1),
  ( 2, 2, 2),
  ( 3, 3, 3),
  ( 4, 4, 3),
  ( 5, 5, 4),
  ( 6, 6, 4),
  ( 7, 7, 5),
  ( 8, 8, 5),
  ( 9, 9, 5),
  (10,10, 5),
  (11,11, 5),
  (12,12, 5),
  (13,13, 5),
  (14,14, 5),
  (15,15, 5),
  (16, 2, 3),
  (17, 2, 4);

INSERT INTO lin_group_permission(id, group_id, permission_id) VALUES
  (1,2, 7),
  (2,2, 8),
  (3,2, 9),
  (4,3, 4),
  (5,3, 5),
  (6,3, 6),
  (7,4,10),
  (8,4,11),
  (9,4,12);

INSERT INTO organization(id, name, description) VALUES
  (1,'深圳','广东省深圳市'),
  (2,'重庆','重庆市'),
  (3,'北京','北京市'),
  (4,'上海','上海市');

COMMIT;

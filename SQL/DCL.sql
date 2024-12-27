-- Active: 1732688863205@@127.0.0.1@3306@todo
-- 개발 계정
CREATE USER 'developer'@'localhost' IDENTIFIED BY 'todo';

GRANT ALL PRIVILEGES ON todo.* TO 'developer'@'localhost';

-- 사용자 계정
CREATE USER 'user'@'localhost' IDENTIFIED BY 'user';

GRANT ALL PRIVILEGES ON todo.* TO 'developer'@'localhost';

-- 권한 확인
FLUSH PRIVILEGES;

select * from mysql.user;

SHOW GRANTS for 'developer'@'localhost';

SHOW GRANTS for 'user'@'localhost';

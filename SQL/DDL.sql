-- Active: 1732688616928@@127.0.0.1@3306@todo
-- Active: 1733295583465@@127.0.0.1@3306@mysql
CREATE DATABASE todo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE todo;

CREATE TABLE keyword (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 키워드 id',
  user_id INT NOT NULL COMMENT '사용자 id',
  keyword VARCHAR(50) NOT NULL COMMENT '키워드 명',
  CONSTRAINT fk_todo_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) COMMENT '키워드 테이블';

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 사용자 id',
  kakao_id VARCHAR(255) NULL COMMENT '카카오 고유 ID',
  google_id VARCHAR(255) NULL COMMENT '구글 고유 ID',
  nickname VARCHAR(20) NOT NULL COMMENT '닉네임',
  pw VARCHAR(20) NOT NULL COMMENT '비밀번호',
  resetToken VARCHAR(255) COMMENT '비밀번호 재설정 토큰',
  email VARCHAR(50) NOT NULL COMMENT '이메일',
  profile_image VARCHAR(255) COMMENT '사용자 프로필 이미지',
  update_date DATETIME NOT NULL COMMENT '사용자 계정 수정일'
) COMMENT '사용자 테이블';

CREATE TABLE todo (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 투두 id',
  user_id INT NOT NULL COMMENT '사용자 id',
  keyword_id INT COMMENT '키워드 id',
  title VARCHAR(50) COMMENT '제목',
  priority ENUM('low', 'medium', 'high') COMMENT '우선순위',
  date DATETIME NOT NULL COMMENT '투두 날짜',
  write_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 날짜',
  update_date DATETIME COMMENT '수정 날짜',
  deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
  deleted_at DATETIME COMMENT '삭제 시간',
  CONSTRAINT fk_todo_keyword FOREIGN KEY (keyword_id) REFERENCES keyword(id),
  CONSTRAINT fk_todo_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) 

-- COMMENT '투두 테이블';

CREATE TABLE todo_content (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 콘텐츠 id',
  todo_id INT NOT NULL COMMENT '투두 id',
  content VARCHAR(255) NOT NULL COMMENT '내용',
  state BOOLEAN NOT NULL COMMENT '진행상태',
  CONSTRAINT fk_todo_content_todo FOREIGN KEY (todo_id) REFERENCES todo(id) ON DELETE CASCADE
) COMMENT '투두 콘텐츠 테이블';

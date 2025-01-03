-- Active: 1732688616928@@127.0.0.1@3306@todo
-- 키워드 추가
INSERT INTO keyword (user_id, keyword) VALUES 
(1, 'work'), 
(1, 'study'), 
(2, 'exercise');

-- 사용자 추가
INSERT INTO user (nickname, pw, email, update_date) 
VALUES 
('tester1', '12345', 'tester1@example.com', NOW()),
('tester2', '12345', 'tester2@example.com', NOW());

-- 투두 테이블 추가
INSERT INTO todo (user_id, keyword_id, title, priority, date, write_date, update_date) VALUES 
(1, 1, 'Finish project', 'high', '2024-12-22', NOW(), NULL),
(1, 2, 'Read a book', 'medium', '2024-12-20', NOW(), NULL),
(2, 1, NULL, NULL, NOW(), '2024-12-24', NULL);

-- 투두 내용 추가
INSERT INTO todo_content (todo_id, content, state) VALUES 
(1, 'Write introduction', FALSE),
(1, 'Review draft', FALSE),
(2, 'Choose a book', TRUE);

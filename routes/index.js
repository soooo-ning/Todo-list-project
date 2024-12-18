const express = require('express');
const router = express.Router();
const controller = require('../controllers/AuthController');
const controller = require('../controllers/TodoController');
const controller = require('../controllers/UserController');

// Auth signin
router.get('/', controller.getSignIn);
router.post('/auth/api/sign-in', controller.signIn);
router.post('/auth/api/sign-in/token', controller.jwtToken);
router.post('/auth/api/sign-in/google', controller.signInGoogle);
router.post('/auth/api/sign-in/kakao', controller.signInKakao);

// Auth signup
router.get('/auth/sign-up', controller.getSignUp);
router.post('/auth/api/sign-up', controller.signUp);
router.get('/auth/api/sign-up/check', controller.duplicatedEmail);

// Auth search pw
router.get('/auth/search-pw', controller.getSearchPw);
router.get('/auth/api/search-pw', controller.searchPw);

// User
router.get('/user/profile', controller.getProfile);
router.patch('/user/api/profile', controller.editProfile);
router.get('/user/reset-pw', controller.getResetPw);
router.patch('/user/api/reset-pw', controller.resetPw);
router.get('/user/api/delete-account', controller.getDeleteAccount);
router.delete('/user/api/delete-account', controller.deleteAccount);

// POST	/todo/api/write	writeTodo(투두 생성)
// GET	/todo/api/get?id={id}	getTodo(특정 투두 조회)
// PATCH	/todo/api/content	editTodo(투두 내용 수정)
// PATCH	/todo/api/state	updateState(상태 업데이트)
// DELETE	/todo/api/delete	deleteTodo(투두 삭제)
// GET	/todo/api/search?title={title}&content={content}	searchTodo(투두 검색)
// GET	/todo/api/calander	calendarList(날짜 리스트 조회)
// GET	/todo/api/list/priority	priorityList(우선순위 리스트)
// GET	/todo/api/list/keyword?keyword={keyword}	keywordList(키워드 리스트)
// GET	/todo/api/deleted-todo	deleteList(휴지통)

module.exports = router;

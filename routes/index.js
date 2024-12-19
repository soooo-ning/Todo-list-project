const express = require('express');
const router = express.Router();

// 컨트롤러를 각각 선언
const authController = require('../controllers/AuthController');
const todoController = require('../controllers/TodoController');
const userController = require('../controllers/UserController');

// Auth signin
router.get('/', authController.getSignIn);
router.post('/auth/api/sign-in', authController.signIn);
router.post('/auth/api/sign-in/token', authController.jwtToken);
router.post('/auth/api/sign-in/google', authController.signInGoogle);
router.post('/auth/api/sign-in/kakao', authController.signInKakao);

// Auth signup
router.get('/auth/sign-up', authController.getSignUp);
router.post('/auth/api/sign-up', authController.signUp);
router.get('/auth/api/sign-up/check', authController.duplicatedEmail);

// Auth search pw
router.get('/auth/search-pw', authController.getSearchPw);
router.get('/auth/api/search-pw', authController.searchPw);

// User
router.get('/user/profile', userController.getProfile);
router.patch('/user/api/profile', userController.editProfile);
router.get('/user/reset-pw', userController.getResetPw);
router.patch('/user/api/reset-pw', userController.resetPw);
router.get('/user/api/delete-account', userController.getDeleteAccount);
router.delete('/user/api/delete-account', userController.deleteAccount);

// Todo CRUD
router.get('/todo/api/write', todoController.getWriteTodo);
router.post('/todo/api/write', todoController.writeTodo);
router.get('/todo/api/get', todoController.getTodo);
router.patch('/todo/api/content', todoController.editTodo);
router.patch('/todo/api/state', todoController.updateState);
router.delete('/todo/api/delete', todoController.deleteTodo);

router.get('/todo/api/search', todoController.searchTodo);
router.get('/todo/api/calander', todoController.calendarList);
router.get('/todo/api/list/priority', todoController.priorityList);
router.get('/todo/api/list/keyword', todoController.keywordList);
router.get('/todo/api/deleted-todo', todoController.deleteList);

module.exports = router;

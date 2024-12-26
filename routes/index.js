const express = require('express');
const router = express.Router();
const passport = require('passport');
const uploadDetail = require('../middlewares/multer');
const loadUserData = require('../middlewares/userData');

const authController = require('../controllers/AuthController');
const todoController = require('../controllers/TodoController');
const userController = require('../controllers/UserController');
const keywordController = require('../controllers/KeywordController');

// Auth signin
router.get('/', authController.getSignIn); // 로그인 페이지
router.post('/auth/api/sign-in', authController.signIn); // 로그인 api
router.post('/auth/api/sign-in/token', authController.jwtToken); // jwt 토큰 api
router.get(
  '/auth/api/sign-in/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // 요청할 권한
  }),
); // oauth 구글
router.get('/auth/google/callback', authController.googleCallback);
router.get('/auth/api/sign-in/kakao', passport.authenticate('kakao')); // oauth 카카오
router.get('/auth/kakao/callback', authController.kakaoCallback);

// Auth signup
router.get('/auth/sign-up', authController.getSignUp); // 회원가입 페이지
router.post('/auth/api/sign-up', authController.signUp); // 회원가입 api
router.get('/auth/api/sign-up/check', authController.duplicatedEmail); // 이메일 중복 검사

// Auth search pw
router.get('/auth/search-pw', authController.getSearchPw); // 비밀번호 페이지
// router.get('/auth/api/search-pw', authController.searchPw); // 비밀번호 찾기 api

// User
router.get('/user/profile', loadUserData, userController.getProfile); // 프로필 페이지
router.patch('/user/api/profile', userController.editProfile); // 프로필 수정 api
router.post(
  '/user/api/photo-upload',
  uploadDetail.single('dynamic-file'),
  userController.uploadPhoto,
); // 프로필 사진 업로드 api
router.get('/user/reset-pw', loadUserData, userController.getResetPw); // 비밀번호 재설정 페이지
router.patch('/user/api/reset-pw', userController.resetPw); // 비밀번호 재설정 api
router.get(
  '/user/delete-account',
  loadUserData,
  userController.getDeleteAccount,
); // 회원 탈퇴 페이지
router.delete('/user/api/delete-account', userController.deleteAccount); // 회원 탈퇴 api

// Todo CRUD
router.get('/todo/dashboard', loadUserData, todoController.getDashboard); // 대시보드 페이지
router.post('/todo/api/write', todoController.writeTodo); // 투두 작성 api
router.get('/todo/api/get/:id', todoController.getTodo); // 특정 투두 조회
router.patch('/todo/api/edit', todoController.editTodo); // 투두 수정 api
router.patch('/todo/api/state', todoController.updateState); // 투두 상태 업데이트 api
router.delete('/todo/api/delete', todoController.deleteTodo); // 투두 삭제 api

// Todo list
router.get('/todo/api/search', todoController.searchTodo); // 투두 검색 페이지 조회
router.get('/todo/api/calendar', todoController.calendarList); // 투두 캘린더형 조회
router.get('/todo/api/list/priority/:priority', todoController.priorityList); // 투두 우선순위 조회
router.get('/todo/api/list/keyword/:id', todoController.keywordList); // 투두 키워드 조회
router.get('/todo/api/deleted-todo', todoController.deleteList); // 투두 휴지통 조회
router.patch('/todo/api/restore', todoController.restoreTodo); // 삭제된 투두 복구
router.patch('/todo/api/restore/multiple', todoController.restoreTodos); // 삭제된 투두 다중 복구

// Keyword
router.post('/keyword/api/create', keywordController.createKeyword); // 키워드 생성 api
router.delete('/keyword/api/delete', keywordController.deleteKeyword); // 키워드 삭제 api

module.exports = router;

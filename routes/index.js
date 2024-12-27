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
router.get('/auth/api/search-pw', authController.searchPw); // 비밀번호 찾기 api

// User
router.get('/user/profile', userController.getProfile); // 프로필 페이지
router.patch('/user/api/profile', userController.editProfile); // 프로필 수정 api
router.post(
  '/user/api/photo-upload',
  uploadDetail.single('dynamic-file'),
  userController.uploadPhoto,
); // 프로필 사진 업로드 api
router.get('/user/reset-pw', userController.getResetPw); // 비밀번호 재설정 페이지
router.patch('/user/api/reset-pw', userController.resetPw); // 비밀번호 재설정 api
router.get('/user/delete-account', userController.getDeleteAccount); // 회원 탈퇴 페이지
router.delete('/user/api/delete-account', userController.deleteAccount); // 회원 탈퇴 api

// Todo CRUD
router.post('/todo/api/write', todoController.writeTodo); // 투두 작성 api
router.get('/todo/api/get/:id', todoController.getTodo); // 특정 투두 조회 api
router.patch('/todo/api/edit', todoController.editTodo); // 투두 수정 api
router.delete('/todo/api/delete', todoController.deleteTodo); // 투두 삭제 api

// // Todo dashboard
// router.get('/todo/dashboard', todoController.getDashboard); // 대시보드 페이지
// router.get('/todo/api/today', todoController.todayTodo); // 오늘 투두 조회 api
// router.get('/todo/api/week', todoController.weekTodos); // 이번주 투두 조회 api
// router.get('/todo/api/priority/:priority', todoController.priorityTodos); // 투두 우선순위 조회 api

// Todo calendar
router.get('/todo/calendar', todoController.getCalendar); // 투두 캘린더 페이지
router.get('/todo/api/day', todoController.dayTodo); // 특정 날짜 투두 조회 api

// Todo search
router.get('/todo/search', todoController.getSearch); // 투두 검색 페이지
router.get('/todo/api/search', todoController.searchTodos); // 투두 검색 조회 api

// // Todo keyword
// router.get('/todo/keyword/:id', todoController.getKeyword); // 투두 키워드 페이지
// router.get('/todo/api/keyword/:id', todoController.keywordTodos); // 투두 키워드 조회 api

// // Todo deleted
// router.get('/todo/deleted-todo', todoController.getDeleted); // 투두 휴지통 페이지
// router.get('/todo/api/deleted-todo', todoController.deletedTodos); // 투두 휴지통 조회 api
// router.patch('/todo/api/restore', todoController.restoreTodo); // 삭제된 투두 복구
router.patch('/todo/api/restore/multiple', todoController.restoreTodos); // 삭제된 투두 다중 복구

// Keyword
router.get('/keyword/api/get', keywordController.getKeyword); // 키워드 목록 api
router.post('/keyword/api/create', keywordController.createKeyword); // 키워드 생성 api
router.delete('/keyword/api/delete', keywordController.deleteKeyword); // 키워드 삭제 api

module.exports = router;

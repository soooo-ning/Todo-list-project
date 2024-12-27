const { User, Keyword } = require('../models');
const jwt = require('jsonwebtoken');

const loadUserData = async (req, res, next) => {
  try {
    // 인증이 필요하지 않은 경로 예외 처리
    const publicRoutes = [
      '/', // 로그인 페이지
      '/auth/api/sign-in', // 로그인 API
      '/auth/api/sign-in/token', // JWT 토큰 API
      '/auth/api/sign-in/google', // Google OAuth 로그인
      '/auth/api/sign-in/kakao', // Kakao OAuth 로그인
      '/auth/google/callback', // Google OAuth 콜백
      '/auth/kakao/callback', // Kakao OAuth 콜백
      '/auth/sign-up', // 회원가입 페이지
      '/auth/api/sign-up', // 회원가입 API
      '/auth/api/sign-up/check', // 이메일 중복 검사 API
      '/auth/search-pw', // 비밀번호 찾기 페이지
      '/auth/api/search-pw', // 비밀번호 찾기 API
    ];
    if (publicRoutes.includes(req.path)) {
      return next();
    }
    let userId = null;

    // 디버깅용 로그 추가
    console.log('Session data:', req.session);
    console.log('Headers:', req.headers.authorization);

    // JWT 토큰에서 userId 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        userId = decoded.id;
      } catch (err) {
        console.error('JWT Verification Error:', err.message);
      }
    }

    // 세션에서 userId 추출
    if (!userId && req.session.user) {
      userId = req.session.user.id;
    }

    if (!userId) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    // 사용자 정보 가져오기
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['nickname', 'profile_image', 'id'],
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 키워드 정보 가져오기
    const keywords = await Keyword.findAll({
      where: { user_id: userId },
      attributes: ['id', 'keyword', 'user_id'],
    });

    res.locals.nickname = user.nickname;
    res.locals.profile_img = user.profile_image;
    res.locals.keywords = keywords;
    res.locals.userId = user.id;

    req.user = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Error in loadUserData middleware:', error);
    next(error);
  }
};

module.exports = loadUserData;

// const { User, Keyword } = require('../models');

// const loadUserData = async (req, res, next) => {
//   try {
//     console.log('loadUserData--------------');
//     const token = req.headers.authorization?.split(' ')[1];
//     console.log(token);
//     const user = await User.findOne({
//       where: { id: 1 },
//       attributes: ['nickname', 'profile_image', 'id'],
//     });

//     const keywords = await Keyword.findAll({
//       where: { user_id: 1 },
//       attributes: ['id', 'keyword', 'user_id'], // ID 포함
//     });

//     res.locals.nickname = user.nickname;
//     res.locals.profile_img = user.profile_image;
//     res.locals.keywords = keywords; // 그대로 배열 전달
//     res.locals.userId = user.id; // 명확하게 변수명 지정

//     next();
//   } catch (error) {
//     console.error('Error in loadUserData middleware:', error);
//     next(error);
//   }
// };

// module.exports = loadUserData;

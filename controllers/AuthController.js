const { User } = require('../models'); // User 모델 가져오기
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt'); // bcrypt 모듈 가져오기

// 로그인 페이지 요청
exports.getSignIn = (req, res) => {
  res.render('sign-in'); // 로그인 페이지 렌더링
};

// 회원가입 페이지 요청
exports.getSignUp = (req, res) => {
  res.render('sign-up'); // 회원가입 페이지 렌더링
};

// 비밀번호 찾기 페이지 요청
exports.getSearchPw = (req, res) => {
  res.render('search-pw'); // 비밀번호 찾기 페이지 렌더링
};

// 로그인 메서드
exports.signIn = async (req, res) => {
  const { email, pw } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: '로그인 실패' });
    }

    // 입력한 비밀번호와 저장된 비밀번호 비교
    if (pw !== user.pw) {
      return res.status(401).json({ message: '로그인 실패' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', {
      expiresIn: '24h',
    });

    // 세션에 사용자 정보 저장
    req.session.user = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };

    // 닉네임과 함께 토큰을 반환
    res.json({ token, nickname: user.nickname });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// JWT 토큰 처리 메서드
exports.jwtToken = (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ message: '토큰이 제공되지 않았습니다.' });
  }

  res.json({ token });
};

// 회원가입 메서드
exports.signUp = async (req, res) => {
  const { nickname, pw, email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const newUser = await User.create({
      nickname,
      pw, // 비밀번호를 해시화하지 않고 그대로 저장
      email,
      profile_image: null,
    });
    res.status(201).json({ message: '유저 등록 완료' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 이메일 중복 확인 메서드
exports.duplicatedEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(200).json({ message: '이메일이 이미 존재합니다.' });
    }

    res.status(200).json({ message: '사용 가능한 이메일입니다.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 비밀번호 찾기 요청 메서드
exports.searchPw = async (req, res) => {
  const { email } = req.query; // req.body 대신 req.query 사용

  console.log('이메일:', email); // 이메일 값 로그

  try {
    // 입력한 이메일로 사용자 찾기
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).render('404'); // 404 페이지로 리다이렉트
    }

    // 임시 비밀번호 생성 (4자리)
    const tempPassword = crypto.randomBytes(2).toString('hex'); // 4자리 임시 비밀번호 생성

    // 임시 비밀번호를 데이터베이스에 저장 (해시화하지 않음)
    user.pw = tempPassword; // 임시 비밀번호로 업데이트
    await user.save();

    // 임시 비밀번호를 콘솔에 출력하거나 다른 방법으로 사용자에게 제공 (예: API 응답으로 반환)
    console.log('임시 비밀번호:', tempPassword);

    // 결과 반환 (임시 비밀번호를 클라이언트에 반환)
    res.status(200).json({ success: true, tempPassword }); // 응답으로 임시 비밀번호 반환
  } catch (err) {
    console.error(err); // 오류 로그
    return res.status(500).json({ error: err.message });
  }
};

// 비밀번호 재설정 API 메서드
exports.resetPw = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id); // 사용자 ID로 사용자 조회
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 새 비밀번호 직접 저장 (암호화 없이)
    user.pw = newPassword; // 새 비밀번호로 업데이트
    await user.save();

    res
      .status(200)
      .json({ message: '비밀번호가 성공적으로 재설정되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// Google OAuth 요청
exports.signInGoogle = passport.authenticate('google', {
  scope: ['email', 'profile'],
});

// Google OAuth 콜백
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Authentication Error:', err);
      return res.redirect('/'); // 로그인 페이지로 리다이렉트
    }
    if (!user) {
      console.log('No user found');
      return res.redirect('/'); // 사용자 없을 경우 로그인 페이지로 리다이렉트
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login Error:', loginErr);
        return res.redirect('/'); // 로그인 실패 시 리다이렉트
      }

      // 로그인 성공 후 사용자 정보를 세션에 저장
      req.session.user = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      };

      console.log('Session after Google login:', req.session); // 세션 로그 출력
      return res.redirect('/todo/dashboard');
    });
  })(req, res, next);
};

// Kakao OAuth 콜백
exports.kakaoCallback = (req, res, next) => {
  passport.authenticate('kakao', (err, user, info) => {
    if (user) {
      req.logIn(user, () => {
        req.session.user = {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
        };

        return res.redirect('/todo/dashboard'); // 대시보드로 리다이렉트
      });
    } else {
      return res.redirect('/user/reset-pw'); // 사용자 없음, 비밀번호 재설정 페이지로 리다이렉트
    }
  })(req, res, next);
};

// 세션 정보 확인 API
exports.getSessionInfo = (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: '로그인하지 않았습니다.' });
  }
};

const { User } = require('../models'); // User 모델 가져오기
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');

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
    if (!user || user.pw !== pw) {
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

    // 세션 내용 로그 출력
    console.log('Session after login:', req.session);

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
      pw, // 비밀번호는 해시화하여 저장하는 것이 좋습니다.
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
  const { email } = req.query;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: '등록되지 않은 이메일입니다.' });
    }

    // 비밀번호 재설정 토큰 생성
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1시간 유효
    await user.save();

    // 이메일 전송 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com', // 발신 이메일
        pass: 'your_email_password', // 발신 이메일 비밀번호
      },
    });

    // 비밀번호 재설정 링크
    const resetLink = `http://todosesac.r-e.kr:8080/auth/reset-password/${token}`;

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: '비밀번호 재설정 요청',
      text: `비밀번호 재설정을 원하시면 아래 링크를 클릭하세요:\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: '비밀번호 재설정 링크를 이메일로 전송했습니다.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
      return res.redirect('/login'); // 로그인 페이지로 리다이렉트
    }
    if (!user) {
      console.log('No user found');
      return res.redirect('/login'); // 사용자 없을 경우 로그인 페이지로 리다이렉트
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login Error:', loginErr);
        return res.redirect('/login'); // 로그인 실패 시 리다이렉트
      }

      // 로그인 성공 후 사용자 정보를 세션에 저장
      req.session.user = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      };

      console.log('Session after Google login:', req.session); // 세션 로그 출력
      return res.redirect('/todo/write');
    });
  })(req, res, next);
};

// Kakao OAuth 콜백
exports.kakaoCallback = (req, res, next) => {
  passport.authenticate('kakao', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.redirect('/login'); // 에러 발생 시 로그인 페이지로 리다이렉트
    }
    if (!user) {
      console.log('No user found, redirecting to login');
      return res.redirect('/login'); // 사용자 없음
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Error during login:', loginErr);
        return res.redirect('/login'); // 로그인 실패 시 로그인 페이지로 리다이렉트
      }

      // 로그인 성공 후 사용자 정보를 세션에 저장
      req.session.user = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      };

      console.log('User logged in:', user); // 로그인 성공 로그
      console.log('Session after Kakao login:', req.session); // 세션 로그 출력
      return res.redirect('/todo/write');
    });
  })(req, res, next);
};

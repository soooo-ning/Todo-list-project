const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
require('dotenv').config();

let host;
if (process.env.NODE_ENV == 'production') {
  host = process.env.PROD_HOST;
} else if (process.env.NODE_ENV == 'development') {
  host = process.env.LOCAL_HOST;
} else {
  host = process.env.LOCAL_HOST;
}

const passportConfig = (app) => {
  // Passport 초기화
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_APP_KEY,
        clientSecret: process.env.KAKAO_APP_SECRET,
        callbackURL: `http://${host}:8080/auth/kakao/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Kakao Profile:', JSON.stringify(profile, null, 2)); // 카카오 프로필 정보 로그

        const kakao_id = profile.id; // 카카오 ID 가져오기
        const email = profile._json.kakao_account.email; // 이메일 가져오기

        try {
          console.log('Searching for existing user with kakao_id:', kakao_id); // 사용자 검색 로그
          const existingUser = await User.findOne({
            where: { kakao_id: kakao_id }, // 카카오 ID로 사용자 찾기
          });

          if (existingUser) {
            console.log('Existing User Found:', existingUser); // 기존 사용자 로그
            return done(null, existingUser);
          }

          // 새로운 사용자 생성
          console.log('Creating new user with kakao_id:', kakao_id); // 새로운 사용자 생성 로그
          const newUser = await User.create({
            nickname: profile.displayName,
            kakao_id: kakao_id, // 카카오 ID 저장
            google_id: null, // 구글 ID는 null로 설정
            profile_image: profile._json.properties.profile_image,
            email: email,
            pw: 'defaultPassword', // 비밀번호는 안전하게 해시 처리해야 함
          });

          console.log('New User Created:', newUser); // 새로운 사용자 로그
          done(null, newUser);
        } catch (error) {
          console.error('Error during user creation:', error); // 오류 로그
          done(error);
        }
      },
    ),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://${host}:8080/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google Profile:', JSON.stringify(profile, null, 2)); // Google 프로필 로그

        try {
          console.log(
            'Searching for existing user with google_id:',
            profile.id,
          ); // 사용자 검색 로그
          const existingUser = await User.findOne({
            where: { google_id: profile.id }, // 구글 ID로 사용자 찾기
          });

          if (existingUser) {
            console.log('Existing User Found:', existingUser); // 기존 사용자 로그
            return done(null, existingUser);
          }

          // 새로운 사용자 생성
          console.log('Creating new user with google_id:', profile.id); // 새로운 사용자 생성 로그
          const newUser = await User.create({
            nickname: profile.displayName,
            kakao_id: null, // 카카오 ID는 null로 설정
            google_id: profile.id, // 구글 ID 저장
            email: profile._json.email,
            pw: 'defaultPassword', // 비밀번호는 안전하게 해시 처리해야 함
          });

          console.log('New User Created:', newUser); // 새로운 사용자 로그
          done(null, newUser);
        } catch (error) {
          console.error('Error during user creation:', error); // 오류 로그
          done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    if (!user) {
      console.error('User is undefined during serialization'); // 사용자 정의 확인 로그
      return done(new Error('User is not defined'));
    }
    console.log('Serializing user:', user.id); // 사용자 직렬화 로그
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user with id:', id); // 사용자 역직렬화 로그
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      console.error('Error during user deserialization:', error); // 오류 로그
      done(error);
    }
  });
};

module.exports = passportConfig;

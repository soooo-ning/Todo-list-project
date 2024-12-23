// passport/index.js
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models'); // User 모델 가져오기

const passportConfig = (app) => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID, // 환경 변수에서 키 가져오기
        callbackURL: 'http://localhost:8080/auth/kakao/callback', // 콜백 URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 프로필 정보 로그 출력
          console.log('Kakao Profile:', JSON.stringify(profile, null, 2)); // 프로필 정보 로그 출력

          const email = profile._json.kakao_account.email; // 이메일 추출

          if (!email) {
            return done(new Error('이메일 정보가 없습니다.'), null);
          }

          // 사용자 생성 또는 찾기
          const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
              kakaoId: profile.id,
              nickname: profile.displayName,
              profile_image: profile._json.properties.profile_image,
            },
          });

          return done(null, user); // 인증 성공 시 사용자 정보 반환
        } catch (err) {
          return done(err); // 에러 발생 시 처리
        }
      },
    ),
  );

  // 사용자 세션 저장 및 복원 설정
  passport.serializeUser((user, done) => {
    done(null, user.id); // 사용자 ID로 세션 저장
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id); // 사용자 ID로 사용자 정보 복원
      done(null, user); // 사용자 정보 반환
    } catch (err) {
      done(err); // 에러 발생 시 처리
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = passportConfig; // 함수를 모듈로 내보냄

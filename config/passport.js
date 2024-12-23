const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

const passportConfig = (app) => {
  // Passport 초기화
  app.use(passport.initialize());
  app.use(passport.session());

  // Kakao OAuth 설정
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_APP_KEY,
        clientSecret: process.env.KAKAO_APP_SECRET,
        callbackURL: 'http://localhost:8080/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            where: { kakaoId: profile.id },
          });
          if (existingUser) {
            return done(null, existingUser);
          }
          const newUser = await User.create({
            nickname: profile.displayName,
            kakaoId: profile.id,
            profile_image: profile._json.properties.profile_image,
            email: profile._json.kakao_account.email,
          });
          done(null, newUser);
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  // Google OAuth 설정
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Google에서 발급받은 클라이언트 ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google에서 발급받은 클라이언트 비밀
        callbackURL: 'http://localhost:8080/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            where: { googleId: profile.id },
          });
          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            nickname: profile.displayName,
            googleId: profile.id,
            profile_image: profile._json.picture,
            email: profile._json.email,
          });

          done(null, newUser);
        } catch (error) {
          done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = passportConfig;

const express = require('express');
const db = require('./models');
const multer = require('multer');
const path = require('path');
const app = express();
const passport = require('passport');
const passportConfig = require('./config/passport');
const session = require('express-session'); // express-session 미들웨어 가져오기
require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 세션 미들웨어 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_session_secret_key', // 비밀 키
    resave: false,
    saveUninitialized: true,
  }),
);

// Passport 설정
passportConfig(app); // passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// const uploadDetail = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, done) {
//       done(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름을 날짜 + 확장자 형태로 저장
//     },
//   }),
//   limits: { fieldSize: 5 * 1024 * 1024 }, // 5MB
// });

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.get('*', (req, res) => {
  res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
  console.log('DB connected!');

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(
      `Current environment: ${process.env.NODE_ENV || 'development'}`,
    );
  });
});

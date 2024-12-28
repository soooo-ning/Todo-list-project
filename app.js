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
const loadUserData = require('./middlewares/userData');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.use('/uploads', express.static(path.join(__dirname, '/static', 'uploads'))); // 'static/uploads' 폴더 서빙
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

app.use(loadUserData);

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.get('*', (req, res) => {
  res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
  console.log('DB connected!');

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Current environment: ${process.env.NODE_ENV}`);
  });
});

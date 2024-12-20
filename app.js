const express = require('express');
const db = require('./models');
const multer = require('multer');
const path = require('path');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/static', express.static(__dirname + '/static'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

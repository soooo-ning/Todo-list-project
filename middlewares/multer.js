const multer = require('multer');
const path = require('path');
const uploadPath = path.join(__dirname, '..', 'static', 'uploads');

const uploadDetail = multer({
  storage: multer.diskStorage({
    destination: function (req, file, done) {
      done(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름을 날짜 + 확장자 형태로 저장
    },
  }),
  limits: { fieldSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = uploadDetail;

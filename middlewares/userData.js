// const { User, Keyword } = require('../models');
// const jwt = require('jsonwebtoken');

// const loadUserData = async (req, res, next) => {
//   try {
//     let userId = null;
//     console.log(req.session);

//     // JWT 토큰에서 userId 추출
//     const token = req.headers.authorization?.split(' ')[1]; // Authorization: Bearer <token>
//     if (token) {
//       const decoded = jwt.verify(token, 'your_jwt_secret');
//       userId = decoded.id;
//     }

//     // 세션에서 userId 추출
//     if (!userId && req.session.userId) {
//       userId = req.session.userId;
//     }

//     if (!userId) {
//       return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
//     }

//     // 사용자 정보 가져오기
//     const user = await User.findOne({
//       where: { id: userId },
//       attributes: ['nickname', 'profile_image', 'id'],
//     });

//     if (!user) {
//       return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
//     }

//     // 사용자 키워드 정보 가져오기
//     const keywords = await Keyword.findAll({
//       where: { user_id: userId },
//       attributes: ['id', 'keyword', 'user_id'],
//     });

//     // 로컬 변수로 설정
//     res.locals.nickname = user.nickname;
//     res.locals.profile_img = user.profile_image;
//     res.locals.keywords = keywords;
//     res.locals.userId = user.id;

//     next();
//   } catch (error) {
//     console.error('Error in loadUserData middleware:', error);
//     next(error);
//   }
// };

// module.exports = loadUserData;
const { User, Keyword } = require('../models');

const loadUserData = async (req, res, next) => {
  try {
    console.log('loadUserData--------------');
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    const user = await User.findOne({
      where: { id: 1 },
      attributes: ['nickname', 'profile_image', 'id'],
    });

    const keywords = await Keyword.findAll({
      where: { user_id: 1 },
      attributes: ['id', 'keyword', 'user_id'], // ID 포함
    });

    res.locals.nickname = user.nickname;
    res.locals.profile_img = user.profile_image;
    res.locals.keywords = keywords; // 그대로 배열 전달
    res.locals.userId = user.id; // 명확하게 변수명 지정

    next();
  } catch (error) {
    console.error('Error in loadUserData middleware:', error);
    next(error);
  }
};

module.exports = loadUserData;

const { User, Keyword } = require('../models');

const loadUserData = async (req, res, next) => {
  try {
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

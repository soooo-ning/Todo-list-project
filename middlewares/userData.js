const { User, Keyword } = require('../models');

const loadUserData = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: 1 },
      attributes: ['nickname', 'profile_image'],
    });

    const keywords = await Keyword.findAll({
      where: { user_id: 1 },
      attributes: ['keyword'],
    });

    res.locals.nickname = user.nickname;
    res.locals.profile_img = user.profile_image;
    res.locals.keywords = keywords;

    next();
  } catch (error) {
    console.error('Error in loadUserData middleware:', error);
    next(error);
  }
};

module.exports = loadUserData;

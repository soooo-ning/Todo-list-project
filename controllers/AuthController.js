const { Keyword, Todo, TodoContent, User } = require('../models');
const { Op } = require('sequelize');
const { success, serverError, notFound } = require('../utils/common');

exports.getSignIn = (req, res) => {
  res.render('sign-in');
};
exports.getSignUp = (req, res) => {
  res.render('sign-up');
};
exports.getSearchPw = (req, res) => {
  res.render('search-pw');
};

// POST /auth/api/sign-up 회원가입
exports.signUp = (req, res) => {
  models.User.create({
    nickname: req.body.userName,
    pw: req.body.userPw,
    email: req.body.userEmail,
  })
    .then((result) => {
      res.send(result);
      console.log(req.body.userEmail);
    })
    .catch((err) => {
      errorlogs(
        err,
        'SignUp Error',
        '회원가입 중 오류가 발생했습니다.',
        500,
        res,
      );
    });
};

// POST /auth/api/sign-in 로그인
exports.signIn = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: {
        pw: req.body.userPw,
        email: req.body.userEmail,
      },
    });
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 에러가 발생했습니다.');
  }
};

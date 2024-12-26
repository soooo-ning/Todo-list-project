const models = require('../models/User');
const { User, Keyword } = require('../models');
const { where } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    // // User모델에서 닉네임 불러오기
    // // const userId = req.body
    // const user = await User.findOne({
    //   where: { id: 1 }, //추후 id불러오기
    //   attributes: ['nickname', 'email', 'profile_image'],
    // });

    // // Keyword 모델에서 키워드 불러오기
    // const keywords = await Keyword.findAll({
    //   // where: { id: userid },
    //   attributes: ['keyword'],
    // });
    // console.log(keywords, user);
    const { nickname, profile_img, keywords } = res.locals;
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['email'],
    });
    res.render('profile_setting', {
      nickname,
      email: user.email,
      profile_img,
      keywords,
    });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('profile_setting');
};

exports.editProfile = async (req, res) => {
  try {
    const { nickname, photo } = req.body;
    console.log(nickname, photo);
    if (!nickname && !photo) {
      return res.status(400).json({ error: '변경할 데이터가 없습니다.' });
    }
    const updateUser = await User.update(
      {
        nickname: nickname,
        profile_image: photo,
      },
      { where: { id: 1 } },
    );
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['nickname', 'profile_image'],
    });
    console.log(updateUser);
    res.status(200).json({
      message: '프로필이 성공적으로 업데이트되었습니다.',
      nickname: user.nickname,
      profile_img: user.profile_image,
    });
  } catch (error) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    res.status(500).json({ error: '프로필 업데이트 실패' });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: '파일이 없습니다.' });
    }
    res.status(200).json({ photo: req.file.filename });
  } catch (err) {
    console.error('controller uploadphoto error>', error);
  }
};

exports.getResetPw = async (req, res) => {
  try {
    const { nickname, profile_img, keywords } = res.locals;
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['pw'],
    });
    res.render('change_pw', {
      nickname,
      profile_img,
      password: user.pw,
      keywords,
    });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('change_pw');
};

exports.resetPw = (req, res) => {};

exports.getDeleteAccount = async (req, res) => {
  try {
    // User모델에서 닉네임 불러오기
    // const userId = req.body
    const { nickname, profile_img, keywords } = res.locals;
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['pw'],
    });
    res.render('delete_account', {
      nickname,
      profile_img,
      password: user.pw,
      keywords,
    });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('delete_account');
};

exports.deleteAccount = (req, res) => {};

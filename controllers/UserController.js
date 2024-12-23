const models = require('../models/User');
const { Keyword } = require('../models');
const { User } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const keywords = await Keyword.findAll({
      attributes: ['keyword'],
    });
    console.log(keywords);
    res.render('profile_setting', { keywords });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('profile_setting');
};

exports.editProfile = (req, res) => {};
exports.uploadPhoto = (req, res) => {
  // if (!req.file) {
  //   return res.status(400).send({ message: '파일이 업로드되지 않았습니다.' });
  // }
  // // 프로필 사진 경로 저장 (예: uploads/filename.jpg)
  // const profileImagePath = `/uploads/${req.file.filename}`;
  // // 유저 정보 업데이트 (예: 프로필 사진 경로를 업데이트)
  // User.update(
  //   { profileImage: profileImagePath },
  //   { where: { id: req.user.id } }, // `req.user.id`는 로그인된 유저의 ID
  // )
  //   .then(() =>
  //     res.status(200).send({ message: '프로필 사진이 업데이트되었습니다.' }),
  //   )
  //   .catch((err) => res.status(500).send({ message: '서버 오류', error: err }));
};
exports.getResetPw = async (req, res) => {
  try {
    const keywords = await Keyword.findAll({
      attributes: ['keyword'],
    });
    console.log(keywords);
    res.render('change_pw', { keywords });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('change_pw');
};
exports.resetPw = (req, res) => {};

exports.getDeleteAccount = async (req, res) => {
  try {
    const keywords = await Keyword.findAll({
      attributes: ['keyword'],
    });
    console.log(keywords);
    res.render('delete_account', { keywords });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('delete_account');
};
exports.deleteAccount = (req, res) => {};

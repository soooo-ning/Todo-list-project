const models = require('../models/User');
const { User, Keyword } = require('../models');
const { where } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['email'],
    });
    res.render('profile_setting', {
      email: user.email,
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
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['pw'],
    });
    res.render('change_pw', {
      password: user.pw,
    });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('change_pw');
};

exports.resetPw = async (req, res) => {
  try {
    const { currentPw, newPw } = req.body;
    const userId = 1; // 현재는 하드코딩된 ID, 추후 로그인한 사용자의 ID로 변경

    // 사용자 정보 가져오기
    const user = await User.findOne({ where: { id: userId } });

    // 현재 비밀번호 확인
    if (user.pw !== currentPw) {
      return res.status(400).json({
        success: false,
        message: '현재 비밀번호가 일치하지 않습니다.',
      });
    }

    // 새 비밀번호로 업데이트
    await User.update({ pw: newPw }, { where: { id: userId } });

    // 성공적으로 비밀번호 변경 완료
    res.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

exports.getDeleteAccount = async (req, res) => {
  try {
    // User모델에서 닉네임 불러오기
    // const userId = req.body
    const user = await User.findOne({
      where: { id: 1 }, //추후 id불러오기
      attributes: ['pw'],
    });
    res.render('delete_account', {
      password: user.pw,
    });
  } catch (error) {
    console.log('keywords error', error);
    res.status(500).send('Internal Server Error');
  }
  // res.render('delete_account');
};

exports.deleteAccount = (req, res) => {};

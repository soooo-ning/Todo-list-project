const models = require('../models/User');

exports.getProfile = (req, res) => {
  res.render('profile_setting');
};
exports.editProfile = (req, res) => {};
exports.uploadPhoto = (req, res) => {};
exports.getResetPw = (req, res) => {
  res.render('change_pw');
};
exports.resetPw = (req, res) => {};

exports.getDeleteAccount = (req, res) => {
  res.render('delete_account');
};
exports.deleteAccount = (req, res) => {};

const { Keyword, Todo } = require('../models');
const { success, serverError, notFound } = require('../utils/common');

// 키워드 목록 조회 API
// GET /keyword/api/get
exports.getKeyword = async (req, res) => {
  try {
    const user_id = req.user.id;

    const keywords = await Keyword.findAll({
      where: { user_id },
    });

    if (!keywords || keywords.length === 0) {
      return notFound(res, null, 'Keyword를 찾을 수 없습니다.');
    }

    success(res, keywords, 'Keyword 목록 조회 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 키워드 생성 API
// POST /keyword/api/create
exports.createKeyword = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { keyword } = req.body;

    const newKeyword = await Keyword.create({ user_id, keyword });

    success(res, newKeyword, 'Keyword 생성 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 키워드 삭제 API
// DELETE /keyword/api/delete
exports.deleteKeyword = async (req, res) => {
  try {
    const { id } = req.body;

    const [affectedRows] = await Todo.update(
      { keyword_id: null },
      { where: { keyword_id: id } },
    );

    const deleted = await Keyword.destroy({ where: { id } });

    if (!deleted)
      return notFound(res, null, '삭제할 키워드를 찾을 수 없습니다.');

    success(res, null, '키워드 삭제 완료');
  } catch (err) {
    serverError(res, err);
  }
};

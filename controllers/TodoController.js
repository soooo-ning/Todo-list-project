const { Keyword, Todo, TodoContent, User } = require('../models');
const { Op } = require('sequelize');
const { success, serverError, notFound } = require('../utils/common');

// 투두 작성 페이지 렌더링
// GET /todo/write
// exports.getWriteTodo = (req, res) => {
//   res.render('write');
// };
// 팝업 변경으로 사용안함

// 투두 작성 API
// POST /todo/api/write
exports.writeTodo = async (req, res) => {
  try {
    const { user_id, keyword_id, title, priority, date, content } = req.body;
    const todo = await Todo.create({
      user_id,
      keyword_id,
      title,
      priority,
      date,
    });

    if (content) {
      const contentArray = Array.isArray(content) ? content : [content];
      await TodoContent.bulkCreate(
        contentArray.map((c) => ({
          todo_id: todo.id,
          content: c.content,
          state: c.state === 'true',
        })),
      );
    }

    success(res, todo, 'Todo 생성 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 특정 투두 조회
// GET /todo/api/get/:id
exports.getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id },
      include: [TodoContent, Keyword, User],
    });

    if (!todo) return notFound(res, null, 'Todo를 찾을 수 없습니다.');
    success(res, todo, 'Todo 내용 조회 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 수정 페이지 렌더링
// GET /todo/api/edit/:id
// exports.getEditTodo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await Todo.findOne({
//       where: { id },
//       include: [TodoContent, Keyword],
//     });

//     if (!todo) return notFound(res, null, 'Todo를 찾을 수 없습니다.');
//     success(res, todo, 'Todo 기존내용 조회 완료');
//   } catch (err) {
//     serverError(res, err);
//   }
// };
// 팝업 변경으로 사용안함

// 투두 수정 API
// PATCH /todo/api/edit
exports.editTodo = async (req, res) => {
  const { id, title, priority, date, contents } = req.body;

  try {
    const [updated] = await Todo.update(
      { title, priority, date },
      { where: { id } },
    );

    if (!updated) return notFound(res, null, 'Todo를 찾을 수 없습니다.');

    for (const content of contents) {
      const { id: contentId, content: text, state } = content;

      if (contentId) {
        await TodoContent.update(
          { content: text, state },
          { where: { id: contentId, todo_id: id } },
        );
      } else {
        await TodoContent.create({
          todo_id: id,
          content: text,
          state,
        });
      }
    }

    success(res, null, 'Todo 업데이트 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 상태 업데이트 API
// PATCH /todo/api/state
exports.updateState = async (req, res) => {
  try {
    const { id, state } = req.body;
    const [updated] = await TodoContent.update({ state }, { where: { id } });

    if (!updated) return notFound(res, null, 'Todo를 찾을 수 없습니다.');
    success(res, null, 'content 상태 업데이트 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 삭제 API (Soft Delete)
// DELETE /todo/api/delete:id
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const [deleted] = await Todo.update(
      { deleted: true, deleted_at: new Date() },
      { where: { id } },
    );

    if (!deleted) return notFound(res, null, 'Todo를 찾을 수 없습니다.');
    success(res, null, 'Todo 삭제 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 검색 API
// GET /todo/api/search
exports.searchTodo = async (req, res) => {
  try {
    const { query } = req.query;

    const todos = await Todo.findAll({
      where: {
        deleted: false,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { '$todo_contents.content$': { [Op.like]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: TodoContent,
          as: 'todo_contents',
        },
      ],
    });

    res.render('search', {
      todos,
      searchQuery: query,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// GET /todo/api/calendar
// 투두 캘린더형 조회
exports.calendarList = async (req, res) => {
  try {
    const { date } = req.query;
    const todos = await Todo.findAll({
      where: {
        deleted: false,
        date,
      },
      include: [TodoContent],
    });

    res.render('calendar', {
      todos,
      selectedDate: date,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// GET /todo/api/list/priority:priority
// 투두 우선순위 조회
exports.priorityList = async (req, res) => {
  try {
    const { priority } = req.params;
    const todos = await Todo.findAll({
      where: {
        deleted: false,
        priority,
      },
      include: [TodoContent],
    });

    success(res, null, 'Todo 우선순위 조회 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// GET /todo/api/list/keyword:id
// 투두 키워드 조회 및 뷰 렌더링
exports.keywordList = async (req, res) => {
  try {
    const { id } = req.params;
    const keyword = await Keyword.findByPk(id);
    const todos = await Todo.findAll({
      where: {
        deleted: false,
        keyword_id: id,
      },
      include: [TodoContent],
    });

    res.render('keyword', {
      todos,
      keywordId: id,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// GET /todo/api/deleted-todo
// 투두 휴지통 조회
exports.deleteList = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { deleted: true },
      include: [TodoContent],
    });

    res.render('delete', {
      todos,
    });
  } catch (err) {
    serverError(res, err);
  }
};

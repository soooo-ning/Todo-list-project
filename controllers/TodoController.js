const { Keyword, Todo, TodoContent, User } = require('../models');
const { Op } = require('sequelize');
const { success, serverError, notFound } = require('../utils/common');

// 대시보드 페이지 렌더링
// GET /todo/dashboard
exports.getDashboard = (req, res) => {
  res.render('dashboard');
};

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

// 투두 수정 API
// PATCH /todo/api/edit
exports.editTodo = async (req, res) => {
  try {
    const { id, keyword_id, title, priority, date, contents } = req.body;

    const [updated] = await Todo.update(
      {
        keyword_id,
        title,
        priority,
        date,
        update_date: new Date(),
      },
      { where: { id } },
    );

    if (!updated) {
      return notFound(res, null, 'Todo를 찾을 수 없습니다.');
    }

    if (contents) {
      const contentsArray = Array.isArray(contents) ? contents : [contents];

      for (const content of contentsArray) {
        const { id: contentId, content: text, state } = content;

        if (contentId) {
          await TodoContent.update(
            { content: text, state: state === 'true' },
            { where: { id: contentId, todo_id: id } },
          );
        } else {
          await TodoContent.create({
            todo_id: id,
            content: text,
            state: state === 'true',
          });
        }
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
// DELETE /todo/api/delete
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;
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

// 투두 검색 조회 및 렌더링
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

    console.log('Todos:', todos);

    res.render('search', {
      todos,
      searchQuery: query,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// 오늘 투두 조회 API
// GET /todo/api/list/today
exports.todayList = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todos = await Todo.findAll({
      where: {
        deleted: false,
        date: today,
      },
      attributes: ['title'],
    });

    success(res, todos, '오늘의 Todo 타이틀 조회 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 이번주 투두 조회 API
// GET /todo/api/list/week
exports.weekList = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);

    // 주의 시작일 (월요일)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    // 주의 종료일 (일요일)
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const todos = await Todo.findAll({
      where: {
        deleted: false,
        date: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      attributes: ['title'],
    });

    success(res, todos, '이번 주의 Todo 타이틀 조회 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 캘린더형 조회 및 렌더링
// GET /todo/api/calendar
exports.calendarList = async (req, res) => {
  try {
    let { date } = req.query;

    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    const targetDate = new Date(date);
    const firstDayOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
    );

    const todos = await Todo.findAll({
      where: {
        deleted: false,
        date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
      },
      include: [TodoContent],
      order: [['date', 'ASC']],
    });

    console.log('Todos:', todos);

    res.render('calendar', {
      todos,
      selectedDate: date,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 우선순위 조회 API
// GET /todo/api/list/priority/:priority
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

    success(res, todos, 'Todo 우선순위 조회 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 키워드 조회 및 뷰 렌더링
// GET /todo/api/list/keyword/:id
exports.keywordList = async (req, res) => {
  try {
    const { id } = req.params;
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

// 투두 휴지통 조회 및 렌더링
// GET /todo/api/deleted-todo
exports.deleteList = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { deleted: true },
      include: [TodoContent],
    });

    res.render('deleted', {
      todos,
    });
  } catch (err) {
    serverError(res, err);
  }
};

// 삭제된 투두 복구 API
// PATCH /todo/api/restore
exports.restoreTodo = async (req, res) => {
  try {
    const { id } = req.body;

    const [restored] = await Todo.update(
      { deleted: false, deleted_at: null },
      { where: { id, deleted: true } },
    );

    if (!restored) {
      return notFound(res, null, '복구할 Todo를 찾을 수 없습니다.');
    }

    success(res, null, 'Todo 복구 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 삭제된 투두 다중 복구 API
// PATCH /todo/api/restore/multiple
exports.restoreTodos = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return notFound(res, null, '복구할 Todo ID 목록이 없습니다.');
    }

    const restored = await Todo.update(
      { deleted: false, deleted_at: null },
      { where: { id: ids, deleted: true } },
    );

    if (restored[0] === 0) {
      return notFound(res, null, '복구할 Todo를 찾을 수 없습니다.');
    }

    success(res, null, `${restored[0]}개의 Todo 복구 완료`);
  } catch (err) {
    serverError(res, err);
  }
};

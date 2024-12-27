const { Keyword, Todo, TodoContent, User } = require('../models');
const { Op } = require('sequelize');
const { success, serverError, notFound } = require('../utils/common');

// Todo CRUD
// 투두 작성 API
// POST /todo/api/write
exports.writeTodo = async (req, res) => {
  try {
    const { keyword_id, title, priority, date, content } = req.body;
    const user_id = req.user.id;

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
          content: c,
          state: c.state === 'true',
        })),
      );
    }

    success(res, todo, 'Todo 생성 완료');
  } catch (err) {
    serverError(res, err);
  }
};

// 특정 투두 조회 API
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

// Todo dashboard
// 대시보드 페이지 렌더링
// GET /todo/dashboard
exports.getDashboard = (req, res) => {
  res.render('dashboard');
};

// 오늘 투두 조회 API
// GET /todo/api/today
exports.todayTodo = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const user_id = req.user.id;

    const todos = await Todo.findAll({
      where: {
        user_id,
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
// GET /todo/api/week
exports.weekTodos = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const user_id = req.user.id;

    const todos = await Todo.findAll({
      where: {
        user_id,
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

// 투두 우선순위 조회 API
// GET /todo/api/list/priority/:priority
exports.priorityTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { priority } = req.params;

    const todos = await Todo.findAll({
      where: {
        user_id: userId,
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

// Todo calendar
// 캘린더 페이지 렌더링
// GET /todo/calendar
exports.getCalendar = (req, res) => {
  res.render('calendar');
};

// 특정 날짜 투두 조회 API
// GET /todo/api/day
exports.dayTodo = async (req, res) => {
  try {
    let { date } = req.query;
    console.log('Requested date:', date); // 디버깅용 로그

    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }

    const targetDate = new Date(date);
    const firstDayOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1,
      0,
      0,
      0,
    );

    const lastDayOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    console.log('First day:', firstDayOfMonth); // 디버깅용 로그
    console.log('Last day:', lastDayOfMonth); // 디버깅용 로그

    const user_id = req.user.id;

    const todos = await Todo.findAll({
      where: {
        user_id,
        deleted: false,
        date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
      },
      attributes: ['id', 'date', 'title'],
      include: [
        {
          model: TodoContent,
          attributes: ['content', 'state'],
        },
      ],
      order: [['date', 'ASC']],
    });

    success(res, todos, '일정 조회 성공');
  } catch (err) {
    serverError(res, err);
  }
};

// Todo search
// 검색 페이지 렌더링
// GET /todo/search
exports.getSearch = (req, res) => {
  const { query } = req.query;
  res.render('search', {
    searchQuery: query || '',
    title: '검색',
  });
};

// 투두 검색 조회 API
// GET /todo/api/search
exports.searchTodos = async (req, res) => {
  try {
    const { query } = req.query;
    const user_id = req.user.id;

    if (!query) {
      return success(res, [], '검색어를 입력해주세요');
    }

    const todos = await Todo.findAll({
      where: {
        user_id,
        deleted: false,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { '$todo_contents.content$': { [Op.like]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: TodoContent,
          attributes: ['id', 'content', 'state'], // 필요한 필드만 선택
          as: 'todo_contents',
        },
      ],
      attributes: ['id', 'title', 'date', 'priority'], // 필요한 필드만 선택
      order: [['date', 'DESC']], // 최신순 정렬 추가
    });

    success(res, todos, '검색 결과 조회 성공');
  } catch (err) {
    serverError(res, err);
  }
};

// 투두 키워드 조회 및 뷰 렌더링
// GET /todo/api/list/keyword/:id
exports.keywordList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const todos = await Todo.findAll({
      where: {
        user_id: userId,
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
    const userId = req.user.id;

    const todos = await Todo.findAll({
      user_id: userId,
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

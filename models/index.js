'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const Keyword = require('./Keyword')(sequelize, Sequelize);
const Todo = require('./Todo')(sequelize, Sequelize);
const TodoContent = require('./TodoContent')(sequelize, Sequelize);
const User = require('./User')(sequelize, Sequelize);

Keyword.hasMany(Todo, {
  foreignKey: 'keyword_id',
  sourceKey: 'id',
});

User.hasMany(Todo, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});

Todo.belongsTo(Keyword, {
  foreignKey: 'keyword_id',
  sourceKey: 'id',
});

Todo.belongsTo(User, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});

Todo.hasMany(TodoContent, {
  foreignKey: 'todo_id',
  sourceKey: 'id',
});

TodoContent.belongsTo(Todo, {
  foreignKey: 'todo_id',
  sourceKey: 'id',
});

db.Keyword = Keyword;
db.Todo = Todo;
db.TodoContent = TodoContent;
db.User = User;

module.exports = db;

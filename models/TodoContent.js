const TodoContent = (sequelize, DataTypes) => {
  return sequelize.define(
    'todo_content',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '고유 콘텐츠 id',
      },
      todo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '투두 id',
        references: {
          model: 'todo',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '내용',
      },
      state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: '진행상태',
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );
};

module.exports = TodoContent;

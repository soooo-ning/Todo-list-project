const Todo = (sequelize, DataTypes) => {
  return sequelize.define(
    'todo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '고유 투두 id',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '사용자 id',
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      keyword_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '키워드 id',
        references: {
          model: 'keyword',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '제목',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: true,
        comment: '우선순위',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '투두 날짜',
      },
      write_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: '생성 날짜',
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '수정 날짜',
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '삭제 여부',
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '삭제 시간',
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'write_date',
      updatedAt: 'update_date',
    },
  );
};

module.exports = Todo;

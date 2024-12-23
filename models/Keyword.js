const Keyword = (sequelize, DataTypes) => {
  return sequelize.define(
    'keyword',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '고유 키워드 id',
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
      keyword: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '키워드 명',
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );
};

module.exports = Keyword;

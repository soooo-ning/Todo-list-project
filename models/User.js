const User = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '고유 사용자 id',
      },
      kakaoId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        comment: '카카오 고유 ID',
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '닉네임',
      },
      pw: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '비밀번호',
      },
      resetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '비밀번호 재설정 토큰',
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '이메일',
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '사용자 프로필 이미지',
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '사용자 계정 수정일',
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      updatedAt: 'update_date',
      createdAt: false,
    },
  );
};

module.exports = User;

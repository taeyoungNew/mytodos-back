module.exports = (sequlize, DataTypes) => {
  const User = sequlize.define('User', {
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
  User.associate = (db) => {
    db.User.hasMany(db.Todo);
  }
  return User;
}
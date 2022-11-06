module.exports = (sequlize, DataTypes) => {
  const Todo = sequlize.define('Todo', {
    todoContent: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    updateTime: {
      type: DataTypes.STRING(20)
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    charset: 'utf8mb4', // 이모티콘까지 사용할려면 md4
    collate: 'utf8mb4_general_ci'  // 한글 저장 가능
  });
  Todo.associate = (db) => {
    db.Todo.belongsTo(db.User);
  }
  return Todo;
}
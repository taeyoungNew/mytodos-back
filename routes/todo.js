const express = require('express');

const db = require('../models');
const router = express.Router();

router.post('/add', async (req, res, next) => {
  try {
    const getTodoList = req.body;
    console.log(getTodoList);
    const todoInfo =  await db.Todo.create({
      todoContent: getTodoList.todo.todoContent,
      UserId: getTodoList.userInfo.id,
      updateTime: getTodoList.updateTime
    })
    res.status(200).json(todoInfo)
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.post('/gettodo', async (req, res, next) => {
  try {
    // console.log('req.body = ', req.body.userId);
    const getMyTodos = await db.Todo.findAll({
      where: {
        UserId: req.body.userId
      },
      attributes:  ['id', 'updateTime', 'todoContent', 'done']
    })
    if(!getMyTodos) {
      return res.status(400).send('Todolist를 작성하지 않았습니다.')
    }
    // console.log('getMyTodos = ', getMyTodos);
    res.status(200).json(getMyTodos)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete('/remove/:id', async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const todo = await db.Todo.destroy({
      where: {
        id: req.params.id
      }
    })
    if(!todo) {
      return res.status(400).send("투두리스트가 존재하지 않습니다. ")
    }
    return res.status(200).send('해당 투두리스트가 삭제되었습니다.')
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.get('/:id/mytodos', async (req, res, next) => {
  try {
    const findTodo = db.Todo.findOne({
      where: {
        id: findTodo
      }
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.patch('/done', async (req, res, next) => {
  try {
    await db.Todo.update({
      done: req.body.done
    },{
      where: {
        id: req.body.todoId
      }
    })
    console.log(req.body);
    res.send('Todo체크완료')
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.patch('/editContent', async (req, res, next) => {
  try {
    console.log('req = ', req.body);
    const userCheck = await db.Todo.findOne({
      where: {
        id: req.body.todoId,
        UserId: req.body.userId
      }
    })
    if(!userCheck) {
      return res.status(401).send('자신의 투두리스트만 수정할 수 있습니다.');
    }
    await userCheck.update({
      todoContent: req.body.editContent
    })
    const result = await db.Todo.findOne({
      where: {
        id: req.body.todoId,
      },
      attributes:  ['id', 'updateTime', 'todoContent', 'done']
    })
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    next(error);
  }
})

module.exports = router;
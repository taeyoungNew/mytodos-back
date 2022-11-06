const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');

const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const todoRouter = require('./routes/todo');
const db = require('./models');

const app = express()

// db를 실행하는 코드
db.sequelize.sync({ force: false })
passportConfig();


// 미들웨어
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.use(express.json());
app.use(cookie('cookiesecret'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
  cookie: {
    httpOnly: true,
    secure: false
  }
}))
app.use(passport.initialize());
app.use(passport.session());



app.use('/user', userRouter);
app.use('/todo', todoRouter);


app.listen(3010, () => {
  console.log(`<h1>백엔드 서버${3010}번 포트에서 작동중</h1>`)
});
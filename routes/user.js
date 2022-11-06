const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();
router.post('/');

router.post('/signup', async (req, res, next) => {
  try {
    // password 암호화
    const hash = await bcrypt.hash(req.body.password, 12);
    const checkEmail = await db.User.findOne({
      where: {
        email: req.body.email
      }
    })
    const checkNickname = await db.User.findOne({
      where: {
        nickname: req.body.nickname
      }
    })
    if(checkEmail) {
      return res.status(403).json({
        errCode: 1,
        message: '이메일이 중복됩니다.'
      })
    }
    if(checkNickname) {
      return res.status(403).json({
        errCode: 2,
        message: '닉네임이 중복됩니다. '
      })
    }
    await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname
    })
    res.send('회원가입완료')
  } catch (error) {
    next(error)
  }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if(err) {
        console.log(err);
        return next(err);
      }
      if(info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (err) => {
        if(err) {
          console.log(err);
          return next(err);
        }
        const userInfo = await db.User.findOne({
          where: {
            id: user.id
          },
          attributes: ['id', 'email', 'nickname'],        
        });
        return res.json(userInfo);
      })
    })(req, res, next)
})

router.post('/logout', (req, res) => {
  console.log('req.isAuthenticated() = ', req.isAuthenticated());
  if(req.isAuthenticated()) {
    req.logout();
    req.session.destroy();
    return res.status(200).send('로그아웃 되었습니다.')
  }
})

module.exports = router;
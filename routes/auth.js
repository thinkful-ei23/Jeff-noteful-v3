/* eslint-disable no-unused-vars */
'use strict'

const express = require('express')
const router = express.Router()

const passport = require('passport')
const mongoose = require('mongoose')

const options = {session: false, failWithError: true}
const localAuth = passport.authenticate('local', options)

const jwt = require('jsonwebtoken')

const { JWT_SECRET, JWT_EXPIRY } = require('../config')

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true })

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  })
}

router.post('/login', localAuth, function (req, res) {
  const authToken = createAuthToken(req.user)
  return res.json({ authToken })
})

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user)
  res.json({ authToken })
})

module.exports = router

const jwt =require('jsonwebtoken')
const asyncHandler =require( 'express-async-handler')
const User =require('../model/Registration')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, "jwtPrivateKey")

      req.user = await User.findById(decoded.id).select('-newPassword')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const verify = (req, res, next) => {
    if (req.user && req.user.verify) {
      next()
    } else {
      res.status(401)
      throw new Error('Only Verified users are allowed')
    }
  }

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}


const manager = (req, res, next) => {
  if (req.user && req.user.isManager) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as a manager')
  }
}
exports.protect=protect
// export { protect,verify, admin , manager}

const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || 'dev_secret'

function verifyToken(req, res, next){
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'missing_auth' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid_auth' })
  const token = parts[1]
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' })
  }
}

module.exports = { verifyToken }

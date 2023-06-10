const express = require('express')
const router = express.Router()
const {Pagination} = require('../../utils/pagination')
const news = require('../../newslatter-api/handlers/news')
const {
  verifyToken
} = require('../../auth-api/middleware/auth')
router.use(Pagination)

/** News */
router.post('/add-news', news.createNews)
router.get('/get-news', verifyToken, news.getNews)

module.exports = router
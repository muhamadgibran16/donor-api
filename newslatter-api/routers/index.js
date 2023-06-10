const express = require('express')
const router = express.Router()
const {Pagination} = require('../../utils/pagination')
const news = require('../../newslatter-api/handlers/news')

router.use(Pagination)

router.post('/add-news', news.createNews)
router.get('/get-news', news.getNews)

module.exports = router
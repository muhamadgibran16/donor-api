const db = require('../../config/db')
const Sequelize = require('sequelize')

const {
  DataTypes
} = Sequelize

/** Event Table */
const Event = db.define('event', {
  news_id: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
  },
  urlImage: {
    type: DataTypes.STRING,
  },
})

module.exports = { Event }
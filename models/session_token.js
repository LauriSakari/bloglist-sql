const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class SessionToken extends Model {}

SessionToken.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'sessionToken'
})

module.exports = SessionToken
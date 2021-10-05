// 对应 user 集合 

const mongoose = require('../db')

// 用 Schema 定义数据规范
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // 必须
      unique: true // 唯一，不能重复
    },
    password: String,
    realname: String
  }, {
    timestamps: true 
  }
)

// Model 对应 collection
// 此处的 user 会自动变成复数形式
const User = mongoose.model('user', UserSchema)

module.exports = User
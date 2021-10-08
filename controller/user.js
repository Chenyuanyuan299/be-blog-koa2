const User = require('../db/models/User')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
  // 生成加密密码
  password = genPassword(password)

  const isUser = await User.find({ username })
  if (isUser.length == 0) {
    return -1
  } else {
    const userList = await User.find({ username, password })
    if (userList.length == 0) return {}
    return userList[0]
  }
}

module.exports = {
  login
}
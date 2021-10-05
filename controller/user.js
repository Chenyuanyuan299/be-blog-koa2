const User = require('../db/models/User')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
  // username = escape(username)
  // password = escape(genPassword(password))
  // const sql =  ` 
  //   select username, realname from users where username=${username} and password=${password}
  // `
  // const rows = await exec(sql)
  // return rows[0] || {}

  // 生成加密密码
  password = genPassword(password)

  const userList = await User.find({
    username,
    password
  })

  if (userList.length == 0) return {}
  return userList[0]
}

module.exports = {
  login
}
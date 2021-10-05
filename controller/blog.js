// controller 用来管理数据，理解为数据控制层
// controller 拿到对应路由的数据，与数据库建立连接交互，获取数据并返回给路由
const Blog = require('../db/models/Blog')
const xss = require('xss')

const getList = async (author, keyword) => {
  // 动态拼接查询条件
  const whereOpt = {}
  if (author) whereOpt.author = author
  if (keyword) whereOpt.keyword = new RegExp(keyword)

  const list = await Blog.find(whereOpt).sort({ _id: -1 })
  return list
}

const getDetail = async (id) => {
  const blog = await Blog.findById(id)

  // 创建时间的格式化

  return blog
}

const newBlog = async (blogData = {}) => {
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author

  const blog = await Blog.create({
    title,
    content,
    author
  })

  return {
    id: blog._id
  }
}

const updateBlog = async (id, blogData = {}) => {

  const title = xss(blogData.title)
  const content = xss(blogData.content)

  const blog = await Blog.findOneAndUpdate(
    { _id: id },
    { title, content},
    { new: true } // 返回更新之后的最新内容
  )

  if (blog == null) return false
  return true
}

const deleteBlog = async (id, author) => {

  const blog = await Blog.findOneAndDelete({
    _id: id,
    author
  })
  if (blog == null) return false
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}



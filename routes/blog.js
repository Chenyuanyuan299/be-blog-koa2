const router = require('koa-router')()
const { getList, getListCount, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  if (ctx.query.isadmin) {
    // console.log('is admin')
    // 管理员界面
    if (ctx.session.username == null) {
      // 未登录
      ctx.body = new ErrorModel('未登录')
      // console.error('is admin, but no login')
      return
    }
    // 强制返回作者本人的博客
    author = ctx.session.username
  }

  // 获取博客列表
  const listData = await getList(author, keyword)
  let message = ''
  let count = 0
  let realname = ''
  let username = ''

  // 登录之后才能获取到用户的真实姓名和用户名
  if (ctx.session.username) {
    message = '已登录'
    count = await getListCount(ctx.session.username)
    realname = ctx.session.realname
    username = ctx.session.username
  } else {
    message = '未登录'
  }
  const resData = {
    listData,
    realname,
    username,
    count,
    message
  }
  ctx.body = new SuccessModel(resData)
});

router.get('/detail', async (ctx, next) => {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
});

router.post('/new', loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body =  new SuccessModel(data)
});

router.post('/update', loginCheck, async (ctx, next) => {
  const val = await updateBlog(ctx.query.id, ctx.request.body)
  if (val) {
    ctx.body =  new SuccessModel()
  } else {
    ctx.body = new ErrorModel('更新失败')
  }
});

router.post('/delete', loginCheck, async (ctx, next) => {
  const author = ctx.session.username
  const val = await deleteBlog(ctx.query.id, author)
  if (val) {
    ctx.body =  new SuccessModel()
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
});

module.exports = router

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const RedisStore = require('koa-redis') 
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const blog = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONF } = require('./conf/db')

// error handler
onerror(app)

// middlewares
// get postData
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())

app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  // 计算当前请求的耗时
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// session 配置
app.keys = ['WJiol_8776#']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: RedisStore({
    // 先写本地的
    all: `${REDIS_CONF.host}:${REDIS_CONF.post}`
  })
}))

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}

// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

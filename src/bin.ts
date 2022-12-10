#!/usr/bin/env node

import { createHcfyChatGPTServer } from './index.js'

const token = process.env.SESSION_TOKEN

if (!token) {
  console.error('请写入环境变量 SESSION_TOKEN。')
} else {
  createHcfyChatGPTServer(token).then(
    () => {
      console.log('服务已启动，请按照文档将 ChatGPT 配置进划词翻译当中。')
    },
    (reason) => {
      console.error('启动失败：')
      console.error(reason)
    }
  )
}

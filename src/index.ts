import { ChatGPTAPI } from 'chatgpt'
import { createServer } from 'node:http'

export async function createHcfyChatGPTServer(token: string, port = 8888) {
  const api = new ChatGPTAPI({
    sessionToken: token,
    markdown: false,
  })

  await api.ensureAuth()

  async function getResultFromChatGPT(text: string) {
    const response = await api.sendMessage(text, {
      timeoutMs: 2 * 60 * 1000,
    })

    return {
      text,
      link: 'https://chat.openai.com/chat',
      result: [response],
    }
  }

  // 创建一个 HTTP Server 用于处理客户端发送的请求
  createServer((req, res) => {
    // 划词翻译会使用 POST 方法请求你填写的接口地址
    if (req.method === 'POST') {
      let body = ''
      req.on('data', (data) => {
        body += data
      })
      req.on('end', () => {
        const params = JSON.parse(body)
        // 我们的接口只支持彩云小译
        if (params.name === 'ChatGPT') {
          getResultFromChatGPT(params.text).then((translateResult) => {
            res
              .writeHead(200, {
                'Content-Type': 'application/json',
              })
              .end(JSON.stringify(translateResult))
          })
          return
        }
        // 不支持的翻译源一律返回 404
        res.writeHead(404).end()
      })
      return
    }
    res.writeHead(404).end()
  }).listen(port)
}

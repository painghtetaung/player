import server from '../dist/server/server.js'

export default async function handler(req, res) {
  const request = new Request(
    new URL(req.url || '/', `https://${req.headers.host}`),
    {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    }
  )

  const response = await server.fetch(request)

  res.status(response.status)

  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value)
  }

  if (response.body) {
    const reader = response.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  }

  res.end()
}

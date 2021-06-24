import express, { Express } from 'express'
import { resolve } from 'path'

const nodeEnv = process.env.NODE_ENV
const docsDir = resolve(
  __dirname,
  nodeEnv === 'production' ? '../../docs' : '../../../docs'
)

export default (app: Express): void => {
  app.use(express.static(docsDir))
  app.get('/docs', (req, res) => {
    res.sendFile(resolve(docsDir, 'index.html'))
  })
}

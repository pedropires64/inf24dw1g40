import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(express.static('dist'))
app.get('*', (_, res)=> res.sendFile(path.join(__dirname,'dist','index.html')))
const port = process.env.PORT || 3002
app.listen(port, ()=> console.log('Admin running on http://localhost:'+port))

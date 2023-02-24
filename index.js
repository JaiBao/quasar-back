import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
// import vacationRoute from './routes/vacation.js'
import bulletinRoute from './routes/bulletin.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true)

const app = express()
// 跨域請求設定
app.use(cors({
  // origin代表請其來源,Postman等後端得請求會是undefined
  // callback(錯誤,是否允許)
  origi (origin, callback) {
    if (origin.includes('github') || origin.includes('localhost') || origin === undefined) {
      callback(null, true)
    } else {
      callback(new Error(), false)
    }
  }
}))

// 處理跨域錯誤
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
app.use('/bulletin', bulletinRoute)
// app.use('./vacation', vacationRoute)

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})

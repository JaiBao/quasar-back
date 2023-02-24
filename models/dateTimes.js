import { Schema, model } from 'mongoose'

const schema = new Schema({
  dateTime: {
    type: Date,
    required: [true, '請選擇日期時間']
  },
  description: {
    type: String,
    required: [true, '請填寫事由']
  },
  image: {
    type: String,
    required: [true, '請上傳證明']
  },
  category: {
    type: String,
    required: [true, '請選擇假別'],
    enum: {
      values: ['例假', '事假', '病假', '公假', '喪假', '育嬰假', '特休', '婚假', '生理假', '產假', '陪產檢及陪產假', '安胎假', '育嬰留職停薪假', '家庭照顧假'],
      message: '假別錯誤'
    }

  }
}, { versionKey: false })

export default model('dateTimes', schema)

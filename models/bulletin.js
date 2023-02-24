import { Schema, model } from 'mongoose'

const schema = new Schema({
  title: {
    type: String,
    required: [true, '缺少標題']
  },
  content: {
    type: String,
    required: [true, '缺少標題']
  },
  startDate: {
    type: String,
    required: [true, '缺少發布日期']
  },
  endDate: {
    type: String,
    required: [true, '缺少截止日期']
  },
  actions: {
    type: String,
    default: '進行中',
    enum: {
      values: ['進行中', '已結束']
    }

  }

}, { versionKey: false })

export default model('bulletin', schema)

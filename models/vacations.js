import { Schema, model } from 'mongoose'//, ObjectId

const schema = new Schema({

  name: {
    type: String,
    required: [true, '請輸入姓名']
  },

  leaveType: {
    type: String,
    required: [true, '請選擇假別'],
    enum: {
      values: ['例假', '事假', '病假', '公假', '喪假', '育嬰假', '特休', '婚假', '生理假', '產假', '陪產檢及陪產假', '安胎假', '育嬰留職停薪假', '家庭照顧假'],
      message: '假別錯誤'
    },

    default: ''

  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },

  state: {
    type: String,
    default: '審核中',
    enum: {
      values: ['審核中', '已核准', '不核准'],
      message: '類別錯誤'
    }
  }

}, { versionKey: false })

export default model('vacations', schema)

import { Schema, model, Error } from 'mongoose'
import bcrypt from 'bcrypt'
// import vacations from './vacations.js'

const schema = new Schema({
  name: {
    type: String

  },
  account: {
    type: String,
    reqired: [true, '缺少帳號'],
    minlength: [4, '最請設定 4 個字元以上的帳號'],
    maxlength: [20, '最請設定 20 個字元以下的帳號'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: true
  },
  tokens: {
    type: [String],
    default: []
  },
  phone: {
    type: String,
    reqired: [true, '請輸入電話'],
    default: ''
  },
  vacation: {
    type: [{
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
      success: {
        type: String,
        default: '未審核',
        enum: {
          values: ['未審核', '已核准', '不核准']
        }
      }
    }],
    default: []
  },
  role: {
    type: Number,
    // 0 = 使用者
    // 1 = 管理員
    default: 0
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('passwor', new Error.ValidationError({ message: '密碼長度錯誤' }))
      next(error)
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('passwor', new Error.ValidationError({ message: '密碼長度錯誤' }))
      next(error)
    }
  }
  next()
})

export default model('users', schema)

import users from '../models/users.js'
import vacations from '../models/vacations.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      name: req.body.name,
      account: req.body.account,
      password: req.body.password,
      phone: req.body.phone
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        token,
        name: req.user.name,
        account: req.user.account,
        phone: req.user.phone,
        // cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        name: req.user.name,
        account: req.user.account,
        phone: req.user.phone,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const editUser = async (req, res) => {
  try {
    const data = {
      account: req.body.account,
      phone: req.body.phone,
      name: req.body.name,
      password: req.body.password
    }
    const id = req.user._id
    console.log(req.body)
    const result = await users.findByIdAndUpdate(id, data, { new: true })
    res.status(200).send({ success: true, message: result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: error.message })
    }
  }
}
export const editUserAdmin = async (req, res) => {
  try {
    const data = {
      account: req.body.account,
      phone: req.body.phone,
      name: req.body.name,
      id: req.body.id,
      role: req.body.role,
      password: req.body.password
    }
    const result = await users.findByIdAndUpdate({ _id: req.body.id }, data, { new: true })
    res.status(200).send({ success: true, message: result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: error.message })
    }
  }
}
// ------------------
// export const editUser = async (req, res) => {
//   try {
//     const result = await users.findById(req.body._id)
//     result.email = req.body.email || result.email
//     result.phone = req.body.phone || result.phone
//     result.name = req.body.name || result.name
//     result.password = req.body.password || result.password
//     result.account = req.body.account || result.account
//     await result.save()
//     res.status(200).json({
//       success: true,
//       result: {
//         email: result.email,
//         phone: result.phone,
//         name: result.name,
//         account: result.account
//       }
//     })
//   } catch (error) {
//     res.status(500).json({ success: false, message: '未知錯誤' })
//   }
// }
// ----------------------

export const findAllUserVacation = async (req, res) => {
  try {
    const result = await vacations.find()
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// export const findVacationsByDate = async (req, res) => {
//   try {
//     const date = req.body.date

//     const userwithVacation = await users.find().populate('vacation')
//     const vacations = userwithVacation.flatMap(users => users.vacation)
//     const vacationss = await vacations.find({ startDate: { $lte: date }, endDate: { $gte: date } })
//     res.status(200).json({ success: true, message: vacationss })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }

export const findVacationsByDate = async (req, res) => {
  try {
    const date = req.body.date
    const vacationss = await users.find({ startDate: { $lte: date }, endDate: { $gte: date } })
    res.status(200).json({ success: true, message: vacationss })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllUser = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const result = await users.findByIdAndDelete({ _id: req.params.id })
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const findUserVacation = async (req, res) => {
  try {
    const result = await vacations.find({ name: req.params.name })
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

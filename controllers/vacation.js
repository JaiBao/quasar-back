import users from '../models/users.js'
import vacations from '../models/vacations.js'

export const createVacation = async (req, res) => {
  try {
    const result = vacations.create({
      name: req.body.name,
      leaveType: req.body.leaveType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      state: req.body.state
    })
    res.status(200).json({ success: true, message: result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export const findVacation = async (req, res) => {
  const result = await users.findById({ _id: req.user.id }).populate('vacation')
  res.status(200).json({ success: true, message: '', result })
}

export const deleteVacation = async (req, res) => {
  try {
    const user = await users.findOne({ account: req.user.account })
    const vacation = users.vacation._id(req.params._id)
    vacation.remove()
    await user.save()
    res.status(200).json({ success: true, message: 'Vacation deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete vacation' })
  }
}

// export const checkVacation = async (req, res) => {
//   try {
//     const userwithVacation = await users.find().populate('vacation')
//     const vacations = userwithVacation.flatMap(users => users.vacation)
//     const result = userwithVacation.findOneAndUpdate({ _id: req.body.id }, req.body)
//     console.log(result)
//     res.status(200).json({ success: true, message: vacations })
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message })
//   }
// }
export const checkVacation = async (req, res) => {
  try {
    const result = await vacations.findByIdAndUpdate({ _id: req.body.id }, req.body)

    res.status(200).json({ success: true, message: result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

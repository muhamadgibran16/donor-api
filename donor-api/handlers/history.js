const {
  Requests, Donor
} = require("../models/donorModel")

/** Get Blood Requests History */
const getBloodRequestsHistory = async (req, res, next) => {
  try {
    const history = await Requests.findAll({
      attributes: ['createdBy', 'id_request', 'nama_pasien', 'jml_kantong', 'tipe_darah', 'rhesus', 'gender', 'prov', 'kota', 'nama_rs', 'deskripsi', 'nama_keluarga', 'telp_keluarga', 'createdAt'],
      where: {
        createdBy: req.params.createdBy
      }
    })

    if (history.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'History blood requests not found!'
      })
    }
    console.log('History => ', history)
    res.status(200).json({
      success: true,
      message: 'History blood request retrieved successfully!',
      payload: history
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

/** Get Donor Requests History */
const getDonorRequestsHistory = async (req, res, next) => {
  try {
    const history = await Donor.findAll({
      attributes: ['uid', 'id_donor', 'nama_pendonor', 'alamat', 'telp', 'gol_darah', 'rhesus', 'last_donor', 'nama_rs', 'alamat_rs', 'nama_pasien'],
      where: {
        uid: req.params.uid
      }
    })

    if (history.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'History donor requests not found!'
      })
    }
    console.log('History => ', history)
    res.status(200).json({
      success: true,
      message: 'History donor request retrieved successfully!',
      payload: history
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = {
  getBloodRequestsHistory,
  getDonorRequestsHistory
}
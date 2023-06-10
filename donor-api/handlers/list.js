const db = require('../../config/db')
const Sequelize = require('sequelize')
const {
  QueryTypes
} = Sequelize
const {
  Requests,
} = require('../../donor-api/models/donorModel')

/** Get All Data Blood Request  */
const getListAllRequest = async (req, res, next) => {
  try {
    const pagination = res.pagination
    const {
      page,
      perPage,
      offset
    } = pagination

    const {
      count,
      rows: request
    } = await Requests.findAll({
      attributes: ['id_request', 'nama_pasien', 'jml_kantong', 'tipe_darah', 'rhesus', 'gender', 'prov', 'kota', 'nama_rs', 'deskripsi', 'nama_keluarga', 'telp_keluarga', 'createdAt'],
      limit: perPage,
      offset: offset,
    })

    const totalPages = Math.ceil(count / perPage)
    pagination.hasNextPage = page < totalPages
    pagination.hasPreviousPage = page > 1
    pagination.nextPage = page + 1
    pagination.previousPage = page - 1

    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No requests available!'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Requests retrieved successfully!',
      payload: request,
      pagination: {
        page,
        perPage,
        totalItems: count,
        totalPages,
        previousLink: pagination.getPreviousLink(),
        nextLink: pagination.getNextLink(),
      },
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

/** Get Data Blood Request By ID */
const getListBloodRequests = async (req, res, next) => {
  try {
    const request = await db.query("SELECT req.id_request, req.nama_pasien, req.tipe_darah, req.rhesus, req.nama_rs, rs.alamat_rs FROM blood_requests AS req INNER JOIN hospitals AS rs on req.nama_rs = rs.nama_rs", {
      type: QueryTypes.SELECT
    })
    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No requests available!'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Requests list retrieved successfully!',
      payload: request,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

/** Get Detail Request By ID for page detail request */
const getDetailRequestById = async (req, res, next) => {
  try {
    const request = await Requests.findAll({
      attributes: ['id_request', 'nama_pasien', 'jml_kantong', 'tipe_darah', 'rhesus', 'gender', 'prov', 'kota', 'nama_rs', 'deskripsi', 'nama_keluarga', 'telp_keluarga'],
      where: {
        id: req.params.id
      }
    })

    if (request.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Detail requests not found!'
      })
    }
    console.log('request => ', request)
    res.status(200).json({
      success: true,
      message: 'Detail request retrieved successfully!',
      payload: request
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

/** Get All Data Blood Supply */
const getAllStock = async (req, res, next) => {
  try {
    const stock = await db.query("SELECT rs.nama_rs, rs.alamat_rs, tp.tipe_darah, rhesus.rhesus, stock.stock FROM stocks as stock INNER JOIN blood_types AS tp ON stock.id_darah = tp.id INNER JOIN hospitals AS rs ON stock.id_rs = rs.id INNER JOIN rhesus ON stock.id_rhesus = rhesus.id", {
      type: QueryTypes.SELECT
    })
    if (stock.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No stock available!'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Stock retrieved successfully!',
      payload: stock,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

/** Get Blood Supply By Bloods Types ID */
const getStockByBloodTypeId = async (req, res, next) => {
  try {
    const id = req.params.id
    const stock = await db.query(`SELECT rs.nama_rs, rs.alamat_rs, tp.tipe_darah, rhesus.rhesus, stock.stock FROM stocks as stock INNER JOIN blood_types AS tp ON stock.id_darah = tp.id INNER JOIN hospitals AS rs ON stock.id_rs = rs.id INNER JOIN rhesus ON stock.id_rhesus = rhesus.id WHERE tp.id = ${id}`, {
      type: QueryTypes.SELECT,
    })
    if (stock.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Stock Available for the Blood Type!'
      })
    }
    console.log(stock)
    res.status(200).json({
      success: true,
      message: 'Get Stock By Blood Type!',
      payload: stock,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

/** Get Blood Supply By Bloods Types ID and Rhesus ID */
const getStockByBloodTypeAndRhesus = async (req, res, next) => {
  try {
    const rhesus = req.params.rhesusid
    const id = req.params.typeid
    const stock = await db.query(`SELECT rs.nama_rs, rs.alamat_rs, tp.tipe_darah, rhesus.rhesus, stock.stock FROM stocks as stock INNER JOIN blood_types AS tp ON stock.id_darah = tp.id INNER JOIN hospitals AS rs ON stock.id_rs = rs.id INNER JOIN rhesus ON stock.id_rhesus = rhesus.id WHERE tp.id = ${id} AND rhesus.id = ${rhesus}`, {
      type: QueryTypes.SELECT
    })
    if (stock.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Stock Available for the Blood Type!'
      })
    }
    res.status(200).json({
      success: true,
      message: 'Get Stock By Blood Type and Rhesus!',
      payload: stock,
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
  getListAllRequest,
  getListBloodRequests,
  getDetailRequestById,
  getAllStock,
  getStockByBloodTypeId,
  getStockByBloodTypeAndRhesus,
}
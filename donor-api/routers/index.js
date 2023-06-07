const express = require('express')
const router = express.Router()
const {
  verifyToken
} = require('../../auth-api/middleware/auth')
const {
  createBloodRequest,
  createBloodDonor
} = require('../../donor-api/handlers/users')
const list = require('../../donor-api/handlers/list')
const location = require('../../donor-api/handlers/location')
const history = require('../../donor-api/handlers/history')

/** Users Request */
router.post('/request', verifyToken, createBloodRequest)
router.post('/donor', verifyToken, createBloodDonor)

/** Users History */
router.get('/blood-history/:createdBy', history.getBloodRequestsHistory)
router.get('/donor-history/:uid', history.getDonorRequestsHistory)

/** List App */
router.get('/list/all-request', list.getListAllRequest)
router.get('/list/blood-request', list.getListBloodRequests)
router.get('/list/detail-request/:id', list.getDetailRequestById)
router.get('/list/all-stock', list.getAllStock)
router.get('/list/stock/:id', list.getStockByBloodTypeId)
router.get('/list/stock/type/:typeid/rhesus/:rhesusid', list.getStockByBloodTypeAndRhesus)

/** Location */
router.get('/province', location.getProvince)
router.get('/province/city', location.getAllCity)
router.get('/province/city/:id', location.getCityByIdProvince)
router.get('/hospital', location.getAllHospital)
router.get('/province/city/hospital/:id', location.getHospitalByIdCity)
router.get('/province/city/hospital/location/:id', location.getHospitalLocationById)


module.exports = router
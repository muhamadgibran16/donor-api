const {
  Storage
} = require('@google-cloud/storage')
const {
  Users
} = require('../../auth-api/models/userModel')

/** Configuration to Google Cloud Storage */ 
const storage = new Storage({
  keyFilename: process.env.GCP_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
})

/** Set up bucket name */ 
const bucket = storage.bucket('ember-donor')

/** Upload Photo Profile */
const imgUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a file!',
      })
    }
    const folder = 'userprofile'
    const filename = `${folder}/${req.file.originalname}`
    const blob = bucket.file(filename)
    const blobStream = blob.createWriteStream()

    blobStream.on('error', (err) => {
      res.status(500).json({
        message: err.message,
      })
    })
    const publicUrl = new URL(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
    blobStream.on('finish', async () => {
      await blob.makePublic()
      try {
        console.log('User => ', Users)
        await Users.update({
          photo: publicUrl.toString()
        }, {
          where: {
            uid: req.uid
          }
        })
        res.status(200).json({
          success: true,
          message: 'File uploaded successfully and URL is inserted into the database!',
          image: filename,
          url: publicUrl,
        })
      } catch (err) {
        console.log(err)
        res.status(500).json({
          message: 'File uploaded successfully, but URL is not inserted into the database!',
          image: filename,
          url: publicUrl,
        })
      }
    })
    blobStream.end(req.file.buffer)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: `Could not upload the file. ${err}`,
    })
  }
}

/** Edit Profile */
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      telp,
      nik,
      alamat,
      ttl,
      gender,
    } = req.body

    // console.log('User => ', user)
    await Users.update({
      name: name,
      telp: telp,
      nik: nik,
      alamat: alamat,
      ttl: ttl,
      gender: gender,
    }, {
      where: {
        uid: req.uid
      }
    })
    res.status(201).json({
      success: true,
      message: 'Data updated successfully!',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

/** Update Dialog: Blood Types, Rhesus and Last Donor */
const updateDialogFirst = async (req, res, next) => {
  try {
    const {
      gol_darah,
      rhesus,
      last_donor,
    } = req.body

    await Users.update({
      gol_darah: gol_darah,
      rhesus: rhesus,
      last_donor: last_donor
    }, {
      where: {
        uid: req.uid
      }
    })
    res.status(201).json({
      success: true,
      message: 'Data updated successfully!',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

/** Get Users Data */
const getUsers = async (req, res, next) => {
  try {
    const users = await Users.findOne({
      attributes: ['uid', 'name', 'email', 'telp', 'nik', 'ttl', 'alamat', 'gol_darah', 'rhesus', 'gender', 'last_donor', 'photo'],
      where: {
        email: req.email
      }
    })
    // console.log("data => ", users)
    res.status(200).json({
      success: true,
      payload: users
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user data!',
    })
  }
}

module.exports = {
  getUsers,
  imgUpload,
  updateDialogFirst,
  updateProfile,
}
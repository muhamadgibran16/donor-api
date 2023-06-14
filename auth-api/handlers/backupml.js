const {
  Storage
} = require('@google-cloud/storage')

/** Configuration to Google Cloud Storage */
const storage = new Storage()

/** Set up bucket name */
const bucket = storage.bucket('ember-donor')

/** Upload Photo KTP: Skenario terburuk jika ML failed di processing*/
const uploadKTP = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: 'Please upload a file!',
    })
  }
  const folder = 'userprofile'
  const filename = `${folder}/${req.uid}/${req.file.originalname}`
  const blob = bucket.file(filename)
  const blobStream = blob.createWriteStream()

  try {
    blobStream.on('error', (err) => {
      res.status(500).json({
        message: err.message,
      })
    })
    blobStream.on('finish', async () => {
      const expirationDate = new Date()
      expirationDate.setFullYear(expirationDate.getFullYear() + 5)

      const config = {
        action: 'read',
        expires: expirationDate,
      };

      const [privateUrl] = await blob.getSignedUrl(config)

      res.status(200).json({
        success: true,
        message: 'Upload KTP successfully!',
        image: filename,
        url: privateUrl,
      })
    })
    blobStream.end(req.file.buffer)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: `Could not upload the file. ${err}`,
    })
  }
}

module.exports = { uploadKTP }
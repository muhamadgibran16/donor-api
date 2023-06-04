// const updateDialogFirst = async (req, res, next) => {
//   try {
//     const {
//       gol_darah,
//       rhesus,
//       last_donor,
//     } = req.body

//     const user = await Users.findOne({
//       uid: req.body.uid,
//     })
//     // console.log('User => ', user)
//     await Users.update({
//       gol_darah: gol_darah,
//       rhesus: rhesus,
//       last_donor: last_donor
//     }, {
//       where: {
//         uid: user.uid
//       }
//     })
//     res.status(201).json({
//       success: true,
//       message: 'Data updated successfully!',
//     })
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }

// const updateProfile = async (req, res, next) => {
//   try {
//     const {
//       name,
//       telp,
//       nik,
//       alamat,
//       ttl,
//       gender,
//     } = req.body

//     const user = await Users.findOne({
//       uid: req.body.uid,
//     })
//     // console.log('User => ', user)
//     await Users.update({
//       name: name,
//       telp: telp,
//       nik: nik,
//       alamat: alamat,
//       ttl: ttl,
//       gender: gender,
//     }, {
//       where: {
//         uid: user.uid
//       }
//     })
//     res.status(201).json({
//       success: true,
//       message: 'Data updated successfully!',
//     })
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }

// const profileUpload = async (req, res, next) => {
//   const storage = new Storage({
//     // keyFilename: 'gcpKey.json',
//     keyFilename: process.env.GOOGLE_APPLICATIOIN_CREDENTIALS, // replace file in .env
//     projectId: 'ini-kelinci-percobaan' // replace project id
//   })

//   const bucket = storage.bucket('ini-kelinci-percobaan.appspot.com') // replace new bucket name

//   let processFile = multer.single('image')
//   let processFileMiddleware = util.promisify(processFile)

//   try {
//     await processFileMiddleware(req, res)

//     if (!req.file) {
//       return res.status(400).json({
//         message: "Please upload a file!"
//       })
//     }

//     const folder = 'userprofile'
//     const filename = `${folder}/${req.file.originalname}`
//     const blob = bucket.file(filename)
//     const blobStream = blob.createWriteStream()

//     blobStream.on("error", (err) => {
//       res.status(500).json({
//         message: err.message
//       })
//     })

//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

//     blobStream.on("finish", async (data) => {
//       try {
//         await blob.makePublic()
//         try {
//           await Users.update({
//             photo: publicUrl
//           }, {
//             where: {
//               token: req.cookies.refreshToken
//             }
//           })
//           res.status(200).json({
//             success: true,
//             message: 'File uploaded successfully and URL is inserted into the database!',
//             image: filename,
//             url: publicUrl,
//           })
//         } catch (err) {
//           res.status(500).json({
//             message: 'File uploaded successfully, but url URL is not inserted into the database!',
//             image: filename,
//             url: publicUrl,
//           })
//         }
//       } catch (err) {
//         res.status(500).json({
//           message: 'File uploaded successfully, but public access is denied!',
//           image: filename,
//           url: publicUrl,
//         })
//       }
//     })

//     blobStream.end(req.file.buffer)
//   } catch (err) {
//     res.status(500).send({
//       message: `Could not upload the file: ${filename}. ${err}`,
//     })
//   }
// }
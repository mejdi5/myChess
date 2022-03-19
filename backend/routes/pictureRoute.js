let express = require('express')
let mongoose = require('mongoose');
let router = express.Router();
let multer = require('multer');
const Picture = require('../models/PictureModel');


//post new picture

//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './frontend/public/images');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
}
});
var upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res, next) => {
    try { 
    const Path = req.file.filename
    const newPicture = new Picture({path: Path})

    const picture = await newPicture.save()
    console.log('picture', picture)

    res.status(201).json({
        msg: "Picture Uploaded",
        picture
    })
    } catch (error) {
        console.log('Server error: Picture not uploaded',error)
    }  
})


// delete picture
router.delete('/delete/:pictureId', async (req, res) => {
    const  _id  = req.params.pictureId;
    try {
    const picture = await Picture.findOneAndDelete({ _id });
    res.json({ msg: "picture deleted", picture });
    } catch (error) {
      console.log('picture not deleted',error);
    }
  });

module.exports = router;
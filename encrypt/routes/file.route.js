const express = require('express') ;
const fileUploadController = require("../controllers/file.controller");
const multer = require('multer') ;

const router = express.Router() ;

const upload = multer({ dest: "temp/" });


router.post("/api/files/", upload.single("file"), fileUploadController) ;
// router.delete("/api/files/:id") ;
// router.put("/api/files") ;
// router.get("api/files/:id") ;
// router.get("api/files") ;




module.exports = router ;
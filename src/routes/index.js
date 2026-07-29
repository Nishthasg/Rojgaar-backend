const express = require("express");
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('backend is running...');
})

module.exports = router;
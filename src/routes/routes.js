const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).send({message: "Welcome To API"});
});

module.exports = router;
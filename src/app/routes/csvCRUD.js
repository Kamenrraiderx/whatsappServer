const express = require('express');
const router = express.Router()
const {deleteUser,addUser,getUsers,updateUser} = require("../controllers/csvCRUD.js");



router.post('/add-row',addUser);
router.put('/update-row',updateUser);
router.delete('/delete-row',deleteUser)
router.get('/getAll',getUsers);

module.exports = router
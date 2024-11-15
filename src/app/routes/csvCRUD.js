const express = require('express');
const router = express.Router()
const {deleteUser,addUser,getUsers,updateUser} = require("../controllers/csvCRUD.js");



router.post('/add-row',addUser);
router.put('/update-row/:id',updateUser);
router.delete('/delete-row/:id',deleteUser)
router.get('/getAll',getUsers);

module.exports = router
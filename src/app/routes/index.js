const express = require('express');
const router = express.Router();
const fs = require('fs');

const pathName = `${__dirname}`

const removeExtension = (fileName) =>{
    return fileName.split('.').shift();

}
fs.readdirSync(pathName).filter((file)=>{
    const fileWithOutExt = removeExtension(file);
    const skip = ['index'].includes(fileWithOutExt);

    if(!skip){
        router.use(`/${fileWithOutExt}`,require(`./${fileWithOutExt}`));

        console.log('CARGAR RUTA --------> ',`/${fileWithOutExt}`);
    }


})

router.get('*',(req,res)=>{
    res.status(404);
    res.send({error:'Not found'});
});

module.exports = {router};
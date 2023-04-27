const AppError = require("../Ultils/AppError");

class UsersControllers{
    create(req, res){

        const {name, email, password} = req.body;
        if(!name, !email, !password){
            throw new AppError;
        }else{
            res.status(201).json({name,email,password})}
        }
    }
    
module.exports = UsersControllers
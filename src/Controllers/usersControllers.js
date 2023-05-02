const AppError = require("../Ultils/AppError");
const sqliteConnection = require("../database/sqlite");
const {hash} = require('bcryptjs')

class UsersControllers{
    async create(req, res){
        const {name, email, password} = req.body;
        
        const database = await sqliteConnection();
        
        const checkIfEmailExists =  await database.get("SELECT * FROM users WHERE email = (?)", [email])
        
        if(checkIfEmailExists){
            throw new AppError("This email already exists")
        }
        
        const hashPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name,email,hashPassword] )
            
            res.status(201).json({name,email,password})
        }
        
    async update(req, res){
        const {name, email} = req.body;
        const { id } =  req.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if(!user){
            throw new AppError('User not found')
        }

        const userWithUpdatedEmail  = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError('This email already exists');
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;


        await database.run(`
        UPDATE users SET 
        name = ?,
        email = ?,
        updated_at = ?
        WHERE id = ?`, [user.name, user.email, new Date(), id]);
        
        return res.json();    
    }

    }
    
module.exports = UsersControllers
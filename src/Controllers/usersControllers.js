const AppError = require("../Ultils/AppError");
const sqliteConnection = require("../database/sqlite");
const {hash, compare} = require('bcryptjs')

class UsersControllers{
    async create(req, res){
        const {name, email, password} = req.body;
        
        const database = await sqliteConnection();
        const checkIfEmailExists =  await database.get("SELECT * FROM users WHERE email = (?)", [email])
        
        //Email verification
        if(checkIfEmailExists){
            throw new AppError("This email already exists")
        }
        
        const hashPassword = await hash(password, 8)

        //Inserting new users
        await database.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name,email,hashPassword] )
            
            res.status(201).json({name,email,password})
        }
        
    async update(req, res){
        const {name, email, password, old_password} = req.body;
        const { id } =  req.params;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        //Update Email verification
        if(!user){
            throw new AppError('User not found')
        }

        const userWithUpdatedEmail  = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError('This email already exists');
        }
        
        user.name = name ?? user.name;
        user.email = email ?? user.email;

        //Passwords verification
        if(password && !old_password){
            throw new AppError('You need to enter an old password')
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppError("The old password is incorrect")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?
        `, [user.name, user.email, user.password, id]);
        
        return res.json();    
    }

    }
    
module.exports = UsersControllers
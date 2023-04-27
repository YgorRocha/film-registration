const {Router} = require('express');
const UsersControllers = require('../Controllers/usersControllers');

const usersControllers = new UsersControllers;

const userRoutes = Router();

userRoutes.post("/", usersControllers.create);

module.exports =  userRoutes;


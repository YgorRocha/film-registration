const sqliteConnetion = require('../../sqlite');
const createUser = require('./createUser');

async function migrationsRun(){
    const schemas = [
        createUser
    ].join('')

    
    sqliteConnetion().then(db => db.execute).catch(error => console.error(error));
}


module.exports = migrationsRun;
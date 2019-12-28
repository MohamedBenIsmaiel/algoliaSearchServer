const Sequelize = require('sequelize');
const sequelize = new Sequelize('algolia','root','password',{
    host: "localhost",
    dialect: "mysql",
});
sequelize.authenticate()
.then(()=>console.log('connection to database success'))
.catch(err=>console.log(err));
module.exports = sequelize;

const express = require('express');

const sequelize = require('./db_connect');
const User      = require('./models/user');
const router    = require('./route/route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',router);

sequelize.sync().then(res=>{
    const port = process.env.port || 3000;
    app.listen(port,()=>{
        console.log(`Server Listens on ${port}`);
        console.log('user table created');
    });
}).catch(err=>{
    console.log(err);
})

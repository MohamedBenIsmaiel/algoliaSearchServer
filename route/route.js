const router = require('express-promise-router')();
const _      = require('lodash');

const algoliasearch = require('algoliasearch');
const client = algoliasearch('H5MC6V0P03', 'e2f32ed79dcc249b86532f6ae9bcb95a');
const index = client.initIndex('beehive');

const User   = require('../models/user');

router.post('/user',async(req,res,next)=>{
    const userName = req.body.userName;
    const email    = req.body.email;
    const result = await User.create({
        userName,
        email,
    });
    res.send({
        result,
    })
});

router.get('/user',async(req,res,next)=>{
    const result = await User.findAll();
    res.send({
        result,
    })

    index.addObjects(result, function(err, content) {
        if (err) {
          console.error(err);
        }
    });
})

router.get('/user/:id',async(req,res,next)=>{
    const result = await User.findOne({
        where: {
            id:req.params.id
        }
    });
    res.send({
        result,
    })
})

router.delete('/user/:id',async(req,res,next)=>{
    const result = await User.destroy({
        where: {
            id:req.params.id
        }
    });
    
    res.send({
        result,
    })
})

router.put('/user/:id',async(req,res,next)=>{
    const result = await User.update({
        userName : req.body.userName,
        email    : req.body.email
    },
    { 
        where: {
        id:req.params.id
        }
    }
);
   index.partialUpdateObjects(result,(err,res)=>{
       if(err) {
           console.log(err);
       }
   })
    res.send({
        result,
    })
})

router.get('/search',async(req,res,next)=>{
    index.search({
        query: req.query.search
        },
        (err, { hits } = {}) => {
          if (err) console.log(err);
      
          console.log(hits);
        }
      );
})


module.exports = router;

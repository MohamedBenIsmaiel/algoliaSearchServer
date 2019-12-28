const router = require('express-promise-router')();
const _      = require('lodash');

const algoliasearch = require('algoliasearch');
//here the algolia setting (appKEy,adminKEy) wil save in .env file in the future 
const client = algoliasearch('H5MC6V0P03', 'e2f32ed79dcc249b86532f6ae9bcb95a');
const index = client.initIndex('beehive');
index.setSettings({searchableAttributes:['userName','email']});

const User   = require('../models/user');

router.post('/user',async(req,res,next)=>{
    const userName = req.body.userName;
    const email    = req.body.email;
    const result = await User.create({
        userName,
        email,
    });
    // when add student to the database it will added to algolia too
    // there is another method called addObjects can take array of objects
    index.addObject(result, function(err, content) {
        if (err) {
          console.error(err);
        }
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
       let result = await User.destroy({
        where: {
            id:req.params.id
        },
      });
   //   when delete record from the database it will delete from algolia too 
     await  index.deleteBy({
        numericFilters: [
         [
           `id = ${req.params.id}`,
         ]
      ]
   });
    
     res.send({
        result,
    })
})

router.put('/user/:id',async(req,res,next)=>{
    let result = await User.update({
        userName : req.body.userName,
        email    : req.body.email
    },
    { 
        where: {
        id:req.params.id
        },
    }
);
  result = await User.findByPk(req.params.id);

  // when update record from my database it will update in algolia too
  //there is another method called partialUpdateObjects can take array of objects
   index.partialUpdateObject(result,(err,res)=>{
       if(err) {
           console.log(err);
       }
   })
    res.send({
        result,
    })
})

router.get('/search',async(req,res,next)=>{
    //  here the search api 
   index.search(req.query.search).then(reslt =>{
     res.send({reslt,}) 
   });
    
})


module.exports = router;

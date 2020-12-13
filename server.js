const express= require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrl = require('./models/shortUrl');
mongoose.connect('mongodb://localhost/urlShortener' , {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

app.set('view engine' , 'ejs');
app.use(express.urlencoded({extended:false}));
app.get('/' , (req,res)=>{
    shortUrl.find().sort({createdAt:-1}).then((result)=>{
        res.render('index' , {shortUrls:result});
    }).catch((err)=>{
        console.log(err);
    });
})
app.post('/shortUrls' , async (req,res)=>{
    const u = req.body.fullUrl.trim();
    shortUrl.findOne({full:u}).then( x=>{
        if(!x) //doesnt exist
        {//add it
            const blog = new shortUrl({full:u});
            blog.save().then((result)=>{
                res.redirect('/blogs');
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch(err=>{
        console.log(err);
    });
     res.redirect('/');
})

app.get("/:short" , async (req,res)=>{
    const short=req.params.short;
    const x= await shortUrl.findOne({short:short});
    if(x==null) res.status(404);
    x.clicks++;
    x.save();
    res.redirect(x.full);
})

app.listen(process.env.PORT || 5000);
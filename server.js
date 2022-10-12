const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// middleware
app.set('view engine','ejs')
app.use(express.urlencoded({extended : false}))
// const uri = "mongodb+srv://ParasNagpal:<password>@cluster0.w6f1ht8.mongodb.net/UrlShortnerretryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// make sure to run mongod locally
mongoose.connect('mongodb://localhost:27017/urlShortener',{
  useNewUrlParser : true ,
  useUnifiedTopology : true
})

app.get('/', async(req,res)=>{
  const shortUrls = await ShortUrl.find()
  res.render('index',{shortUrls : shortUrls})
})

app.post('/shortUrls', async (req,res)=>{
    await ShortUrl.create({full : req.body.fullUrl})
    res.redirect('/')
})


app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

const port = process.env.PORT || 3000

app.listen(port , ()=>{
  console.log(`Server is successfully running on port ${port} ...`)
})

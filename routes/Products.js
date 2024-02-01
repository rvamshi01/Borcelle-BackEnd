const app= require("express")
const router= app.Router()
const Product=require("../models/productmodel")
const jwt= require("jsonwebtoken")

router.get('/',async(req,res)=>{
  const products= await Product.find({})
  res.status(200).json(products)
})

router.post("/", async(req,res)=>{
    const {name,description,price,image}=req.body;
    if(!name||!description||!price || !image){
        res.status(400).json({message:"please enter required fields"})
    }
    const checkProduct=await Product.findOne({name:name})
    if(checkProduct){
        res.status(401).json({message:"Product is already exists"})
        return;
    }
  const token= req.headers.authtoken
  if(!token){
    res.status(401).json({message:"Un Authorized"})
  }
  const decodetoken=jwt.decode(token,process.env.HASH_KEY)
  if(decodetoken.user.role!=='admin'){
    res.status(400).json({message:"Un Authorized"})

  }
  const product= await Product.create({
    name,description,price,image
  })
  res.status(201).json(product)
})
router.put("/:id", async(req,res)=>{
    const id= req.params.id
    const {name,description,price,image}=req.body;
    const checkProduct=await Product.findById(id)
    if(!checkProduct){
        res.status(401).json({message:"There is no such product"})
        return;
    }
  const token= req.headers.authtoken
  if(!token){
    res.status(401).json({message:"Un Authorized"})
  }
  const decodetoken=jwt.decode(token,process.env.HASH_KEY)
  if(decodetoken.user.role!=='admin'){
    res.status(400).json({message:"Un Authorized"})

  }
  const product= await Product.findByIdAndUpdate(id,{
    name,description,price,image
  },{new:true})
  res.status(201).json(product)
})
router.get("/:id",async(req,res)=>{
    const id=req.params.id
    const product=await Product.findById(id)
    if(!product){
        res.status(400).json({meassage:"there is no such product"})
    }
    res.status(200).json(product)

})


router.delete("/:id",async(req,res)=>{
    const id=req.params.id
    const token= req.headers.authtoken
  if(!token){
    res.status(401).json({message:"Un Authorized"})
  }
  const decodetoken=jwt.decode(token,process.env.HASH_KEY)
  if(decodetoken.user.role!=='admin'){
    res.status(400).json({message:"Un Authorized"})

  }
    const product=await Product.findByIdAndDelete(id)
    if(!product){
        res.status(400).json({meassage:"there is no such product"})
    }
    res.status(200).json(product)

})

module.exports=router
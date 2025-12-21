const Express = require("express")
const app = Express() 
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT
const bcrypt = require("bcrypt")
const jwt =  require("jsonwebtoken")
const dburl = process.env.URL
const mongoose = require("mongoose")
const { UserModel } = require("./Models/Models")


app.use(Express.json())


async function dbconnect() {
const dbconnet = await mongoose.connect(dburl)
.then((result) => console.log("db connect sucessful") )
.catch((err) => console.log("the error is : ",err))
}
dbconnect()

    app.post("/signup",async function Signup(req,res) {
    const {name,email,password} = req.body
        if(!name || !email || !password) {
        return res.status(404).json({
            message : "details are missing "
        })
    } 
    const hashedpassword = await bcrypt.hash(password,10)
    console.log("the hashed password is",hashedpassword)

    const CreateUser = await UserModel.create({
        name : name,
        email : email,
        password : hashedpassword
    })
    .then((result) => res.json({
        message : "user create sucessfully"
    }))
})

app.post("/signin", async(req,res) => {

    const {email,password} = req.body
    if(!email || !password){
        res.json({
            message : "please enter all the data"
        })
    }
    const user = await UserModel.findOne({email})
    const verify = await bcrypt.compare(password,user.password)
    const token = await jwt.sign({id : user._id},"secret")
    res.cookie("token",token)

        res.json({
        message : "user found",
        //user : user,
        verify : verify,
        cookie : "cookie sent"

    })


    //console.log(token)

})



/*async function hash() {
const hash = await bcrypt.hash("kjhdkjfhdkj",10)
console.log(hash)
}
hash() */


app.listen(port,()=> console.log(`the server is running in the port ${port}`))
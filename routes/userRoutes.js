import e from "express";
import { User } from "../models/user.js";
import { generateToken,jwtAuthMiddleware } from "../jwt.js";

const route = e.Router();
route.post('/signup',async (req,res)=>{
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
          id:response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is :" ,token);
        res.status(200).json({response:response,token:token})
        
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'});
    }
})

route.post('/login', async(req,res)=>{
  try {
    // Extract usernamme and password from req body
    const {aadharCardNumber,password} = req.body;
    // find the user by username
    const user = await User.findOne({aadharCardNumber:aadharCardNumber})

    // if user does not exist or password does not match retun eoor
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:"Invalid username or password"})
    }

    // generate Token
    const payload ={
      id:user.id,
    }
    const token = generateToken(payload)
    res.json({token})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'Internal Server Error'});
    
  }
})

route.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'Internal Server Error'})
    
  }
})

route.put('/profile/password',async(req,res)=>{
    try {
        const userId = req.user; //Extract the id from the token
        const {currentPassword,newPassword} = req.body

        const user = await User.findById(userId);

        if(!(await user.comparePassword(currentPassword))){
          return res.status(401).json({error:'invalid username or password'})
        }

        user.password=newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json(response)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
})





// comment added for testing purpose

export default route;

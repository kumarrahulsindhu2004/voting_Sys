import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        // required:true
    },
    mobile:{
        type:String,
        // required:true
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save',async function (next) {
const user = this

// Has the password only if has been modified or in new
if(!user.isModified('password')) return next()
    try {
        // hash password generation
        const salt = await bcrypt.genSalt(10);
        // hash password

        const hashedPassword = await bcrypt.hash(user.password,salt)

        // override the palin password with the hashed one
        user.password=hashedPassword
        next();
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword,this.password)
        return isMatch
    } catch (error) {
        throw error
    }
} 
    

export const User = mongoose.model('User',userSchema);
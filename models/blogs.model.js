const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const blogsSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    title:{
        type:String
    },
    content:{
        type:String
    },

    text:{
        type:String
    }

}, {timestamps:true})

// Pre-save middleware to hash password if modified
blogsSchema.pre('save', async function (next) {
    const user = this;

    // Hash the password only if it has been modified or is new
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

blogsSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};



module.exports = mongoose.model('Blogs', blogsSchema)
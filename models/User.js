const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ChatBots: [
        {
          name: String,
          id: String
        }
      ]
});

const AssistantSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    owner:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    enabled:{
        type:Boolean,
        required:true
    }
});

const User = mongoose.model('User', UserSchema);
const Assistant = mongoose.model('Assistant', AssistantSchema);

module.exports = {
    User,
    Assistant
}
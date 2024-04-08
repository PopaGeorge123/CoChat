const mongoose = require('mongoose');
const db = "mongodb+srv://owner:admin@myfirstexp.qzr4dkq.mongodb.net/?retryWrites=true&w=majority";

const DBSchemas = require("../models/User.js");

mongoose.connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    async function addAsstToUser(user,assistant){
        try {
            const updateResult = await DBSchemas.Assistant.updateOne(
                { _id: user },
                { $push: { assistants: assistant } }
            );
    
            return updateResult
        } catch (error) {
            console.error('Error adding asst to user:', error);
            return false;
        }
    }
addAsstToUser('')
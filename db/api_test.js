const mongoose = require('mongoose');
const db = "mongodb+srv://owner:admin@myfirstexp.qzr4dkq.mongodb.net/?retryWrites=true&w=majority";

const DBSchemas = require("../models/User.js");

mongoose.connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

async function createAssistant() {
    try {
        const newAssistant = new DBSchemas.Assistant({
            _id: '123',
            name: 'ASSISTANT_1',
            owner: "ownerId",
            model: "model",
            status : true,
            enabled : false
        });
        const savedAssistant = await newAssistant.save();
        console.log(savedAssistant)
    } catch (error) {
      console.error('Error creating Assistant:', error);
      return false;
    }
}
createAssistant()
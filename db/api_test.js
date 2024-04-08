const mongoose = require('mongoose');
const db = "mongodb+srv://owner:admin@myfirstexp.qzr4dkq.mongodb.net/?retryWrites=true&w=majority";

const DBSchemas = require("../models/User.js");

mongoose.connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
        try {
            const updateResult = await DBSchemas.User.updateOne(
                { _id: user },
                { $push: { assistants: assistant } }
            );
            console.log(updateResult)
            return updateResult
        } catch (error) {
            console.error('Error adding asst to user:', error);
            return false;
        }
addAsstToUser('660e5c19da601b06a09f5eca',{
    name:'viorel',
    _id:'bjsncnscscsncnklsn'
})
const DBSchemas = require("../models/User.js");


async function createChatBot(id,creator_id,email,word,score) {
  const newQuestion = new DBSchemas.Question({
    _id: id,
    solved: false,
    creator_id: creator_id,
    email: email,
    word: word,
    score: score
  });

  try {
    if (englishWords.check(newQuestion.word)) {
      const savedQuestion = await newQuestion.save();
      return savedQuestion ? true : false;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error creating word instance:', error);
    return false;
  }
}

async function getWordDataById(id) {
  try {
    const question = await DBSchemas.Question.find( {_id : id} );

    return question

  } catch (error) {
    console.error('Error creating word instance:', error);
    return false;
  }
}

async function checkWord(word) {
  if(word.length >= 4){
    try {
      return englishWords.check(word) ? true : false
    } catch (error) {
      console.error('Error creating word instance:', error);
      return false;
    }
  }else{
    return false;
  }
}

async function deleteWord(id) {
  try {
    const result = await DBSchemas.Question.deleteOne({ _id: id });


  } catch (error) {
    console.error('Error creating word instance:', error);
    return false;
  }
}

  
module.exports = {
    getWordDataById,
    checkWord,
    deleteWord
};
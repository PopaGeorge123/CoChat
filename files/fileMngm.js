const fileHandler = require('./savedel')
const count = require('./countchrs')

async function getCharCount(fileData , fileName){
  try{
    const path = await fileHandler.saveFile(fileData, fileName ,'/tempFiles')
    const chars = await count.CountCharacters(path)
    await fileHandler.deleteFile(path)
    return chars
  }catch(err){
    console.error(err)
  }
}

module.exports = {
  getCharCount
}
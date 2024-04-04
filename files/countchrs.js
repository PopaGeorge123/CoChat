const { content } = require('@supercharge/fs');
const { Str } = require('@supercharge/strings');
const fs = require('fs');
const pdf = require('pdf-parse');
const textract = require('textract');

//const inputFile = '../openai/test-files/demo.doc';

const CountCharacters = async (file) => {
    const extension = file.split('.').pop();

    if (extension === 'pdf') {
        const dataBuffer = fs.readFileSync(file);
        const data = await pdf(dataBuffer);
        return data.text.length;
    }

    if (extension === 'txt') {
        try {
            const fileContent = await content(file);
            const wordArray = Str(fileContent).words();
            return wordArray.join('').length;
        } catch (err) {
            console.error('Error:', err);
        }
    }

    if (extension === 'doc' || extension === 'docx') {
        try {
            return new Promise((resolve, reject) => {
                textract.fromFileWithPath(file, function (error, text) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(text.length);
                    }
                });
            });
        } catch (err) {
            console.error(err);
        }
    }
};

module.exports = {
    CountCharacters
}

var express = require('express');
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let text = [
    {
        "id": 1,
        "name": "Rahul",
        "email": "rahul@gmail.com",
        "password": "123456"
    },
    {
        "id": 2,
        "name": "Rahul",
        "email": "rahul@gmail.com",
        "password": "123456"
    }
];

const IV_LENGTH = 16; 
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = 'f3d76a1c4b8e9c3a5e8f12d8a9b6c7d0e4f1a2b3c4d5e6f7890a1b2c3d4e5f6a';

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    console.log(iv.toString('base64'));
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64'); 
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted; 
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'base64');
    let encryptedText = Buffer.from(textParts.join(':'), 'base64');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const encryptedOutput = encrypt(JSON.stringify(text));
console.log("Encrypted Text: ", encryptedOutput);

const decryptedText = decrypt(encryptedOutput);
console.log("Decrypted Text: ", decryptedText);

var telegram = require('telegram-bot-api')
const Regcount = require('./count.js')
const Free = require('./free.js');
const fs = require('fs');
const Memes = require('./meme.js');
require('dotenv').config();
const Gravitas = require('./gravitas.js')
const Ctf = require('./ctf.js')
const API_token = process.env.API_TOKEN
console.log(API_token)
const strings = require('./strings');
const password = process.env.PASS
var api = new telegram({
    token: API_token,
    updates: {
        enabled: true
    }
});

api.getMe()
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        console.error(err);
    });

api.on('message', function (message) {
    console.log(message); // Received text message

    if (message.text === '/start') {

        api.sendMessage({
            chat_id: message.chat.id,
            text: strings.startMessage,
        });

    } else if (message.text === '/count' || message.text === '/count@CSI_Brobot') { //got a count command

        if (!message.chat.title) {
            api.sendMessage({
                chat_id: message.chat.id,
                text: strings.worksOnlyForGroups,
            });
        } else {

            if (/csi/i.test(message.chat.title)) { // i implies ignore case

                api.sendMessage({
                    chat_id: message.chat.id,
                    text: strings.gettingRegCount,
                });
                Regcount.counter(message, api);
            }
        } //for CSI groups

    } else if (message.text == password) {

        api.sendMessage({
            chat_id: message.chat.id,
            text: strings.gettingRegCount,
        });

        Regcount.counter(message, api);
    }
    else if (/hey /i.test(message.text) || /hello /i.test(message.text) || /hi /i.test(message.text)) {
        api.sendDocument(
            {
                chat_id: message.chat.id,
                document: "assets/giphy.gif"
            }
        );
    }
    else if (/sexy /i.test(message.text)) {
        api.sendDocument(
            {
                chat_id: message.chat.id,
                document: "assets/tenor.gif"
            }
        );
    }
    else if (/love /i.test(message.text)) {
        api.sendMessage(
            {
                chat_id: message.chat.id,
                text: strings.loveMessage
            }
        );
    }
    else if (/free/i.test(message.text) || message.text === '/free' || message.text === '/free@CSI_Brobot') {
        api.sendMessage(
            {
                chat_id: message.chat.id,
                text: 'Getting '
            }
        );
        Free.freepeople(message, api);
    }
    else if (/memes/i.test(message.text) || message.text === '/meme' || message.text === '/meme@CSI_Brobot') {
        api.sendMessage(
            {
                chat_id: message.chat.id,
                text: 'Lemmi find some dank ones!'
            }
        );
        await Memes.downloadMemes();
        let files = new Array();
        fs.readdirSync('memes').forEach(file => {
            files.push("memes/" + file);
        });
        Promise.all(files.map(file => {
            api.sendPhoto({
                chat_id: message.chat.id,
                photo: file
            });
        })).catch((err) => {
            console.log(err);
        });
    }

    else if (/ctf/i.test(message.text) || message.text === '/CTF' || message.text === '/CTF@CSI_Brobot') {

        Ctf.Regcount(message, api);
    }
    else if (/gravitas/i.test(message.text)) {

        Gravitas.Regcount(message, api);
    }
    else {
        api.sendMessage(
            {
                chat_id: message.chat.id,
                text: strings.failedToUnderstand
            }
        );
    }
});

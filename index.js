const axios = require('axios');
const pino = require('pino');
const pinoPretty = require('pino-pretty');
var cron = require('node-cron');


//variable declaration
const url = '<API_TO_MONITOR>'

//logger setup 
const stream =  pinoPretty({
    colorize: true
  })
const logger = pino ({ level: 'info' }, stream);


function fetch() {
// fetch current slots
axios({
    method: 'get',
    url: url,
  })
    .then(function (response) {
        logger.info(response.data.code + " | " + response.data.status)
        //Handle payload here
    });
}
// push the data to your telegram
function telegramPush(message){
    axios.post('https://api.telegram.org/<YOUR BOT CREDENTIALS HERE>/sendMessage', { // /getUpdates to fetch the ChatID
                    chat_id: '<TELEGRAM_CHAT_ID>',
                    text: message,
                    disable_notification: false
                  })
                  .then(function (response) {
                    logger.info(response);
                  })
                  .catch(function (error) {
                    logger.error(error);
                  });            
}

fetch() // run it once to make sure it works

cron.schedule('*/20 * * * *', () => { // fetch the API and push results every 20 min
    fetch()
});

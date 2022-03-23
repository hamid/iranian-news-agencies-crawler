var lib = require('./app.js');


(async function () {

    var lastNews = await lib('fars', { includeNewsText: true });
    console.log(lastNews);

})();


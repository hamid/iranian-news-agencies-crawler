var fetchNews = require('./app.js');


(async function () {

    var lastNews = await fetchNews('fars', { includeNewsText: true });
    console.log(lastNews);

})();


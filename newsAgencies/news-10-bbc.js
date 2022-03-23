var url         = "http://feeds.bbci.co.uk/persian/rss.xml";
const cheerio   = require('cheerio');
const got       = require('got');
var striptags   = require('striptags');


module.exports = async function (options) {

    var response = await got(url);
    var $        = cheerio.load(response.body,{ xmlMode: true});

    
    var list = [];
    $('channel item').each((i, item) => {
        if(i == 0)
            return null;

        var title       = $('title',item).text();
        var link        = $('link',item).html();
        var id          = $('guid',item).text();
        var categories  = [] ;
        var date        = $('pubDate',item).text();

        list.push({ title, link, id, categories,date} );
    });

    if (options.includeNewsText == false)
        return list;

    const mapPromises = list.map(async (rawitem, i) => {
        var item = list[i];
        try {
            if (item['id'])
            {
                var itemHtml    = await got(item['id']);
                var $           = cheerio.load(itemHtml.body);
                var desc        = "";
                var text        =  $('main[role="main"]').text();
                var img         = $('main[role="main"] img').first().attr('src');
                list[i]['text'] = striptags(text);
                list[i]['img']  = img;

                //-- find keywords
                var keywords = [];
                list[i]['keywords'] = keywords;
            }
        }catch (e) {
            list[i]['err'] = true;
            list[i]['errMEssage'] = e.message ? e.message : "";
        }

    });

    await Promise.all(mapPromises);
    return list;
};
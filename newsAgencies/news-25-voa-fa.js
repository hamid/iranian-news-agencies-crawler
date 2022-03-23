var url         = "https://ir.voanews.com/taxonomy/term/135/feed";
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
        var id          = $('link',item).text();
        var categories = []
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
                var itemHtml    = await got(item['link']);
                var $           = cheerio.load(itemHtml.body);
                var desc        = "";
                var text        = $('#article-content').text();
                var img         = $('.article__featured-media .media--type-image img').first().attr('src');
                
                list[i]['img']  = img;
                list[i]['text'] = (striptags(text)).replace('\n', "");


                //-- find category
                var categorydom = $('.page-header__eyebrow').text();
                var category = [categorydom ];
                //-- find keywords
                var keywords = [];
            }

        } catch (e) {
            list[i]['err'] = true;
            list[i]['errMEssage'] = e.message ? e.message : "";
        }

    });

    await Promise.all(mapPromises);
    return list;
};
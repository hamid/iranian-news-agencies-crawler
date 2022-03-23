var url         = "https://ir.sputniknews.com/export/rss2/archive/index.xml";
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
        var desc        = $('description',item).text();
        var id          = $('link',item).text();
        var categories = [$('category', item).text()]
        var date        = $('pubDate',item).text();
        var img        = $('enclosure',item).attr('url');

        list.push({ title, link, id, categories, date, img, desc} );
    });

    if (options.includeNewsText == false)
        return list;

    const mapPromises = list.map(async (rawitem, i) => {
        var item = list[i];
        try {
            if (item['id'])
            {
                var itemHtml    = await got(item['id']);
                var $           = cheerio.load(itemHtml.body, { xmlMode: true });
                var desc        = "";
                var text        = $('.article__body').text();
                // var img         = $('.body img').first().attr('src');
                
                list[i]['text'] = (striptags(text)).replace('\n',"");
                // list[i]['img']  = "https://www.iribnews.ir"+img;


                //-- find category
                // var category = [];
                // var categorydom = $('.news_path a');
                // if (categorydom && categorydom.length)
                //     categorydom.each((index, keywordItem)=>{
                //             category.push($(keywordItem).text().trim());
                //     })
                //-- find keywords
                var keywords = [];
                // var keywordsDom = $('.post-tag a');
                // if(keywordsDom && keywordsDom.length)
                //     keywordsDom.each((index, keywordItem)=>{
                //         keywords.push($(keywordItem).text().trim());
                //     })
            }
        } catch (e) {
            list[i]['err'] = true;
            list[i]['errMEssage'] = e.message ? e.message : "";
        }

    });

    await Promise.all(mapPromises);
    return list;
};
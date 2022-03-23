var url         = "https://www.iribnews.ir/fa/rss/allnews";
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
                var text        = $('.body').text();
                var img         = $('.body img').first().attr('src');
                
                list[i]['text'] = (striptags(text)).replace('\n',"");
                list[i]['img']  = "https://www.iribnews.ir"+img;


                //-- find category
                var category = [];
                var categorydom = $('.news_path a');
                if (categorydom && categorydom.length)
                    categorydom.each((index, keywordItem)=>{
                            category.push($(keywordItem).text().trim());
                    })
                list[i]['categories'] = category;

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
var url         = "https://www.yjc.ir/fa/rss/allnews";
const cheerio   = require('cheerio');
const got       = require('got');


module.exports = async function (options) {
    
    var response = await got(url);
    var $        = cheerio.load(response.body,{ xmlMode: true});
    
    var list = [];
    $('channel item').each((i, item) => {
        if(i == 0)
            return null;

        var title       = $('title',item).text();
        var link        = $('link',item).text();
        var linkParts   = link.split('/');
        if (linkParts[linkParts.length - 1]){
            linkParts[linkParts.length - 1] = '';
        }
        var id          = linkParts.join('/');
        var categories  = [];
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
                var title2      = $('.news_strong').text();
                var text        = title2  + $('.news_body_new .body').text();
                list[i]['text'] = text;


                //-- find category
                var categories = [];
                $('.news_path a').each((i , item)=>{
                    if (item) categories.push($(item).text().toString().trim())
                })
                list[i]['categories'] = categories;
                
                //-- find keywords
                var keywords = [];
                $('.tag_items_photo a').each((i , item)=>{
                    if (item) keywords.push($(item).text().toString().trim())
                })
                list[i]['keywords']     = keywords;
            }
        } catch (e) {
            list[i]['err'] = true;
            list[i]['errMEssage'] = e.message ? e.message : "";
        }

    });

    await Promise.all(mapPromises);
    return list;
};
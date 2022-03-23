var url         = "https://www.borna.news/feeds/";
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
                var $           = cheerio.load(itemHtml.body, { xmlMode: true });
                var desc        = "";
                var text        = $('#echo_detail').text();
                var img         = $('.article_header img:first-child').first().attr('src');
                
                list[i]['text'] = (striptags(text)).replace('\n',"");
                list[i]['img']  = img;


                //-- find category
                var category = [];
                var categorydom = $('.breadcrumb_list a span');
                if (categorydom && categorydom.length)
                    categorydom.each((index, keywordItem)=>{
                        if(index != 0)
                            category.push($(keywordItem).text().trim());
                    })
                //-- find keywords
                var keywords = [];
                var keywordsDom = $('.breadcrumb_list a');
                if(keywordsDom && keywordsDom.length)
                    keywordsDom.each((index, keywordItem)=>{
                        if ($(keywordItem).text().trim() != "خانه")
                            keywords.push($(keywordItem).text().trim());
                    })
                list[i]['keywords'] = keywords;

            
            }
        } catch (e) {
            list[i]['err'] = true;
            list[i]['errMEssage'] = e.message ? e.message : "";
        }

    });

    await Promise.all(mapPromises);
    return list;
};
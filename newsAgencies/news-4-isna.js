var url         = "https://www.isna.ir/rss";
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
        var link        = $('link',item).html();
        var id          = $('guid',item).text();
        var categories = $('category', item).text().split('>');
        if(categories)
            categories = categories.map((item)=>item.trim());
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
                // var title2      = $('.subtitle a').text();
                var desc        = $('p.summary').text();
                var text        =  desc + $('div.item-text').text();
                list[i]['text'] = text;


                //-- find keywords
                var keywords = [];
                $('.tags ul li a').each((i , item)=>{
                    if (item) keywords.push($(item).text().toString().trim())
                })
                list[i]['keywords']     = keywords;
            }
        }catch (e) {
                list[i]['err'] = true;
                list[i]['errMEssage'] = e.message ? e.message : "";
            }

        });

    await Promise.all(mapPromises);
    return list;
};
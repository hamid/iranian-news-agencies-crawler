var url         = "https://www.farsnews.ir/rss";
const got       = require('got');
const cheerio   = require('cheerio');


module.exports = (async function (options) {
    
    var response = await got(url);
    var $        = cheerio.load(response.body);

    
    var list = [];
    $('channel item').each((i, item) => {
        if(i == 0)
            return null;

        var title   = $('title',item).text();
        var link    = $('link',item).text();
        var id      = $('guid',item).text();
        var date    = $('pubDate',item).text();

        list.push( { title,link,id,date} );
    });

    if (options.includeNewsText  == false )
        return list;

    const mapPromises = list.map(async (rawitem,i)=>{
        var item = list[i];
        try{
            if (item['id'])
            {
                var itemHtml    = await got(item['id']);
                var $           = cheerio.load(itemHtml.body);
                var title2      = $('p.lead').text();
                var text        = title2 + $('div.nt-body').text() ;
                list[i]['text'] = text;

                //-- find category
                var categories = [];
                $('div.category-name a').each((i , item)=>{
                    if (item) categories.push($(item).text().toString().trim())
                })
                list[i]['categories'] = categories;

                //-- find keywords
                var keywords = [];
                $('div.nt-frame div.tags a').each((i , item)=>{
                    if (item) keywords.push($(item).text().toString().trim())
                })
                list[i]['keywords'] = keywords;
            }
        }catch(e)
        {
            list[i]['err'] = true;
            list[i]['errMEssage'] = e.message ? e.message  : "";
        }

    });

    await Promise.all(mapPromises);
    return list;
});
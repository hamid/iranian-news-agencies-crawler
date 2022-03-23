

module.exports = async function (agencyName, options = { includeNewsText:false} ) {

    var agencyCrawler       = await _loadNewsAgencyCrawler();

    if (agencyCrawler[agencyName])
        return agencyCrawler[agencyName](options);
    else 
        return { err: true, mes:"agencyName is incorrect"};

}


_loadNewsAgencyCrawler  = async function(){
    var agencyCrawler               = {};
    agencyCrawler['fars']           =  require('./newsAgencies/news-1-fars');
    agencyCrawler['irna']           =  require('./newsAgencies/news-2-irna');
    agencyCrawler['yjc']            =  require('./newsAgencies/news-3-yjc');
    agencyCrawler['isna']           =  require('./newsAgencies/news-4-isna');
    agencyCrawler['tasnim']         =  require('./newsAgencies/news-5-tasnim');
    agencyCrawler['bbc']            =  require('./newsAgencies/news-10-bbc');
    agencyCrawler['mehr']           =  require('./newsAgencies/news-14-mehr');
    agencyCrawler['ilna']           =  require('./newsAgencies/news-15-ilna');
    agencyCrawler['ilna']           =  require('./newsAgencies/news-15-ilna');
    agencyCrawler['moj']            =  require('./newsAgencies/news-16-moj');
    agencyCrawler['tabnak']         =  require('./newsAgencies/news-17-tabnak');
    agencyCrawler['khabaronline']   =  require('./newsAgencies/news-18-khabaronline');
    agencyCrawler['borna']          =  require('./newsAgencies/news-19-borna');
    agencyCrawler['ana']            =  require('./newsAgencies/news-20-ana');
    agencyCrawler['alef']           =  require('./newsAgencies/news-21-alef');
    agencyCrawler['irib']           =  require('./newsAgencies/news-22-irib');
    agencyCrawler['sporting']       =  require('./newsAgencies/news-23-sputnik');
    agencyCrawler['independent']    = require('./newsAgencies/news-24-independent');
    agencyCrawler['voa']            = require('./newsAgencies/news-25-voa-fa');

    return agencyCrawler;
}
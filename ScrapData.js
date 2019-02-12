const cheerio = require('cheerio');
const fs = require('fs');

const htmlData = fs.readFileSync('./EZ.html', 'utf8');
const $ = cheerio.load(htmlData);

const data = $([name="TESTPILOT"]);

$("form[name='TESTPILOT'] table tbody tr").each(function(i, ele){
       console.log(ele);
})

// const trTags = $('tr td a');
//
// trTags.each(function(i, ele){
//      var a = $(this);
//      console.log(a);
// });

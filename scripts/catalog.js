const axios = require('axios');
const cheerio = require('cheerio');

module.exports.getCatalogList = async url => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  return $('#main ul li a')
    .map(function () {
      return {
        name: $(this).text(),
        url: `https://catalog.ucsc.edu${$(this).attr('href')}`
      };
    })
    .toArray();
};

module.exports.getCoursesFromList = async url => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const courseUrls = $('.course-name a')
    .map(function () {
      return `https://catalog.ucsc.edu${$(this).attr('href')}`;
    })
    .toArray();

  const courses = [];
  const batchSize = 20;
  for (let i = 0, l = courseUrls.length; i < l; i += batchSize) {
      courses.push(...await Promise.all(courseUrls.slice(x, x + batchSize).map(u => module.exports.getCourse(u))));
  }

  return courses;
};

module.exports.getCourse = async url => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const course = {
    name: $('#main h1').contents().filter(function () { return this.type === 'text'; }).text(),
    url: url,
    code: $('#main h1 span').last().text(),
    desc: $('.desc').text(),
    credits: $('.extraFields p').filter(function() { return $(this).prev().text().includes('Credits') }).text(),
    reqs: $('.extraFields p').filter(function() { return $(this).prev().text().includes('Requirements') }).text(),
    quarters: $('.quarter p').text(),
    ge: $('.genEd p').text(),
    instructor: $('.instructor p').text(),
    repeatCredit: $('.extraFields p').filter(function() { return $(this).prev().text().includes('Repeatable for credit') }).text(),
    crosslisted: $('.crosslisted > p').text(),
    crosslistedReqs: $('.xlistReq p').text()
  };

  for (const key in course) {
    course[key].length
      ? course[key] = course[key].trim()
      : delete course[key];
  }

  return course;
};

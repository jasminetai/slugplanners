const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const getCatalogList = url => {
  return axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const data = [];

      $('#main ul li a').each(function () {
        data.push({
          name: $(this).text(),
          url: `https://catalog.ucsc.edu${$(this).attr('href')}`
        });
      });

      return data;
    })
    .catch(e => console.log(e));
};

const getCoursesFromCategory = url => {
  return axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const data = [];

      $('.course-name a').each(function () {
        data.push({
          name: $(this).contents().filter(function () {
            return this.type === 'text';
          }).text().trim(),
          code: $(this).find('span').text(),
          url: `https://catalog.ucsc.edu${$(this).attr('href')}`
        });
      });

      return data;
    })
    .catch(e => console.log(e));
};

const getCatalogCourse = url => {
  return axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      return $('.desc').text().trim();
    })
    .catch(e => console.log(e));
};

getCatalogList('https://catalog.ucsc.edu/Current/General-Catalog/Academic-Programs/Bachelors-Degrees')
  .then(data => {
    fs.writeFile('scripts/catalogmajors.json', JSON.stringify(data), function (e) {
      if (e) {
        console.log(e);
      }
    });
  })
  .catch(e => console.log(e));

getCatalogList('https://catalog.ucsc.edu/Current/General-Catalog/Academic-Programs/Undergraduate-Minors')
  .then(data => {
    fs.writeFile('scripts/catalogminors.json', JSON.stringify(data), function (e) {
      if (e) {
        console.log(e);
      }
    });
  })
  .catch(e => console.log(e));

getCatalogList('https://catalog.ucsc.edu/Current/General-Catalog/Courses')
  .then(data => {
    return Promise.all(data.map(category =>
      getCoursesFromCategory(category.url)
        .then(d => {
          return { ...category, list: d };
        })
        .catch(e => console.log(e))
    ));
  })
  .then(data => {
    fs.writeFile('scripts/catalogcourses.json', JSON.stringify(data), function (e) {
      if (e) {
        console.log(e);
      }
    });
  })
  .catch(e => console.log(e));
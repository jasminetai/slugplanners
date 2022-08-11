const fs = require('fs');
const Catalog = require('./Catalog.js');

(async() => {
  const majors = await Catalog.getCatalogList('https://catalog.ucsc.edu/Current/General-Catalog/Academic-Programs/Bachelors-Degrees');
  fs.writeFile('data/majors.json', JSON.stringify(majors), e => { if (e) console.log(e); });
  console.log('Majors done');

  const minors = await Catalog.getCatalogList('https://catalog.ucsc.edu/Current/General-Catalog/Academic-Programs/Undergraduate-Minors');
  fs.writeFile('data/minors.json', JSON.stringify(minors), e => { if (e) console.log(e); });
  console.log('Minors done');

  const subjects = await Catalog.getCatalogList('https://catalog.ucsc.edu/Current/General-Catalog/Courses');
  const courses = [];
  for (const subject of subjects) {
    courses.push(...await Catalog.getCoursesFromList(subject.url));
    console.log(subject.name, 'done');
  }
  fs.writeFile('data/courses.json', JSON.stringify(courses), e => { if (e) console.log(e); });
})();

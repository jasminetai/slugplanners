const fetchData = async () => {
  const [catalogMajors, catalogCourses, slugShort, slugLong] = await Promise.all([
    fetch("scripts/catalogmajors.json").then(response => response.json()).catch(e => console.log(e)),
    fetch("scripts/catalogcourses.json").then(response => response.json()).catch(e => console.log(e)),
    fetch("scripts/slugshort.json").then(response => response.json()).catch(e => console.log(e)),
    fetch("scripts/sluglong.json").then(response => response.json()).catch(e => console.log(e))
  ]).catch(e => console.log(e));
  return [catalogMajors, catalogCourses, slugShort, slugLong];
};

fetchData().then((data) => {
  const [catalogMajors, catalogCourses, slugShort, slugLong] = data;

  // search bar functionality
  const searchBar = document.getElementsByClassName('search-data')[0];

  const createSearchDropdown = () => {
    const searchDropdown = document.createElement('ul');

    searchDropdown.className = 'search-dropdown';
    document.getElementsByTagName('body')[0].insertBefore(searchDropdown, document.getElementById('plannercontainer'));

    catalogCourses.forEach(category => {
      category.list.forEach(course => {
        const newCourse = document.createElement('li');
        const newCourseInfo = document.createElement('div');
        const newCourseUrl = document.createElement('a');
        const newCourseAdd = document.createElement('button');

        newCourseUrl.href = course.url;
        newCourseUrl.target = '_blank';
        newCourseUrl.appendChild(document.createTextNode('Catalog page'));

        newCourseAdd.classList.add('course-add');
        newCourseAdd.appendChild(document.createTextNode('Add!'));
        newCourseAdd.addEventListener('click', promptAddCourse);

        newCourseInfo.classList.add('course-info');
        newCourseInfo.appendChild(newCourseUrl);
        newCourseInfo.appendChild(newCourseAdd);

        newCourse.classList.add('course-option');
        newCourse.info = newCourseInfo;
        newCourse.addEventListener('click', showCourseInfo);
        newCourse.appendChild(document.createTextNode(`${course.code} ${course.name}`));
        newCourse.appendChild(newCourseInfo);
        searchDropdown.appendChild(newCourse);
      });
    });

    updateSearchDropdown();
  };

  const updateSearchDropdown = () => {
    const input = searchBar.value.toLowerCase();
    const options = document.getElementsByClassName('course-option');
    const l = options.length;

    if (input.length < 3) {
      for (let i = 0, l = options.length; i < l; i++) {
        options[i].style.display = 'none';
      }
      return;
    }

    let c = 0;
    let i = 0;

    while (c < 10 && i < l) {
      option = options[i];
      if (option.textContent.toLowerCase().includes(input)) {
        option.style.display = 'list-item';
        option.getElementsByClassName('course-info')[0].style.display = 'none';
        c++;
      } else {
        option.style.display = 'none';
      }
      i++;
    }

    while (i < l) {
      options[i].style.display = 'none';
      i++;
    }
  };

  const showCourseInfo = event => {
    const option = event.target;
    
    option.info.style.display === 'block'
      ? option.info.style.display = 'none'
      : option.info.style.display = 'block';
  };

  const promptAddCourse = event => {
    const option = event.target;
    const course = event.target.course;
  };

  createSearchDropdown();
  searchBar.addEventListener('keyup', updateSearchDropdown);
});
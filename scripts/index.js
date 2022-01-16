const fetchData = async () => {
  const [catalogCourses] = await Promise.all([
    //fetch("scripts/catalogmajors.json").then(response => response.json()).catch(e => console.log(e)),
    //fetch("scripts/catalogminors.json").then(response => response.json()).catch(e => console.log(e)),
    fetch("scripts/catalogcourses.json").then(response => response.json()).catch(e => console.log(e)),
    //fetch("scripts/slugshort.json").then(response => response.json()).catch(e => console.log(e)),
    //fetch("scripts/sluglong.json").then(response => response.json()).catch(e => console.log(e))
  ]).catch(e => console.log(e));
  return catalogCourses;
};

fetchData().then((data) => {
  //const [catalogMajors, catalogCourses, slugShort, slugLong] = data;
  const catalogCourses = data;
  const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
  const years = ['2021-2022', '2022-2023', '2023-2024', '2024-2025'];
  let notifTimeout;
  let prevCourseInfo;

  // search bar
  const searchBar = document.getElementsByClassName('search-data')[0];

  const createSearchDropdown = () => {
    const searchDropdown = document.createElement('ul');
    const courseCodes = [];
    let courseList = [];

    searchDropdown.classList.add('search-dropdown');
    document.getElementsByTagName('form')[0].insertBefore(searchDropdown, document.getElementsByClassName('search-data')[0].nextSibling);

    catalogCourses.forEach(category => {
      category.list.forEach(c => {
        if (courseCodes.indexOf(c.code) === -1) {
          courseList.push(c);
          courseCodes.push(c.code);
        }
      });
    });

    courseList.forEach(course => {
      const newCourse = document.createElement('li');

      // adding classes menus
      const addMenu = document.createElement('div');

      // quarter menu
      const addQuarter = document.createElement('select');

      const defaultQuarter = document.createElement('option');
      defaultQuarter.value = '';
      defaultQuarter.disabled = true;
      defaultQuarter.hidden = true;
      defaultQuarter.selected = true;
      defaultQuarter.classList.add('default-quarter');
      defaultQuarter.appendChild(document.createTextNode('Select quarter'));

      for (let i = 0, l = quarters.length; i < l; i++) {
        const q = document.createElement('option');
        q.value = i;
        q.appendChild(document.createTextNode(quarters[i]));
        addQuarter.appendChild(q);
      }

      addQuarter.classList.add('quarter-select');
      addQuarter.appendChild(defaultQuarter);

      // year menu
      const addYear = document.createElement('select');

      const defaultYear = document.createElement('option');
      defaultYear.value = '';
      defaultYear.disabled = true;
      defaultYear.hidden = true;
      defaultYear.selected = true;
      defaultYear.classList.add('default-year');
      defaultYear.appendChild(document.createTextNode('Select year'));

      for (let i = 0, l = years.length; i < l; i++) {
        const y = document.createElement('option');
        y.value = i;
        y.appendChild(document.createTextNode(years[i]));
        addYear.appendChild(y);
      }

      addYear.classList.add('year-select');
      addYear.appendChild(defaultYear);

      addMenu.classList.add('add-menu');
      addMenu.appendChild(addQuarter);
      addMenu.appendChild(addYear);

      // info stuff
      const info = document.createElement('div');
      const infoUrl = document.createElement('a');
      const infoAddButton = document.createElement('button');

      infoUrl.href = course.url;
      infoUrl.target = '_blank';
      infoUrl.appendChild(document.createTextNode('Catalog'));

      infoAddButton.type = 'button';
      infoAddButton.classList.add('course-add-button');
      infoAddButton.appendChild(document.createTextNode('Add!'));
      infoAddButton.addEventListener('click', addCourse);

      info.classList.add('course-info');
      info.course = course;
      info.appendChild(infoUrl);
      info.appendChild(addMenu);
      info.appendChild(infoAddButton);

      // add the new course
      newCourse.classList.add('course-option');
      newCourse.info = info;
      newCourse.addEventListener('click', showCourseInfo);
      newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));
      newCourse.appendChild(info);
      searchDropdown.appendChild(newCourse);
    });

    updateSearchDropdown();
  };

  const updateSearchDropdown = () => {
    const input = searchBar.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
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
      if (option.childNodes[0].textContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").includes(input)) {
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

    if (option.info) {
      if (option.info.style.display === 'block') {
        option.info.style.display = 'none';
      } else {
        option.info.style.display = 'block';
        if (prevCourseInfo && prevCourseInfo !== option.info) {
          prevCourseInfo.style.display = 'none';
        }
        prevCourseInfo = option.info;
      }
    }
  };

  // add and remove courses from planner
  const addCourse = event => {
    const quarter = event.target.parentElement.querySelector('.quarter-select').options.selectedIndex;
    const year = event.target.parentElement.querySelector('.year-select').options.selectedIndex;
    const course = event.target.parentElement.course;

    if ([0, 1, 2, 3].includes(quarter) && [0, 1, 2, 3].includes(year)) {
      const cell = document.getElementsByClassName('planner')[0].rows[year + 1].cells[quarter + 1];
      const added = cell.querySelectorAll('li');

      const newCourse = document.createElement('li');
      const info = document.createElement('div');
      const url = document.createElement('a');
      const removeButton = document.createElement('button');

      url.href = course.url;
      url.target = '_blank';
      url.appendChild(document.createTextNode('Catalog'));

      removeButton.type = 'button';
      removeButton.classList.add('course-remove-button');
      removeButton.addEventListener('click', removeCourse);
      removeButton.appendChild(document.createTextNode(`Remove`));

      info.classList.add('planner-course-info');
      info.appendChild(url);
      info.appendChild(removeButton);

      newCourse.classList.add('planner-course');
      newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));
      newCourse.appendChild(info);
      newCourse.addEventListener('click', showCourseInfo);
      newCourse.info = info;
      newCourse.info.style.display = 'none';

      for (let i = 0, l = added.length; i < l; i++) {
        if (added[i].textContent === newCourse.textContent) {
          return addNotif(`${course.code}: ${course.name} is already added!`);
        }
      }

      if (!cell.querySelector('ul')) {
        const plannerCellList = document.createElement('ul');
        plannerCellList.classList.add('planner-cell-list')
        cell.appendChild(plannerCellList);
      }
      cell.querySelector('.planner-cell-list').appendChild(newCourse);
      return addNotif(`${course.code}: ${course.name} added!`);
    }
  };

  const addNotif = message => {
    if (document.querySelector('#notif')) {
      document.body.removeChild(document.querySelector('#notif'));
      clearTimeout(notifTimeout);
    }
    const notif = document.createElement('div');
    notif.id = 'notif';
    notif.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #313335; color: white; padding: 10px 20px;';
    notif.appendChild(document.createTextNode(message));
    document.body.appendChild(notif);
    notifTimeout = setTimeout(() => notif.remove(), 8000);
    return;
  };

  const removeCourse = event => {
    event.target.parentElement.parentElement.remove();
    return addNotif(`${event.target.parentElement.parentElement.childNodes[0].textContent} removed.`);
  };

  // planner table
  const createPlanner = () => {
    const planner = document.createElement('table');

    planner.classList.add('planner');
    document.getElementById('plannercontainer').appendChild(planner);

    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.appendChild(document.createElement('td'));

    quarters.forEach(c => {
      const colHead = document.createElement('th');
      colHead.classList.add('planner-col-head');
      colHead.scope = 'col';
      colHead.appendChild(document.createTextNode(c));
      headRow.appendChild(colHead);
    });

    head.classList.add('head-row');
    head.appendChild(headRow);
    planner.appendChild(head);

    years.forEach(r => {
      const row = document.createElement('tr');
      const rowHead = document.createElement('th');

      rowHead.classList.add('planner-row-head');
      rowHead.scope = 'row';
      rowHead.appendChild(document.createTextNode(r));
      row.appendChild(rowHead);

      for (let i = 0, l = quarters.length; i < l; i++) {
        const cell = document.createElement('td');
        cell.classList.add('planner-cell');
        row.appendChild(cell);
      }
      planner.appendChild(row);
    });
  };

  /*
  const updatePlanner = () => {
    document.querySelectorAll()
  };*/

  // set it all up
  createSearchDropdown();
  searchBar.addEventListener('keyup', updateSearchDropdown);
  createPlanner();
});
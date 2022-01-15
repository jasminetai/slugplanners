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
  const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
  const years = ['2020-2021', '2021-2022', '2022-2023', '2023-2024'];

  // search bar functionality
  const searchBar = document.getElementsByClassName('search-data')[0];

  const createSearchDropdown = () => {
    const searchDropdown = document.createElement('ul');

    searchDropdown.className = 'search-dropdown';
    document.getElementsByTagName('form')[0].insertBefore(searchDropdown, document.getElementsByClassName('search-data')[0].nextSibling);

    catalogCourses.forEach(category => {
      category.list.forEach(course => {
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
        infoUrl.appendChild(document.createTextNode('Catalog page'));

        infoAddButton.type = 'button';
        infoAddButton.classList.add('course-add-button');
        infoAddButton.appendChild(document.createTextNode('Add!'));
        infoAddButton.addEventListener('click', addCourse);

        info.classList.add('course-info');
        info.appendChild(infoUrl);
        info.appendChild(addMenu);
        info.appendChild(infoAddButton);

        // add the new course
        newCourse.classList.add('course-option');
        newCourse.info = info;
        newCourse.addEventListener('click', showCourseInfo);
        newCourse.appendChild(document.createTextNode(`${course.code} ${course.name}`));
        newCourse.appendChild(info);
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
    
    if (option.info) {
      option.info.style.display === 'block'
        ? option.info.style.display = 'none'
        : option.info.style.display = 'block';
    }
  };

  const addCourse = event => {
    const button = event.target;
    //console.log(button.parentNode.getElementById('quarter-select').selected);
    //console.log(button.parentNode.getElementById('year-select').selectedIndex);
  };

  // planner table
  const plannerContainer = document.getElementById('plannercontainer');

  const createPlanner = () => {
    const planner = document.createElement('table');

    planner.className = 'planner';
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

  // set it all up
  createSearchDropdown();
  searchBar.addEventListener('keyup', updateSearchDropdown);
  createPlanner();
});
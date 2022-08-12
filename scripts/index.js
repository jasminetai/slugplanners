const createSelect = (type, options) => {
  const selectMenu = document.createElement('select');
  selectMenu.classList.add(`${type}-select`);

  for (let i = 0, l = options.length; i < l; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.appendChild(document.createTextNode(options[i]));
    selectMenu.appendChild(option);
  }

  const initOption = document.createElement('option');
  initOption.value = '';
  initOption.disabled = true;
  initOption.hidden = true;
  initOption.selected = true;
  initOption.appendChild(document.createTextNode(`Select ${type}`));
  selectMenu.appendChild(initOption);

  return selectMenu;
};

const createAddMenu = (...selects) => {
  const addMenu = document.createElement('div');
  addMenu.classList.add('add-menu');

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('add-button');
  addButton.appendChild(document.createTextNode('Add!'));

  for (const select of selects) {
    addMenu.appendChild(createSelect(select.type, select.options));
  }
  
  addMenu.appendChild(addButton);
  return addMenu;
};

const createInfoContainer = course => {
  const container = document.createElement('div');

  const url = document.createElement('a');
  url.href = course.url;
  url.target = '_blank';
  url.appendChild(document.createTextNode('Catalog page'));

  const desc = document.createElement('div');
  desc.classList.add('course-desc');
  desc.appendChild(document.createTextNode(course.desc));

  container.classList.add('info-container');
  container.appendChild(url);
  container.appendChild(desc);

  const keyNames = {
    credits: 'Credits',
    reqs: 'Requirements',
    quarters: 'Quarters offered',
    ge: 'General Education',
    instructor: 'Instructors',
    repeatCredit: 'Repeatable for credit',
    crosslisted: 'Crosslisted as',
    crosslistedReqs: 'Crosslisted requirements'
  };

  for (const key in course) {
    if (!Object.keys(keyNames).includes(key)) continue;
    const field = document.createElement('div');
    field.classList.add('course-field');
    field.appendChild(document.createTextNode(keyNames[key] + ': ' + course[key]));
    container.appendChild(field);
  }

  return container;
};

const createSearchDropdown = (courses, quarters, years) => {
  const searchDropdown = document.createElement('ul');
  searchDropdown.classList.add('search-dropdown');

  const courseCodes = [];
  const courseList = [];
  courses.forEach(c => {
    if (courseCodes.indexOf(c.code) === -1) {
      courseList.push(c);
      courseCodes.push(c.code);
    }
  });

  courseList.forEach(course => {
    const newCourse = document.createElement('li');
    newCourse.course = course;
    newCourse.classList.add('course-option');
    newCourse.addEventListener('click', toggleInfoDisplay);
    newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));

    const infoContainer = createInfoContainer(course);
    infoContainer.appendChild(createAddMenu(
      { type: 'quarter', options: quarters },
      { type: 'year', options: years }
    ));
    newCourse.appendChild(infoContainer);

    searchDropdown.appendChild(newCourse);
  });

  return searchDropdown;
};

const updateSearchDropdown = (input, options) => {
  const oldMatches = Array.from(document.getElementsByClassName('course-option--match'));

  const matches = [];
  for (const option of options) {
    if (option.childNodes[0].textContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').includes(input)) {
      matches.push(option);
      if (matches.length === 10) break;
    }
  }

  if (oldMatches.length === matches.length && oldMatches.every((val, i) => val === matches[i])) return;

  for (const oldMatch of oldMatches) {
    oldMatch.classList.remove('course-option--match');
  }

  if (input.length < 3) return;

  for (const match of matches) {
    match.classList.add('course-option--match');
    match.querySelector('.info-container').style.display = 'none';
  }
};

const toggleInfoDisplay = event => {
  const infoContainer = event.target.querySelector('.info-container');
  if (!infoContainer) return;

  infoContainer.style.display = infoContainer.style.display === 'block'
    ? 'none'
    : 'block';
};

const addCourse = (event, plannerList) => {
  const quarter = event.target.parentElement.querySelector('.quarter-select').options.selectedIndex;
  const year = event.target.parentElement.querySelector('.year-select').options.selectedIndex;
  const course = event.target.closest('.course-option').course;

  if (quarter === '') return addNotif('Select a valid quarter!', '#bb0000');
  if (year === '') return addNotif('Select a valid year!', '#bb0000');

  const cell = plannerList[year][quarter];

  const newCourse = document.createElement('li');
  const infoContainer = createInfoContainer(course);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('course-remove-button');
  removeButton.addEventListener('click', () => {
    cell.splice(cell.indexOf(newCourse), 1);
    updatePlanner(plannerList);
    return addNotif(`${course.code}: ${course.name} removed.`, '#00bb00');
  });
  removeButton.appendChild(document.createTextNode(`Remove`));

  infoContainer.appendChild(removeButton);

  newCourse.classList.add('planner-course');
  newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));
  newCourse.appendChild(infoContainer);
  newCourse.addEventListener('click', toggleInfoDisplay);

  for (const prevAddedCourse of cell) {
    if (prevAddedCourse.textContent === newCourse.textContent) {
      return addNotif(`${course.code}: ${course.name} is already added!`, '#888');
    }
  }

  cell.push(newCourse);
  updatePlanner(plannerList);
  return addNotif(`${course.code}: ${course.name} added!`, '#00bb00');
};

const addNotif = (message, color) => {
  const oldNotif = document.querySelector('.notif');
  if (oldNotif) {
    clearTimeout(oldNotif.timeout);
    oldNotif.remove();
  }

  const notif = document.createElement('div');
  notif.classList.add('notif');
  notif.style.backgroundColor = color;
  notif.appendChild(document.createTextNode(message));

  document.body.appendChild(notif);
  notif.timeout = setTimeout(() => notif.remove(), 8000);
};

const updatePlanner = plannerList => {
  const years = document.querySelectorAll('.plan input');
  const quarterSections = document.querySelectorAll('.quarter-courses');

  for (let i = 0, l = years.length; i < l; i++) {
    if (years[i].checked) {
      for (let j = 0, ll = plannerList[i].length; j < ll; j++) {
        quarterSections[j].innerHTML = '';
        for (const k of plannerList[i][j]) {
          k.querySelector('.info-container').style.display = 'none';
          quarterSections[j].appendChild(k);
        }
      }
      break;
    }
  }
};

(async () => {
  // todo: custom choices of quarter/years. hardcoded for now
  const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
  const years = ['2021-2022', '2022-2023', '2023-2024', '2024-2025'];

  // plannerList is where we will keep info on selected courses
  const plannerList = [];
  for (let i = 0, l = years.length; i < l; i++) {
    plannerList.push([]);
    for (const j of quarters) {
      plannerList[i].push([]);
    }
  }
  
  const searchBar = document.querySelector('.search-data');
  const inputs = document.querySelectorAll('.plan input');
  const courses = await fetch("data/courses.json").then(d => d.json());
  const searchDropdown = createSearchDropdown(courses, quarters, years);

  document.getElementsByTagName('form')[0].insertBefore(searchDropdown, searchBar.nextSibling);

  document.querySelectorAll('.add-button').forEach(element => element.addEventListener('click', event => addCourse(event, plannerList)));

  updateSearchDropdown(searchBar.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''), document.getElementsByClassName('course-option'));

  for (let i = 0, l = inputs.length; i < l; i++) {
    inputs[i].addEventListener('click', () => updatePlanner(plannerList));
  }

  searchBar.addEventListener('keyup', () => updateSearchDropdown(searchBar.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''), document.getElementsByClassName('course-option')));

  Element.prototype.toggleClass = function(className) {
    this.classList.contains(className)
      ? this.classList.remove(className)
      : this.classList.add(className)
    return this;
  };

  document.querySelector('.menu-icon').addEventListener('click', function() {
    this.toggleClass('click');
    document.querySelector('.sidebar').toggleClass('show');
  });
  document.querySelector('.class-btn').addEventListener('click', function() {
    document.querySelector('nav ul .class-show').toggleClass('show');
    document.querySelector('nav ul .first').toggleClass('rotate');
  });
  document.querySelector('.res-btn').addEventListener('click', function() {
    document.querySelector('nav ul .res-show').toggleClass('show2');
    document.querySelector('nav ul .first').toggleClass('rotate');
  });
  document.querySelector('nav ul li').addEventListener('click', function() {
    document.querySelectorAll('nav ul li').forEach(element => element.classList.remove('active'))
    this.classList.add('active');
  });
})();

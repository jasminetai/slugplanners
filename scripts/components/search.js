import { lowerAlphanumerize } from '../utils.js';

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

const createCourseInfo = course => {
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

const createCourseDropdown = (courses, quarters, years) => {
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

    const infoContainer = createCourseInfo(course);
    infoContainer.appendChild(createAddMenu(
      { type: 'quarter', options: quarters },
      { type: 'year', options: years }
    ));
    newCourse.appendChild(infoContainer);

    searchDropdown.appendChild(newCourse);
  });

  return searchDropdown;
};

const createMmInfo = mm => {
  const container = document.createElement('div');

  const url = document.createElement('a');
  url.href = mm.url;
  url.target = '_blank';
  url.appendChild(document.createTextNode('Catalog page'));

  container.classList.add('info-container');
  container.appendChild(url);

  return container;
};

const createMmDropdown = majorsMinors => {
  const searchDropdown = document.createElement('ul');
  searchDropdown.classList.add('search-dropdown');

  majorsMinors.forEach(mm => {
    const newMm = document.createElement('li');
    newMm.classList.add('course-option');
    newMm.addEventListener('click', toggleInfoDisplay);
    newMm.appendChild(document.createTextNode(mm.name));

    const infoContainer = createMmInfo(mm);
    newMm.appendChild(infoContainer);

    searchDropdown.appendChild(newMm);
  });

  return searchDropdown;
};

const updateDropdown = (input, options) => {
  const oldMatches = Array.from(document.getElementsByClassName('course-option--match'));
  const matches = [];
  for (const option of options) {
    if (lowerAlphanumerize(option.childNodes[0].textContent).includes(input)) {
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

export {
  createSelect,
  createAddMenu,
  createCourseInfo,
  createCourseDropdown,
  createMmInfo,
  createMmDropdown,
  updateDropdown,
  toggleInfoDisplay
};

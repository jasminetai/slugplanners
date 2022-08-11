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

let selectedPlannerList = 0;
let notifTimeout;
let prevCourseOption;

const searchBar = document.getElementsByClassName('search-data')[0];

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

const createAddMenu = () => {
  const addMenu = document.createElement('div');
  addMenu.classList.add('add-menu');
  
  const quarterSelect = createSelect('quarter', quarters);
  const yearSelect = createSelect('year', years);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('course-add-button');
  addButton.appendChild(document.createTextNode('Add!'));
  addButton.addEventListener('click', addCourse);
  
  addMenu.appendChild(quarterSelect);
  addMenu.appendChild(yearSelect);
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

  container.classList.add('course-info');
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

const createSearchDropdown = courses => {
  const searchDropdown = document.createElement('ul');
  searchDropdown.classList.add('search-dropdown');
  document.getElementsByTagName('form')[0].insertBefore(searchDropdown, searchBar.nextSibling);

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
    newCourse.addEventListener('click', showCourseInfo);
    newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));

    const infoContainer = createInfoContainer(course);
    infoContainer.appendChild(createAddMenu());
    newCourse.appendChild(infoContainer);

    searchDropdown.appendChild(newCourse);
  });

  updateSearchDropdown();
};

const updateSearchDropdown = () => {
  const input = searchBar.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

  const oldMatches = document.getElementsByClassName('course-option--match');
  for (let i = oldMatches.length - 1; i >= 0; i--) {
    oldMatches[i].classList.remove('course-option--match');
  }

  if (input.length < 3) return;

  const options = document.getElementsByClassName('course-option');
  let numShown = 0;

  for (const option of options) {
    if (option.childNodes[0].textContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').includes(input)) {
      option.classList.add('course-option--match');
      option.getElementsByClassName('course-info')[0].style.display = 'none';
      if (++numShown === 10) break;
    }
  }
};

const showCourseInfo = event => {
  const option = event.target.getElementsByClassName('course-info')[0];

  if (option) {
    if (option.style.display === 'block') {
      option.style.display = 'none';
    } else {
      option.style.display = 'block';
      if (prevCourseOption && prevCourseOption !== option) {
        prevCourseOption.style.display = 'none';
      }
      prevCourseOption = option;
    }
  }
};

const addCourse = event => {
  const quarter = event.target.parentElement.querySelector('.quarter-select').options.selectedIndex;
  const year = event.target.parentElement.querySelector('.year-select').options.selectedIndex;
  const course = event.target.closest('.course-option').course;

  if (![0, 1, 2, 3].includes(quarter)) return addNotif('Select a valid quarter!', '#bb0000');
  if (![0, 1, 2, 3].includes(year)) return addNotif('Select a valid year!', '#bb0000');

  const cell = plannerList[year][quarter];

  const newCourse = document.createElement('li');
  const infoContainer = createInfoContainer(course);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('course-remove-button');
  removeButton.addEventListener('click', () => {
    cell.splice(cell.indexOf(newCourse), 1);
    updatePlanner();
    return addNotif(`${course.code}: ${course.name} removed.`, '#00bb00');
  });
  removeButton.appendChild(document.createTextNode(`Remove`));

  infoContainer.style.display = 'none';
  infoContainer.appendChild(removeButton);

  newCourse.classList.add('planner-course');
  newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));
  newCourse.appendChild(infoContainer);
  newCourse.addEventListener('click', showCourseInfo);

  for (const prevAddedCourse of cell) {
    if (prevAddedCourse.textContent === newCourse.textContent) {
      return addNotif(`${course.code}: ${course.name} is already added!`, '#888');
    }
  }

  cell.push(newCourse);
  updatePlanner();
  return addNotif(`${course.code}: ${course.name} added!`, '#00bb00');
};

const addNotif = (message, color) => {
  if (document.querySelector('.notif')) {
    document.body.removeChild(document.querySelector('.notif'));
    clearTimeout(notifTimeout);
  }

  const notif = document.createElement('div');
  notif.classList.add('notif');
  notif.style.backgroundColor = color;
  notif.appendChild(document.createTextNode(message));

  document.body.appendChild(notif);
  notifTimeout = setTimeout(() => notif.remove(), 8000);
};

const updatePlanner = () => {
  const years = document.querySelectorAll('.plan input');
  const quarterSections = document.querySelectorAll('.quarter-courses');

  for (let i = 0, l = years.length; i < l; i++) {
    if (years[i].checked) {
      selectedPlannerList = i;
      for (let j = 0, ll = plannerList[i].length; j < ll; j++) {
        quarterSections[j].innerHTML = '';
        for (k of plannerList[i][j]) {
          quarterSections[j].appendChild(k);
        }
      }
      return;
    }
  }
};

(async () => {
  const courses = await fetch("data/courses.json").then(d => d.json());
  createSearchDropdown(courses);
})();

const inputs = document.querySelectorAll('.plan input');
for (let i = 0, l = inputs.length; i < l; i++) {
  inputs[i].addEventListener('click', updatePlanner);
}

searchBar.addEventListener('keyup', updateSearchDropdown);

Element.prototype.toggleClass = function(className) {
  this.classList.contains(className)
    ? this.classList.remove(className)
    : this.classList.add(className)
  return this;
};

document.querySelector('.menu-icon').onclick = function() {
  this.toggleClass('click');
  document.querySelector('.sidebar').toggleClass('show');
}
document.querySelector('.class-btn').onclick = function() {
  document.querySelector('nav ul .class-show').toggleClass('show');
  document.querySelector('nav ul .first').toggleClass('rotate');
}
document.querySelector('.res-btn').onclick = function() {
  document.querySelector('nav ul .res-show').toggleClass('show2');
  document.querySelector('nav ul .first').toggleClass('rotate');
}
document.querySelector('nav ul li').onclick = function() {
  document.querySelectorAll('nav ul li').forEach(element => element.classList.remove('active'))
  this.classList.add('active');
}

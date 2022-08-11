const quarters = ['Fall', 'Winter', 'Spring', 'Summer'];
const years = ['2021-2022', '2022-2023', '2023-2024', '2024-2025'];

const plannerList = [
  [[],[],[],[]],
  [[],[],[],[]],
  [[],[],[],[]],
  [[],[],[],[]]
];
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

const createInfoContainer = course => {
  const container = document.createElement('div');

  const url = document.createElement('a');
  url.href = course.url;
  url.target = '_blank';
  url.appendChild(document.createTextNode('Catalog page'));

  const desc = document.createElement('div');
  desc.classList.add('course-desc');
  desc.appendChild(document.createTextNode(course.desc));

  const addMenu = document.createElement('div');
  addMenu.classList.add('add-menu');
  const quarterSelect = createSelect('quarter', quarters);
  const yearSelect = createSelect('year', years);
  addMenu.appendChild(quarterSelect);
  addMenu.appendChild(yearSelect);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('course-add-button');
  addButton.appendChild(document.createTextNode('Add!'));
  addButton.addEventListener('click', addCourse);

  container.classList.add('course-info');
  container.appendChild(url);
  container.appendChild(desc);
  container.appendChild(addMenu);
  container.appendChild(addButton);

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
    newCourse.appendChild(infoContainer);

    searchDropdown.appendChild(newCourse);
  });

  updateSearchDropdown();
};

const updateSearchDropdown = () => {
  const input = searchBar.value.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const options = document.getElementsByClassName('course-option');
  const l = options.length;

  const activeOptions = document.getElementsByClassName('course-option--active');
  for (let i = activeOptions.length; i > 0; i--) {
    activeOptions[i - 1].classList.remove('course-option--active');
  }

  if (input.length < 3) return;

  let numShown = 0;
  let i = 0;

  while (numShown < 10 && i < l) {
    const option = options[i];
    if (option.childNodes[0].textContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').includes(input)) {
      option.classList.add('course-option--active');
      option.getElementsByClassName('course-info')[0].style.display = 'none';
      numShown++;
    }
    i++;
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

// add and remove courses from planner
const addCourse = event => {
  const quarter = event.target.parentElement.querySelector('.quarter-select').options.selectedIndex;
  const year = event.target.parentElement.querySelector('.year-select').options.selectedIndex;
  const course = event.target.parentElement.parentElement.course;

  if ([0, 1, 2, 3].includes(quarter) && [0, 1, 2, 3].includes(year)) {
    const cell = plannerList[year][quarter];

    const newCourse = document.createElement('li');
    const info = document.createElement('div');
    const url = document.createElement('a');
    const removeButton = document.createElement('button');

    url.href = course.url;
    url.target = '_blank';
    url.appendChild(document.createTextNode('Catalog'));

    removeButton.type = 'button';
    removeButton.classList.add('course-remove-button');
    removeButton.addEventListener('click', () => {
      cell.splice(cell.indexOf(newCourse), 1);
      updatePlanner();
      return addNotif(`${course.code}: ${course.name} removed.`);
    });
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

    for (let i = 0, l = cell.length; i < l; i++) {
      if (cell[i].textContent === newCourse.textContent) {
        return addNotif(`${course.code}: ${course.name} is already added!`);
      }
    }

    cell.push(newCourse);
    updatePlanner();
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

const updatePlanner = () => {
  const years = document.querySelectorAll('.plan input');
  const quarterSections = document.querySelectorAll('.section-courses');
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

// set it all up
(async () => {
  const courses = await fetch("data/courses.json");
  createSearchDropdown(await courses.json());
})();

const inputs = document.querySelectorAll('.plan input');
for (let i = 0, l = inputs.length; i < l; i++) {
  inputs[i].addEventListener('click', updatePlanner);
}
searchBar.addEventListener('keyup', updateSearchDropdown);

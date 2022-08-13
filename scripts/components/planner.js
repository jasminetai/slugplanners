import { createCourseInfo, toggleInfoDisplay } from './search.js';

const addCourse = (event, plannerList) => {
  const quarter = event.target.parentElement.querySelector('.quarter-select').options.selectedIndex;
  const year = event.target.parentElement.querySelector('.year-select').options.selectedIndex;
  const course = event.target.closest('.course-option').course;

  if (quarter === '') return addNotif('error', 'Select a valid quarter!');
  if (year === '') return addNotif('error', 'Select a valid year!');

  const cell = plannerList[year][quarter];

  const newCourse = document.createElement('li');
  const infoContainer = createCourseInfo(course);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('course-remove-button');
  removeButton.addEventListener('click', () => {
    cell.splice(cell.indexOf(newCourse), 1);
    updatePlanner(plannerList);
    return addNotif('success', `${course.code}: ${course.name} removed.`);
  });
  removeButton.appendChild(document.createTextNode(`Remove`));

  infoContainer.appendChild(removeButton);

  newCourse.classList.add('planner-course');
  newCourse.appendChild(document.createTextNode(`${course.code}: ${course.name}`));
  newCourse.appendChild(infoContainer);
  newCourse.addEventListener('click', toggleInfoDisplay);

  for (const prevAddedCourse of cell) {
    if (prevAddedCourse.textContent === newCourse.textContent) {
      return addNotif('default', `${course.code}: ${course.name} is already added!`);
    }
  }

  cell.push(newCourse);
  updatePlanner(plannerList);
  return addNotif('success', `${course.code}: ${course.name} added!`);
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

const addNotif = (type, message) => {
  const oldNotif = document.querySelector('.notif');
  if (oldNotif) {
    clearTimeout(oldNotif.timeout);
    oldNotif.remove();
  }

  const colors = {
    default: '#888',
    error: '#bb0000',
    success: '#00bb00'
  };

  const notif = document.createElement('div');
  notif.classList.add('notif');
  notif.style.backgroundColor = colors[type];
  notif.appendChild(document.createTextNode(message));

  document.body.appendChild(notif);
  notif.timeout = setTimeout(() => notif.remove(), 8000);
};

export {
  addCourse,
  updatePlanner,
  addNotif
};

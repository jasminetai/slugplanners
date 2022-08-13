import * as Search from './components/search.js';
import * as Planner from './components/planner.js';
import './components/sidebar.js';
import { lowerAlphanumerize } from './utils.js';

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
  
  const searchInput = document.querySelector('.search-data');
  const inputs = document.querySelectorAll('.plan input');
  const courses = await fetch("data/courses.json").then(d => d.json());
  const searchDropdown = Search.createCourseDropdown(courses, quarters, years);

  document.querySelector('.search-bar').insertBefore(searchDropdown, searchInput.nextSibling);
  document.querySelectorAll('.add-button')
    .forEach(element => element.addEventListener('click', event => Planner.addCourse(event, plannerList)));

  Search.updateDropdown(lowerAlphanumerize(searchInput.value), document.getElementsByClassName('course-option'));

  for (const input of inputs) {
    input.addEventListener('click', () => Planner.updatePlanner(plannerList));
  }

  searchInput.addEventListener('keyup', () => Search.updateDropdown(lowerAlphanumerize(searchInput.value), document.getElementsByClassName('course-option')));
})();

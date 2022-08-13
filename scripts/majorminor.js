import * as Search from './components/search.js';
import './components/sidebar.js';
import { lowerAlphanumerize } from './utils.js';

(async () => {
  const searchInput = document.querySelector('.search-data');
  const majors = await fetch("data/majors.json").then(d => d.json());
  const minors = await fetch("data/minors.json").then(d => d.json());
  const searchDropdown = Search.createMmDropdown(majors.concat(minors));

  document.querySelector('.search-bar').insertBefore(searchDropdown, searchInput.nextSibling);

  Search.updateDropdown(lowerAlphanumerize(searchInput.value), document.getElementsByClassName('course-option'));

  searchInput.addEventListener('keyup', () => Search.updateDropdown(lowerAlphanumerize(searchInput.value), document.getElementsByClassName('course-option')));
})();

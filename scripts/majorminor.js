(async () => {
  const majors = await fetch("data/majors.json").then(d => d.json());
  const minors = await fetch("data/minors.json").then(d => d.json());
  createSearchDropdown(majors.concat(minors));
})();

let prevMajorMinorInfo;

const searchBar = document.getElementsByClassName('search-data')[0];

const createSearchDropdown = majors => {
  const searchDropdown = document.createElement('ul');

  searchDropdown.classList.add('search-dropdown');
  document.getElementsByTagName('form')[0].insertBefore(searchDropdown, document.getElementsByClassName('search-data')[0].nextSibling);

  majors.forEach(major => {
    const newMajor = document.createElement('li');

    // info stuff
    const info = document.createElement('div');
    const infoUrl = document.createElement('a');

    infoUrl.href = major.url;
    infoUrl.target = '_blank';
    infoUrl.appendChild(document.createTextNode('Catalog'));

    info.classList.add('info-container');
    info.major = major;
    info.appendChild(infoUrl);

    // add the major
    newMajor.classList.add('course-option');
    newMajor.info = info;
    newMajor.addEventListener('click', showMajorMinorInfo);
    newMajor.appendChild(document.createTextNode(major.name));
    newMajor.appendChild(info);
    searchDropdown.appendChild(newMajor);
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
    if (option.textContent.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").includes(input)) {
      option.style.display = 'list-item';
      option.getElementsByClassName('info-container')[0].style.display = 'none';
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

const showMajorMinorInfo = event => {
  const option = event.target;

  if (option.info) {
    if (option.info.style.display === 'block') {
      option.info.style.display = 'none';
    } else {
      option.info.style.display = 'block';
      if (prevMajorMinorInfo && prevMajorMinorInfo !== option.info) {
        prevMajorMinorInfo.style.display = 'none';
      }
      prevMajorMinorInfo = option.info;
    }
  }
};

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

const fetchData = async () => {
  const [catalogMajors, catalogMinors] = await Promise.all([
    fetch("scripts/catalogmajors.json").then(response => response.json()).catch(e => console.log(e)),
    fetch("scripts/catalogminors.json").then(response => response.json()).catch(e => console.log(e)),
    //fetch("scripts/catalogcourses.json").then(response => response.json()).catch(e => console.log(e)),
    //fetch("scripts/slugshort.json").then(response => response.json()).catch(e => console.log(e)),
    //fetch("scripts/sluglong.json").then(response => response.json()).catch(e => console.log(e))
  ]).catch(e => console.log(e));
  return [catalogMajors, catalogMinors];
};

fetchData().then((data) => {
  //const [catalogMajors, catalogCourses, slugShort, slugLong] = data;
  const [catalogMajors, catalogMinors] = data;
  let prevMajorMinorInfo;

  // search bar
  const searchBar = document.getElementsByClassName('search-data')[0];

  const createSearchDropdown = () => {
    const searchDropdown = document.createElement('ul');

    searchDropdown.classList.add('search-dropdown');
    document.getElementsByTagName('form')[0].insertBefore(searchDropdown, document.getElementsByClassName('search-data')[0].nextSibling);

    catalogMajors.forEach(major => {
      const newMajor = document.createElement('li');

      // info stuff
      const info = document.createElement('div');
      const infoUrl = document.createElement('a');

      infoUrl.href = major.url;
      infoUrl.target = '_blank';
      infoUrl.appendChild(document.createTextNode('Catalog'));

      info.classList.add('course-info');
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

    catalogMinors.forEach(minor => {
      const newMinor = document.createElement('li');

      // info stuff
      const info = document.createElement('div');
      const infoUrl = document.createElement('a');

      infoUrl.href = minor.url;
      infoUrl.target = '_blank';
      infoUrl.appendChild(document.createTextNode('Catalog'));

      info.classList.add('course-info');
      info.minor = minor;
      info.appendChild(infoUrl);

      // add the major
      newMinor.classList.add('course-option');
      newMinor.info = info;
      newMinor.addEventListener('click', showMajorMinorInfo);
      newMinor.appendChild(document.createTextNode(minor.name));
      newMinor.appendChild(info);
      searchDropdown.appendChild(newMinor);
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

  // set it all up
  createSearchDropdown();
  searchBar.addEventListener('keyup', updateSearchDropdown);
});
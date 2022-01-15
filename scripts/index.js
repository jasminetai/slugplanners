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
  
  /*const filterSearch = () => {
    const searchQuery = document.getElementById('search');
  };*/
});
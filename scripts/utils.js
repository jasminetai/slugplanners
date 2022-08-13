const lowerAlphanumerize = str => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

const toggleClass = (element, className) => {
  element.classList.contains(className)
    ? element.classList.remove(className)
    : element.classList.add(className)
  return element;
};

export {
  lowerAlphanumerize,
  toggleClass
};

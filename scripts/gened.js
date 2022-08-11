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
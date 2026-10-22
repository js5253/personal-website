const element = document.querySelectorAll('.grid-i-outer.grid-i-selectable');
const mainElement = document.querySelector('main');

element.forEach(elem => elem.addEventListener('mouseenter', () => {
  elem.querySelector('.grid-i-slide').classList.toggle('hidden');
}));


element.forEach(elem => elem.addEventListener('mouseleave', () => {
  elem.querySelector('.grid-i-slide').classList.toggle('hidden');
}));



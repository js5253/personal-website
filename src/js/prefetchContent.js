const mainElement = document.querySelector('main');
const navLinks = document.querySelectorAll('nav a');
const content = new Map();

const prefetchContent = async () => {
  let links = await fetch('/api/pages.json');
  links = await links.json();

  for (let link of links) {
    const name = link.name;
    link = await fetch(link.url);
    link = await link.text();

    content.set(name, link);
    console.log(link)
  }

}

(prefetchContent())


navLinks.forEach(link => link.addEventListener('click', (e) => {
  e.preventDefault();
  mainElement.classList.toggle('fadeOut');
  let c = content.get(link.dataset.name);

  mainElement.innerHTML = c;

}));

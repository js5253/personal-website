window.addEventListener('load', () => {
    const darkModeToggle = document.querySelector('#theme-selector');
    const body = document.querySelector('body');
    let darkMode = localStorage.getItem('dark');

    const toggleDarkMode = () => {
        darkModeToggle.classList.toggle('dark-mode-active')
        body.classList.toggle('dark')
        darkMode ? localStorage.setItem('dark', "true") : localStorage.removeItem('dark');

    }
    if (darkMode) {
        toggleDarkMode()
    }

    darkModeToggle.addEventListener('click', (e) => {
        e.preventDefault()
        darkMode = !darkMode;
        toggleDarkMode()
    })

})


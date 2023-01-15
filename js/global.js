const header = document.getElementsByClassName("header")[0];

document.addEventListener("scroll", (e) => {
    const scrollPos = window.scrollY;

    if (scrollPos > 15) {
        header.classList.add("openHeader")
    } else {
        header.classList.remove("openHeader")
    }
})
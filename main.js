"use strict";

// Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  //console.log("window.scrollY:" + window.scrollY);
  //console.log("navbarHeight:" + navbarHeight);
  console.log(`navbarHeight: ${navbarHeight}`);
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
  // bug navbar is below the images
  // #navbar에 z-index: 1 추가
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  //console.log(event.target);
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  //console.log(event.target.dataset.link); // html파일에서 data-link를 불러옴
  scrollIntoView(link);
});

// Handle click on "contact me" button on Home
const homeContactBtn = document.querySelector(".home__contact");
homeContactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector(".home__container");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  //console.log(homeHeight);
  //console.log(1 - window.scrollY / homeHeight);
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

// Projects
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", (e) => {
  //const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  const filter = e.target.dataset.filter; // 이렇게 필터하면 버튼안에 스팬이 클릭되면 감지되지 않음 이상함...
  if (filter == null) {
    return;
  }
  //console.log(filter);
  projectContainer.classList.add("anim-out");

  //setTimeout은 브라우저의 api, 0.3초 후 발동
  setTimeout(() => {
    projects.forEach((project) => {
      //console.log(project.dataset.type);

      if (filter == "*" || filter == project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
    projectContainer.classList.remove("anim-out");
  }, 300);

  // 1번 2번 3번 방법은 모두 같다.
  // // 1번 방법
  // projects.forEach((project) => {
  //   console.log(project);
  // });

  // console.log("--------------------");

  // // 2번 방법
  // for (let project of projects) {
  //   console.log(project);
  // }

  // console.log("--------------------");

  // // 3번 방법
  // let project;
  // for (let i = 0; i < projects.length; i++) {
  //   project = projects[i];
  //   console.log(project);
  // }
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
}

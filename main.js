"use strict";

// Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  //console.log("window.scrollY:" + window.scrollY);
  //console.log("navbarHeight:" + navbarHeight);
  //console.log(`navbarHeight: ${navbarHeight}`);
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
  navbarMenu.classList.remove("open");
  //console.log(event.target.dataset.link); // html파일에서 data-link를 불러옴
  scrollIntoView(link);
  selectNavItem(target);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
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
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  //const filter = e.target.dataset.filter; // 이렇게 필터하면 버튼안에 스팬이 클릭되면 감지되지 않음 이상함...
  if (filter == null) {
    return;
  }
  //console.log(filter);

  // Remove selection from the previsous item and select the new one.about__majors
  const active = document.querySelector(".category__btn.selected");
  if (active != null) {
    active.classList.remove("selected");
  }
  // 번호가 담긴 스팬이 클릭될 수 있기에 타겟 확인
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  e.target.classList.add("selected");

  projectContainer.classList.add("anim-out");

  //setTimeout은 브라우저의 api, 0.3초 후 발동
  setTimeout(() => {
    projects.forEach((project) => {
      //console.log(project.dataset.type);

      if (filter === "*" || filter === project.dataset.type) {
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

// 1. 모든 섹션 요소들ㅇ르 가지고 온다.
//2. iNTErsectionObsever를 이용해서 모든 섹션들을 관찰한다
//3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화시킨다

// 1
const sectionIds = [
  "#home",
  "#about",
  "#skills",
  "#work",
  "#testimonials",
  "#contact",
];
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);
//console.log(sections);
//console.log(navItems);

// 2
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    //console.log(entry.target);
    // 엔트리가 빠져나가는 경우
    // 초기 홈은 intersectionRatio가 1이다, 1이면 다 보이는 것
    // intersedtionRatio가 0보다 클 때를 안 넣으면
    // 교차되지않는 엔트리

    // 엔트리가 안보이는가? (화면에서 아예 사라진 경우)
    // 예외 발생 home이나 contact는?
    // home은 about에서 위로 올라갈 때 about이 다 안 사라짐
    // contact는 testimonials에서 내려갈 때 testimonials가 다 안 사라짐
    // entry.intersectionRatio > 0 조건이 없다면
    // testimonials는 조건을 통과
    //
    if (!entry.isIntersecting) {
      console.log(entry.target.id); // 보이지 않는 엔트리는 홈을 제외한 것. 하지만 어떻게 about이 안보인다는 거지?
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      //console.log(index, entry.target.id);

      // 스크롤링이 아래로 되어서 페이지가 올라오는 경우
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
        console.log("인덱스 증가 현재 액티브 순서" + selectedNavIndex);
      } else {
        selectedNavIndex = index - 1;
        console.log("인덱스 감소 현재 액티브 순서" + selectedNavIndex);
      }
      if (selectedNavIndex == 0) {
        console.log("홈이 액티브");
      }
      if (selectedNavIndex == 1) {
        console.log("어바웃이 액티브");
      }
      if (selectedNavIndex == 2) {
        console.log("스킬 액티브");
      }
      if (selectedNavIndex == 3) {
        console.log("워크 액티브");
      }
      if (selectedNavIndex == 4) {
        console.log("테스티모니얼 액티브");
      }
      if (selectedNavIndex == 5) {
        console.log("컨택트이 액티브");
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

// wheel과 scroll의 차이
// wheel은 사용자가 직접 스크롤할 때
// scroll은 브라우저 스크롤이 움직일 때
window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

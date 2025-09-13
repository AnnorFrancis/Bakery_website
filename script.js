// Duke's Sweet Bakery interactions
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile nav
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const open = navMenu.style.display === "flex";
    navMenu.style.display = open ? "none" : "flex";
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(!open));
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.innerWidth < 720 && navMenu) {
        navMenu.style.display = "none";
        hamburger.classList.remove("active");
      }
    }
  });
});

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

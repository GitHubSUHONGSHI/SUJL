(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const copyButtons = Array.from(document.querySelectorAll("[data-copy]"));
  const copyFeedback = document.querySelector("[data-copy-feedback]");
  const resumeLinks = Array.from(document.querySelectorAll("[data-resume-link]"));
  const resumeStatus = document.querySelector("[data-resume-status]");

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        if (copyFeedback) {
          copyFeedback.textContent = "已复制到剪贴板";
        }
      } catch (error) {
        if (copyFeedback) {
          copyFeedback.textContent = `请手动复制：${value}`;
        }
      }
    });
  });

  resumeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (resumeStatus) {
        resumeStatus.textContent = "正在尝试下载 assets/resume.pdf；如无文件，请先放置真实 PDF 简历。";
      }
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();

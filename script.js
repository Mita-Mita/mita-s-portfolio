const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Gentle scroll reveal, with a reduced-motion fallback.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('in-view'));
}

// Hero role rotation.
const roles = ['WordPress Developer', 'Web Developer', 'Responsive UI Builder'];
const roleEl = document.getElementById('typedRole');
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = false;
function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) {
      deleting = true;
      setTimeout(typeRole, 1600);
      return;
    }
  } else {
    charIndex--;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 42 : 75);
}
setTimeout(() => { deleting = true; typeRole(); }, 1900);

// Project filtering and show-more.
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  projectCards.forEach(card => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !matches);
    if (matches && card.classList.contains('extra-project') && document.getElementById('showMore').dataset.expanded !== 'true' && filter === 'all') {
      card.classList.remove('show');
    }
  });
  if (filter !== 'all') {
    document.querySelectorAll('.extra-project').forEach(card => {
      if (card.dataset.category === filter) card.classList.add('show');
    });
  } else if (document.getElementById('showMore').dataset.expanded !== 'true') {
    document.querySelectorAll('.extra-project').forEach(card => card.classList.remove('show'));
  }
}));
const showMore = document.getElementById('showMore');
showMore.addEventListener('click', () => {
  const expanded = showMore.dataset.expanded !== 'true';
  showMore.dataset.expanded = String(expanded);
  document.querySelectorAll('.extra-project').forEach(card => {
    card.classList.toggle('show', expanded);
    card.classList.remove('hidden');
  });
  showMore.innerHTML = expanded ? 'Show fewer projects <span>↑</span>' : 'Show more projects <span>↓</span>';
  if (!expanded) {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    document.querySelectorAll('.extra-project').forEach(card => {
      card.classList.toggle('hidden', activeFilter !== 'all' && card.dataset.category !== activeFilter);
    });
  }
});

// Copy email.
document.getElementById('copyEmail').addEventListener('click', async () => {
  const email = 'marjiamitabubt@gmail.com';
  const feedback = document.getElementById('copyFeedback');
  try {
    await navigator.clipboard.writeText(email);
    feedback.textContent = 'Email address copied!';
  } catch {
    feedback.textContent = email;
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

// Reading progress and active nav section.
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('scrollProgress').style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
}, { passive: true });
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

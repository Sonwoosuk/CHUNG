document.addEventListener('DOMContentLoaded', function () {

  /* --- 헤더 스크롤 --- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* --- TOP 버튼 --- */
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    const footer = document.querySelector('.footer');
    if (!footer || !topBtn) return;
    topBtn.classList.toggle('is-visible', footer.getBoundingClientRect().top <= window.innerHeight);
  }, { passive: true });
  topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- 햄버거 --- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const megaMenu     = document.getElementById('megaMenu');
  hamburgerBtn?.addEventListener('click', () => {
    const isActive = hamburgerBtn.classList.toggle('is-active');
    hamburgerBtn.setAttribute('aria-expanded', isActive);
    megaMenu.classList.toggle('is-open', isActive);
    megaMenu.setAttribute('aria-hidden', !isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && megaMenu.classList.contains('is-open')) {
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', false);
      megaMenu.classList.remove('is-open');
      megaMenu.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }
  });

  /* --- GNB 드롭다운 --- */
  const gnbItems = document.querySelectorAll('.gnb__item');
  gnbItems.forEach(item => {
    const link = item.querySelector('.gnb__link');
    link?.addEventListener('click', (e) => {
      if (!item.querySelector('.gnb__dropdown')) return;
      e.preventDefault();
      const isOpen = item.classList.contains('is-open');
      gnbItems.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__gnb')) gnbItems.forEach(i => i.classList.remove('is-open'));
  });

  /* --- 패밀리사이트 --- */
  const familyBtn  = document.getElementById('footerFamilyBtn');
  const familyWrap = document.getElementById('footerFamily');
  familyBtn?.addEventListener('click', () => {
    const isOpen = familyWrap.classList.toggle('is-open');
    familyBtn.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#footerFamily')) {
      familyWrap?.classList.remove('is-open');
      familyBtn?.setAttribute('aria-expanded', false);
    }
  });

  /* --- 구글 번역 --- */
  window.doTranslate = function(lang) {
    if (!lang) return;
    window.open('https://translate.google.com/translate?sl=ko&tl=' + lang + '&u=' + encodeURIComponent(location.href), '_blank');
  };

  /* --- 서브 네비 슬라이딩 --- */
  const subNavWrap   = document.querySelector('.page-sub-nav__wrap');
  const subNavSlider = document.getElementById('subNavSlider');
  const subNavLinks  = subNavWrap ? subNavWrap.querySelectorAll('.page-sub-nav__link') : [];

  if (subNavSlider && subNavLinks.length) {
    function moveSlider(el) {
      subNavSlider.style.left  = el.offsetLeft + 'px';
      subNavSlider.style.width = el.offsetWidth + 'px';
    }
    function setWhiteText(targetEl) {
      subNavLinks.forEach(l => l.style.color = '');
      if (targetEl) targetEl.style.color = '#ffffff';
    }
    const active = subNavWrap.querySelector('.page-sub-nav__link--active');
    if (active) setTimeout(() => { moveSlider(active); setWhiteText(active); }, 50);
    subNavLinks.forEach(link => {
      link.addEventListener('mouseenter', () => { moveSlider(link); setWhiteText(link); });
    });
    subNavWrap.addEventListener('mouseleave', () => {
      const cur = subNavWrap.querySelector('.page-sub-nav__link--active');
      if (cur) { moveSlider(cur); setWhiteText(cur); }
    });
  }

  /* --- 이미지 슬라이더 (자동재생) --- */
  const track   = document.getElementById('contentTrack');
  const prevBtn = document.getElementById('contentPrev');
  const nextBtn = document.getElementById('contentNext');
  if (track) {
    const total = track.children.length;
    let idx = 0, autoTimer = null;

    function goTo(n) {
      idx = (n + total) % total;
      track.style.transform = `translateX(-${idx * 100}%)`;
    }
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(idx + 1), 4000);
    }
    prevBtn?.addEventListener('click', () => { goTo(idx - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(idx + 1); startAuto(); });
    goTo(0);
    startAuto();
  }

  /* --- 페이지 애니메이션 --- */
  const animEls = Array.from(document.querySelectorAll('[data-anim]'));
  const viewH   = window.innerHeight;

  animEls
    .filter(el => el.getBoundingClientRect().top < viewH)
    .forEach((el, i) => {
      el.style.animationDelay = (i * 0.13) + 's';
      el.classList.add('is-shown');
    });

  const scrollEls = animEls.filter(el => el.getBoundingClientRect().top >= viewH);
  if (scrollEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = '0s';
          entry.target.classList.add('is-shown');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    scrollEls.forEach(el => io.observe(el));
  }

}); // DOMContentLoaded end
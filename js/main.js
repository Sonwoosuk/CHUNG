/* main.js — 충남문화관광재단 */

document.addEventListener('DOMContentLoaded', function () {

  /* --- 1. 헤더 스크롤 --- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* --- 2. TOP 버튼 --- */
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    const footer = document.querySelector('.footer');
    if (!footer || !topBtn) return;
    topBtn.classList.toggle('is-visible', footer.getBoundingClientRect().top <= window.innerHeight);
  }, { passive: true });
  topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- 3. GNB 드롭다운 --- */
  const gnbItems = document.querySelectorAll('.gnb__item');
  gnbItems.forEach(item => {
    const link = item.querySelector('.gnb__link');
    link?.addEventListener('click', (e) => {
      if (!item.querySelector('.gnb__dropdown')) return;
      // 실제 링크(#가 아닌)면 그대로 이동
      const href = link.getAttribute('href');
      if (href && href !== '#') return;
      e.preventDefault();
      const isOpen = item.classList.contains('is-open');
      gnbItems.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__gnb')) gnbItems.forEach(i => i.classList.remove('is-open'));
  });

  /* --- 4. 햄버거 메가메뉴 --- */
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
    if (e.key === 'Escape' && megaMenu?.classList.contains('is-open')) {
      hamburgerBtn.classList.remove('is-active');
      megaMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  /* --- 5. 메인 스와이퍼 --- */
  (function () {
    const track    = document.getElementById('swiperTrack');
    const prevBtn  = document.getElementById('swiperPrev');
    const nextBtn  = document.getElementById('swiperNext');
    const toggleBtn= document.getElementById('swiperToggle');
    const toggleIcon=document.getElementById('swiperToggleIcon');
    const current  = document.getElementById('swiperCurrent');
    const progress = document.getElementById('swiperProgress');
    if (!track) return;

    const TOTAL = 8, INTERVAL = 5000;
    let idx = 0, isPaused = false, timer = null, progTimer = null;

    function goTo(n) {
      idx = (n + TOTAL) % TOTAL;
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (current) current.textContent = idx + 1;
      restartProgress();
    }

    function restartProgress() {
      if (!progress) return;
      progress.style.transition = 'none';
      progress.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.transition = `width ${INTERVAL}ms linear`;
          progress.style.width = '100%';
        });
      });
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => goTo(idx + 1), INTERVAL);
    }
    function stopAuto() { clearInterval(timer); }

    prevBtn?.addEventListener('click', () => { goTo(idx - 1); if (!isPaused) startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(idx + 1); if (!isPaused) startAuto(); });
    toggleBtn?.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) { stopAuto(); if (toggleIcon) toggleIcon.className = 'fa-solid fa-play'; }
      else          { startAuto(); if (toggleIcon) toggleIcon.className = 'fa-solid fa-pause'; }
    });

    // 터치 스와이프
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? idx + 1 : idx - 1); if (!isPaused) startAuto(); }
    });

    goTo(0);
    startAuto();
  })();

  /* --- 6. 뉴스 탭 + 카드 렌더링 --- */
  (function () {
    const NEWS_DATA = {
      all:     [
        { tag: '공지사항', title: '2026년 상반기 문화예술 지원사업 공모 안내', date: '2026.05.22' },
        { tag: '채용공고', title: '2026년 제4차 직원(기간제) 공개경쟁 채용 공고', date: '2026.05.15' },
        { tag: '언론보도', title: '충남문화관광재단, 지역 문화예술 활성화 앞장', date: '2026.05.10' },
      ],
      notice:  [{ tag: '공지사항', title: '2026년 상반기 문화예술 지원사업 공모 안내', date: '2026.05.22' },
                { tag: '공지사항', title: '2026 충남 문화예술 주간 행사 안내', date: '2026.05.01' },
                { tag: '공지사항', title: '홈페이지 개편 안내', date: '2026.04.20' }],
      bid:     [{ tag: '공모·입찰', title: '문화예술 프로그램 운영 기관 공모', date: '2026.05.18' },
                { tag: '공모·입찰', title: '2026 충남 문화재단 홍보물 제작 입찰', date: '2026.05.05' },
                { tag: '공모·입찰', title: '공연장 음향 장비 구매 입찰', date: '2026.04.28' }],
      press:   [{ tag: '언론보도', title: '충남문화관광재단, 지역 문화예술 활성화 앞장', date: '2026.05.10' },
                { tag: '언론보도', title: '충남 문화 축제 흥행 성공', date: '2026.04.30' },
                { tag: '언론보도', title: '아르코센터, 예술인 입주 프로그램 확대', date: '2026.04.15' }],
      recruit: [{ tag: '채용공고', title: '2026년 제4차 직원(기간제) 공개경쟁 채용 공고', date: '2026.05.15' },
                { tag: '채용공고', title: '문화해설사 모집 공고', date: '2026.05.08' },
                { tag: '채용공고', title: '2026 충남 창작스튜디오 입주작가 모집', date: '2026.04.25' }],
    };

    const card1 = document.getElementById('newsCardList');
    const card2 = document.getElementById('newsCardList2');
    const card3 = document.getElementById('newsCardList3');
    const tabBtns = document.querySelectorAll('.news-tab__btn');
    if (!card1) return;

    function renderCards(tab) {
      const items = NEWS_DATA[tab] || [];
      [card1, card2, card3].forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(() => {
          el.innerHTML = items[i] ? `
            <span class="news-card__tag">${items[i].tag}</span>
            <p class="news-card__title">${items[i].title}</p>
            <time class="news-card__date">${items[i].date}</time>
          ` : '';
          el.style.opacity = '1';
        }, 180);
      });
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderCards(btn.dataset.tab);
      });
    });
    renderCards('all');
  })();

  /* --- 7. 뉴스 주요소식 스와이퍼 --- */
  (function () {
    const track     = document.getElementById('newsSwiperTrack');
    const viewport  = document.querySelector('.news-swiper__viewport');
    const prevBtn   = document.getElementById('newsSwiperPrev');
    const nextBtn   = document.getElementById('newsSwiperNext');
    const toggleBtn = document.getElementById('newsSwiperToggle');
    const toggleIcon= document.getElementById('newsSwiperToggleIcon');
    if (!track) return;

    function matchHeight() {
      const grid = document.querySelector('.news-section__grid');
      if (!grid || !viewport) return;
      const h = grid.offsetHeight;
      viewport.style.height = h + 'px';
      Array.from(track.children).forEach(s => { s.style.width = '100%'; s.style.height = h + 'px'; });
    }
    window.addEventListener('load', matchHeight);
    window.addEventListener('resize', matchHeight);
    setTimeout(matchHeight, 300);

    const TOTAL = 3, INTERVAL = 4000;
    let idx = 0, isPaused = false, timer = null;

    function goTo(n) { idx = (n + TOTAL) % TOTAL; track.style.transform = `translateX(-${idx * 100}%)`; }
    function startAuto() { clearInterval(timer); timer = setInterval(() => goTo(idx + 1), INTERVAL); }
    function stopAuto()  { clearInterval(timer); }

    toggleBtn?.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) { stopAuto(); if (toggleIcon) toggleIcon.className = 'fa-solid fa-play'; }
      else          { startAuto(); if (toggleIcon) toggleIcon.className = 'fa-solid fa-pause'; }
    });
    prevBtn?.addEventListener('click', () => { goTo(idx - 1); if (!isPaused) startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(idx + 1); if (!isPaused) startAuto(); });

    goTo(0); startAuto();
  })();

  /* --- 8. 컬쳐 섹션 슬라이더 --- */
  function createCultureSlider({ trackId, prevId, nextId, totalItems }) {
    const track   = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track) return;

    const viewport     = track.parentElement;
    const visibleCount = 2;
    const moveCount    = 2;
    const maxIndex     = Math.max(0, totalItems - visibleCount);
    let currentIndex   = 0;

    function getCardWidth() {
      const card = track.querySelector('.culture-card');
      if (card && card.offsetWidth > 0) return card.offsetWidth + 16;
      return (viewport.offsetWidth / 2) - 8;
    }

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
    }

    nextBtn?.addEventListener('click', () => {
      currentIndex = currentIndex + moveCount > maxIndex ? 0 : currentIndex + moveCount;
      updateSlider();
    });
    prevBtn?.addEventListener('click', () => {
      currentIndex = currentIndex - moveCount < 0 ? maxIndex : currentIndex - moveCount;
      updateSlider();
    });

    window.addEventListener('resize', () => { currentIndex = 0; updateSlider(); });
    window.addEventListener('load', updateSlider);
    setTimeout(updateSlider, 300);
  }

  createCultureSlider({ trackId: 'performanceTrack', prevId: 'performancePrev', nextId: 'performanceNext', totalItems: 8 });
  createCultureSlider({ trackId: 'festivalTrack',    prevId: 'festivalPrev',    nextId: 'festivalNext',    totalItems: 6 });
  createCultureSlider({ trackId: 'exhibitionTrack',  prevId: 'exhibitionPrev',  nextId: 'exhibitionNext',  totalItems: 5 });

  /* --- 9. 푸터 패밀리사이트 --- */
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

  /* --- 10. 구글 번역 --- */
  window.doTranslate = function(lang) {
    if (!lang) return;
    window.open('https://translate.google.com/translate?sl=ko&tl=' + lang + '&u=' + encodeURIComponent(location.href), '_blank');
  };

  /* --- 11. Scroll Reveal --- */
  (function () {
    document.body.classList.add('js-ready');
    const allReveal = Array.from(document.querySelectorAll('.reveal'));
    const vh = window.innerHeight;
    allReveal.filter(el => el.getBoundingClientRect().top < vh)
             .forEach(el => el.classList.add('is-visible'));
    const outView = allReveal.filter(el => el.getBoundingClientRect().top >= vh);
    if (outView.length) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.08 });
      outView.forEach(el => obs.observe(el));
    }
  })();

  /* --- 12. 팝업 슬라이더 --- */
  (function () {
    const overlay  = document.getElementById('popupOverlay');
    const track    = document.getElementById('popupTrack');
    const dotsWrap = document.getElementById('popupDots');
    const prevBtn  = document.getElementById('popupPrev');
    const nextBtn  = document.getElementById('popupNext');
    if (!overlay || !track) return;

    const hideKey = 'popup_hidden_until';
    const stored = localStorage.getItem(hideKey);
    if (stored && Date.now() < parseInt(stored)) {
      // 만료 전 → 숨김 (애니메이션 없이 즉시 제거)
      overlay.style.transition = 'none';
      overlay.classList.add('is-hidden');
      return;
    }
    // 만료됐으면 키 삭제
    if (stored) localStorage.removeItem(hideKey);

    const total = track.children.length;
    let idx = 0;

    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'popup__dot' + (i === 0 ? ' popup__dot--active' : '');
      dot.textContent = i + 1;
      dot.addEventListener('click', () => goTo(i));
      if (dotsWrap) dotsWrap.appendChild(dot);
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.popup__dot').forEach((d, i) => d.classList.toggle('popup__dot--active', i === idx));
    }

    let autoTimer = null;

    function goTo(n) {
      idx = (n + total) % total;
      track.style.transform = `translateX(-${idx * 100}%)`;
      updateDots();
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(idx + 1), 3500);
    }

    prevBtn?.addEventListener('click', () => { goTo(idx - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(idx + 1); startAuto(); });

    goTo(0);
    startAuto();
  })();

}); // DOMContentLoaded end
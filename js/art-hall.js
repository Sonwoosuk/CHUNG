/* art-hall.js */

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
  const megaMenu = document.getElementById('megaMenu');
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
  const familyBtn = document.getElementById('footerFamilyBtn');
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
    if (active) {
      setTimeout(() => {
        moveSlider(active);
        setWhiteText(active);
      }, 50);
    }

    subNavLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        moveSlider(link);
        setWhiteText(link);
      });
    });

    subNavWrap.addEventListener('mouseleave', () => {
      const cur = subNavWrap.querySelector('.page-sub-nav__link--active');
      if (cur) {
        moveSlider(cur);
        setWhiteText(cur);
      }
    });
  }

  /* --- 내부 탭 --- */
  const tabBtns   = document.querySelectorAll('.content-tab__btn');
  const tabPanels = document.querySelectorAll('.content-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('content-tab__btn--active'));
      tabPanels.forEach(p => p.classList.remove('content-panel--active'));
      btn.classList.add('content-tab__btn--active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('content-panel--active');
    });
  });

  /* --- 이미지 슬라이더 (자동재생) --- */
  const track   = document.getElementById('contentTrack');
  const prevBtn = document.getElementById('contentPrev');
  const nextBtn = document.getElementById('contentNext');
  if (track) {
    const total = track.children.length;
    let idx = 0;
    let autoTimer = null;

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

  /* --- 티켓예매 달력 + 목록 --- */
  const PERFORMANCES = [
    {
      title: '미디어아트 뮤지컬 - 파랑새',
      start: '2026.05.09', end: '2026.05.09',
      time: '14:00(러닝타임 80분, 인터미션 없음)',
      age: '5세 이상',
      contact: '충남문화관광재단 문화사업팀(041-630-2914)',
      img: 'images/arthall_01.jpg',
    },
  ];

  let currentYear = 2026, currentMonth = 5, selectedDay = 28;
  const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const calYear   = document.getElementById('calYear');
  const calMonth  = document.getElementById('calMonth');
  const calDays   = document.getElementById('calDays');
  const calPrev   = document.getElementById('calPrev');
  const calNext   = document.getElementById('calNext');
  const ticketList  = document.getElementById('ticketList');
  const ticketCount = document.getElementById('ticketCount');
  const ticketSearch = document.getElementById('ticketSearch');
  const ticketFilter = document.getElementById('ticketFilter');

  function renderCalendar() {
    if (!calDays) return;
    calYear.textContent  = currentYear;
    calMonth.textContent = `${MONTH_NAMES[currentMonth - 1]} / ${String(currentMonth).padStart(2,'0')}`;
    const days = new Date(currentYear, currentMonth, 0).getDate();
    calDays.innerHTML = '';
    for (let d = 1; d <= days; d++) {
      const btn = document.createElement('button');
      btn.className = 'ticket-calendar__day' + (d === selectedDay ? ' ticket-calendar__day--active' : '');
      btn.textContent = d;
      btn.addEventListener('click', () => { selectedDay = d; renderCalendar(); renderList(); });
      calDays.appendChild(btn);
    }
  }

  function renderList() {
    if (!ticketList) return;
    const keyword = ticketSearch?.value.toLowerCase() || '';
    const items = PERFORMANCES.filter(p => keyword === '' || p.title.toLowerCase().includes(keyword));
    ticketCount.textContent = `총 ${items.length}건 (1/1)`;
    ticketList.innerHTML = items.map(p => `
      <li class="ticket-item">
        <div class="ticket-item__img"><img src="${p.img}" alt="${p.title}" /></div>
        <div class="ticket-item__body">
          <p class="ticket-item__title">${p.title}</p>
          <ul class="ticket-item__meta">
            <li class="ticket-item__meta-row"><i class="fa-regular fa-calendar"></i><span class="ticket-item__meta-label">기간</span>${p.start} ~ ${p.end}</li>
            <li class="ticket-item__meta-row"><i class="fa-regular fa-clock"></i><span class="ticket-item__meta-label">시간</span>${p.time}</li>
            <li class="ticket-item__meta-row"><i class="fa-regular fa-user"></i><span class="ticket-item__meta-label">연령</span>${p.age}</li>
            <li class="ticket-item__meta-row"><i class="fa-solid fa-phone"></i><span class="ticket-item__meta-label">문의</span>${p.contact}</li>
          </ul>
        </div>
      </li>
    `).join('');
  }

  calPrev?.addEventListener('click', () => {
    currentMonth--; if (currentMonth < 1) { currentMonth = 12; currentYear--; }
    selectedDay = 1; renderCalendar(); renderList();
  });
  calNext?.addEventListener('click', () => {
    currentMonth++; if (currentMonth > 12) { currentMonth = 1; currentYear++; }
    selectedDay = 1; renderCalendar(); renderList();
  });
  ticketSearch?.addEventListener('input', renderList);
  ticketFilter?.addEventListener('change', renderList);

  renderCalendar();
  renderList();


  /* --- Page Animation --- */
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
    }, { threshold: 0.08 });
    scrollEls.forEach(el => io.observe(el));
  }

}); // DOMContentLoaded end
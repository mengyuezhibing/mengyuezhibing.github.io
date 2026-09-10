/**
 * ============================================================
 *  app.js —— 全部交互逻辑
 *  ① 主题注入  ② rem 自适应  ③ Loading  ④ Nav
 *  ⑤ Canvas 背景  ⑥ Scroll Reveal  ⑦ 作品切换
 *  ⑧ 技术栈/时间轴/日志  ⑨ 首屏数据指标
 * ============================================================
 */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ========== ① 主题注入 ========== */
  (function applyTheme() {
    var t = CFG.theme || {};
    var root = document.documentElement;
    if (t.bg)      root.style.setProperty('--bg', t.bg);
    if (t.accent)  root.style.setProperty('--accent', t.accent);
    if (t.accent2) root.style.setProperty('--accent-2', t.accent2);
    if (t.accent3) root.style.setProperty('--accent-3', t.accent3);
  })();

  /* ========== 个人信息 & 文案填充 ========== */
  (function fillText() {
    var p = CFG.profile || {}, h = CFG.hero || {};
    var ghUrl = 'https://github.com/' + (p.github || '');

    var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    set('navName', p.name); set('navRole', p.role);
    set('loadingLogo', p.name);
    set('footName', p.name);
    set('contactTitle', (p.nameCn ? p.nameCn + '·' : '') + '一起做点有意思的东西');
    if (h.slogan) { set('heroSlogan', h.slogan); set('loadingSlogan', h.slogan); }
    set('heroSub', h.sub); set('heroTitleL1', h.titleL1); set('heroTitleL2', h.titleL2);
    set('footYear', new Date().getFullYear());
    set('heroYear', new Date().getFullYear());

    if (Array.isArray(h.tagWords) && h.tagWords.length) {
      var tag = $('.landing__tag');
      if (tag) tag.innerHTML = '<i class="dot"></i> ' + h.tagWords.map(esc).join(' · ') +
        ' · <span id="heroYear">' + new Date().getFullYear() + '</span>';
    }

    var gh = $('#navGithub'); if (gh) gh.href = ghUrl;
    var cg = $('#contactGh'); if (cg) cg.href = ghUrl;

    /* ---------- QQ 加好友 ---------- */
    var QQ = p.qq;
    var isMobile = /Android|iPhone|iPad|iPod|Windows Phone|HarmonyOS|Mobile/i.test(navigator.userAgent);

    // 唤起 QQ 加好友：桌面用 tencent:// 协议，移动端用 mqqwpa://
    function qqAddUrl(num) {
      return isMobile
        ? 'mqqwpa://im/chat?chat_type=wpa&uin=' + num + '&version=1&src_type=web&web_src=oicqzone.com'
        : 'tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=' + num + '&website=www.oicqzone.com';
    }

    // 浮层：兜底方案（没装 QQ / 协议被拦截时也能加）
    (function qqPop() {
      var pop = $('#qqPop');
      if (!QQ || !pop) return;
      var numEl = $('#qqPopNum'), copyBtn = $('#qqPopCopy'), openBtn = $('#qqPopOpen');
      var tip = $('#qqPopTip');
      numEl.textContent = QQ;
      openBtn.href = qqAddUrl(QQ);

      function open() {
        pop.hidden = false;
        document.body.classList.add('is-locked');
        if (copyBtn) copyBtn.querySelector('span').textContent = '复制号码';
        if (tip) tip.textContent = isMobile
          ? '点击「在 QQ 中打开」直接发起好友申请，或长按上方号码复制'
          : '复制号码后用 QQ 搜索添加，或点击下方按钮唤起 QQ 客户端';
      }
      function close() {
        pop.hidden = true;
        document.body.classList.remove('is-locked');
      }
      window.__openQQPop = open;

      $$('[data-qq-close]', pop).forEach(function (el) { el.addEventListener('click', close); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !pop.hidden) close();
      });

      // 复制号码
      if (copyBtn) copyBtn.addEventListener('click', function () {
        var label = copyBtn.querySelector('span');
        var ok = function () {
          label.textContent = '已复制 ✓';
          setTimeout(function () { label.textContent = '复制号码'; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(QQ).then(ok, fallback);
        } else { fallback(); }
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = QQ;
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;top:-999px;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); ok(); } catch (e) { /* 忽略 */ }
          document.body.removeChild(ta);
        }
      });
    })();

    // 顶部导航 QQ 图标：点击直接唤起加好友，同时弹出兜底浮层
    var qqIcon = $('#navQQ');
    if (qqIcon && QQ) {
      qqIcon.title = 'QQ: ' + QQ + '　点击加好友';
      qqIcon.addEventListener('click', function (e) {
        e.preventDefault();
        try { window.location.href = qqAddUrl(QQ); } catch (err) { /* 协议不支持则忽略 */ }
        setTimeout(function () { if (window.__openQQPop) window.__openQQPop(); }, 260);
      });
    } else if (qqIcon) {
      qqIcon.style.display = 'none';
    }

    var cm = $('#contactMail');
    if (cm && p.email) { cm.href = 'mailto:' + p.email; cm.querySelector('span').textContent = p.email; }

    // 底部联系方式（label + 具体值）
    var links = $('#contactLinks');
    if (links && Array.isArray(p.links)) {
      links.innerHTML = p.links.map(function (l) {
        var isQQ = l.type === 'qq';
        var href = isQQ ? (QQ ? qqAddUrl(QQ) : '#') : (l.url || '#');
        return '<li class="final__link' + (isQQ ? ' is-qq' : '') + '">' +
          '<a href="' + esc(href) + '"' +
            (isQQ ? ' data-qq-open' : ' target="_blank" rel="noreferrer"') + '>' +
            '<span class="final__linkLabel">' + esc(l.label) + '</span>' +
            '<span class="final__linkValue">' + esc(l.value || l.label) + '</span>' +
          '</a></li>';
      }).join('');

      // 底部 QQ：优先弹浮层（含复制号码，避免游客没装客户端时无从下手）
      $$('[data-qq-open]', links).forEach(function (a) {
        a.addEventListener('click', function (e) {
          if (!window.__openQQPop) return;      // 没配置 QQ 就走默认链接
          e.preventDefault();
          window.__openQQPop();
        });
      });
    }
  })();

  /* ========== ② rem 自适应（源自终末地官网的设计稿缩放思路） ==========
   * 官网方案：以 2560×1440 / 1080×1920 为设计稿，等比换算 html 的 font-size，
   * 页面所有尺寸用 rem 书写 → 一套设计稿等比适配所有屏幕。
   * 这里保守化：只在 0.94 ~ 1.25 倍区间微调，避免小屏文字过小。
   */
  (function rootScale() {
    function apply() {
      var w = window.innerWidth;
      var size = 16 * Math.min(1.25, Math.max(0.94, w / 1920));
      document.documentElement.style.fontSize = size.toFixed(2) + 'px';
    }
    apply();
    window.addEventListener('resize', apply, { passive: true });
    window.addEventListener('orientationchange', apply);
  })();

  /* ========== ③ Loading ========== */
  (function loading() {
    var box = $('#loading'), bar = $('#loadingBar'), val = $('#loadingValue');
    if (!box) return;
    document.body.classList.add('is-locked');

    var progress = 0;
    var tick = setInterval(function () {
      progress = Math.min(100, progress + Math.random() * 14 + 4);
      if (bar) bar.style.width = progress + '%';
      if (val) val.textContent = String(Math.floor(progress)).padStart(3, '0');
      if (progress >= 100) { clearInterval(tick); setTimeout(finish, 260); }
    }, 110);

    function finish() {
      box.classList.add('is-done');
      document.body.classList.remove('is-locked');
      if (val) val.textContent = '100';
      setTimeout(function () { box.remove(); }, 800);
      document.dispatchEvent(new CustomEvent('site:ready'));
    }

    // 兜底：3.5s 无论如何结束
    setTimeout(function () { clearInterval(tick); if (!box.classList.contains('is-done')) finish(); }, 3500);
  })();

  /* ========== ④ Nav ========== */
  (function nav() {
    var el = $('#nav'), menu = $('#navMenu'), burger = $('#navBurger'), scan = $('.nav__scan');
    var links = $$('.nav__link');
    if (!el) return;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      el.classList.toggle('is-solid', y > 40);
      if (scan) scan.style.width = Math.min(100, (y / (document.body.scrollHeight - window.innerHeight)) * 100) + '%';
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && menu) {
      burger.addEventListener('click', function () { menu.classList.toggle('is-open'); });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('.nav__link')) menu.classList.remove('is-open');
      });
    }

    // 滚动高亮：顶部 nav + 左侧菜单栏 同步
    var map = {}, sideMap = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var sideLinks = $$('.sidenav__link');
    sideLinks.forEach(function (a) { sideMap[a.getAttribute('href').slice(1)] = a; });

    function activate(id) {
      links.forEach(function (a) { a.classList.toggle('is-active', a === map[id]); });
      sideLinks.forEach(function (a) { a.classList.toggle('is-active', a === sideMap[id]); });
    }

    // 点击左侧菜单：平滑滚动（CSS scroll-behavior 已开启，这里补 class 同步）
    sideLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        setTimeout(function () { activate(a.getAttribute('href').slice(1)); }, 60);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* ========== ⑤ Canvas 背景 ========== */
  (function bg() {
    var cvs = $('#bgCanvas');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, pts = [], mouse = { x: -999, y: -999 };
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      W = cvs.clientWidth; H = cvs.clientHeight;
      cvs.width = W * dpr; cvs.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, Math.max(28, (W * H) / 26000)));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
          r: Math.random() * 1.6 + .6
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184,144,42,.55)';
        ctx.fill();

        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < 18000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(45,58,37,' + (0.10 * (1 - d2 / 18000)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        // 鼠标磁力线
        var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
        if (md2 < 40000) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(125,162,102,.18)';
          ctx.stroke();
        }
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) {
      var r = cvs.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    if (reduced) { frame_static(); } else { frame(); }

    function frame_static() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(function (p) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184,144,42,.55)'; ctx.fill();
      });
    }
  })();

  /* ========== ⑥ Scroll Reveal ========== */
  (function reveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = parseInt(en.target.dataset.delay || '0', 10);
        setTimeout(function () { en.target.classList.add('is-in'); }, d);
        io.unobserve(en.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

    window.__observeReveal = function (root) {
      $$('.reveal', root).forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
    };
    window.__observeReveal(document);
  })();

  /* ========== ⑦ 作品区：竖线菜单 + 自动轮播 ========== */
  (function works() {
    var list   = $('#opsList');
    var track  = $('#opsTrack');
    var dots   = $('#opsDots');
    var info   = $('#opsInfo');
    var prev   = $('#opsPrev');
    var next   = $('#opsNext');
    var bar    = $('#opsProgressBar');
    var hint   = $('#opsHint');
    var stage  = list && list.parentNode.querySelector('.ops__stage');
    var items  = CFG.works || [];
    if (!list || !track || !info || !items.length) return;

    items.forEach(function (w, i) { w.index = w.index || String(i + 1).padStart(2, '0'); });

    /* —— 左侧竖线菜单 —— */
    list.innerHTML = items.map(function (w, i) {
      return '<button class="ops__item reveal' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '" style="--c:' + esc(w.accent || '#b8902a') + '" data-delay="' + (i * 60) + '">' +
        '<div class="ops__row"><span class="ops__idx">' + esc(w.index) + '</span>' +
        '<span class="ops__name">' + esc(w.name) + '</span></div>' +
        '<div class="ops__meta"><span>' + esc(w.role) + '</span><span>' + esc(w.year) + '</span></div>' +
        '</button>';
    }).join('');

    /* —— 轮播轨道 —— */
    track.innerHTML = items.map(function (w, i) {
      var img = w.cover
        ? '<img class="carousel__img" src="' + esc(w.cover) + '" alt="' + esc(w.name) + '" draggable="false">'
        : '<div class="carousel__img" style="background:linear-gradient(135deg,var(--bg-3),var(--bg))"></div>';
      return '<article class="carousel__slide' + (i === 0 ? ' is-current' : '') + '" data-i="' + i + '" style="--c:' + esc(w.accent || '#b8902a') + '">' +
        '<div class="carousel__tag">' +
          '<span class="carousel__chip">' + esc(w.index) + '</span>' +
          '<span class="carousel__chip">' + esc(w.role) + '</span>' +
        '</div>' +
        '<span class="carousel__num">' + esc(w.index) + '</span>' +
        img +
      '</article>';
    }).join('');

    /* —— 指示点 —— */
    dots.innerHTML = items.map(function (_, i) {
      return '<button class="carousel__dot' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '" aria-label="第 ' + (i + 1) + ' 张"></button>';
    }).join('');

    /* —— 下方详情面板 —— */
    function renderInfo(i) {
      var w = items[i];
      var tags = (w.tags || []).map(function (t) { return '<span class="ops__tag">' + esc(t) + '</span>'; }).join('');
      var links = '';
      if (w.repo) links += '<a class="btn btn--primary btn--sm" href="' + esc(w.repo) + '" target="_blank" rel="noreferrer"><span>查看源码</span></a>';
      if (w.demo) links += '<a class="btn btn--ghost btn--sm" href="' + esc(w.demo) + '" target="_blank" rel="noreferrer"><span>在线预览</span></a>';
      info.style.setProperty('--c', w.accent || '#b8902a');
      info.innerHTML =
        '<div class="ops__head">' +
          '<div class="ops__nameEn">' + esc(w.nameEn || w.name) + '</div>' +
          '<h3 class="ops__bodyName">' + esc(w.name) + '</h3>' +
          '<p class="ops__summary">' + esc(w.summary) + '</p>' +
          '<p class="ops__desc">' + esc(w.desc) + '</p>' +
        '</div>' +
        '<div class="ops__metaCol">' +
          '<div class="ops__metaHead">TECH · ' + (items.length > 0 ? (i + 1) + ' / ' + items.length : '') + '</div>' +
          '<div class="ops__tags">' + tags + '</div>' +
          '<div class="ops__links">' + links + '</div>' +
        '</div>';
    }

    /* —— 轮播状态机 ——
     * 关键点：进度条(rAF) 与切换(setTimeout) 共用同一起点 startT，
     * 每次切换后都重新调度，保证间隔恒定、进度条与切换同步。
     */
    var idx = 0, autoTimer = null, barTimer = null, startT = 0, DURATION = 8000;
    var paused = false;          // 悬停暂停标记
    var slides = $$('.carousel__slide', track);
    var dotEls = $$('.carousel__dot', dots);
    var itemEls = $$('.ops__item', list);
    var carousel = track.parentNode;

    function setIndex(i, fromAuto) {
      idx = (i + items.length) % items.length;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      slides.forEach(function (s, k) { s.classList.toggle('is-current', k === idx); });
      dotEls.forEach(function (d, k) { d.classList.toggle('is-active', k === idx); });
      itemEls.forEach(function (b, k) { b.classList.toggle('is-active', k === idx); });
      renderInfo(idx);
      // 无论手动还是自动，切换后都重新调度 → 间隔恒定、进度条同步
      schedule();
    }

    // 重新调度一次计时（进度条 + 切换共用 startT，保证同步且间隔恒定）
    function schedule() {
      stop();
      if (paused) return;        // 暂停期间只清计时，不重开
      startT = Date.now();
      if (bar) bar.style.width = '0%';
      (function tick() {
        var p = Math.min(1, (Date.now() - startT) / DURATION);
        if (bar) bar.style.width = (p * 100) + '%';
        if (p < 1) barTimer = requestAnimationFrame(tick);
      })();
      autoTimer = setTimeout(function () { setIndex(idx + 1, true); }, DURATION);
    }
    function stop() {
      clearTimeout(autoTimer); autoTimer = null;
      cancelAnimationFrame(barTimer); barTimer = null;
    }
    var start = schedule;      // 进入视口 / 悬停离开时启动计时

    /* —— 交互 —— */
    itemEls.forEach(function (b) { b.addEventListener('click', function () { setIndex(+b.dataset.i); }); });
    dotEls.forEach(function (d) { d.addEventListener('click', function () { setIndex(+d.dataset.i); }); });
    if (prev) prev.addEventListener('click', function () { setIndex(idx - 1); });
    if (next) next.addEventListener('click', function () { setIndex(idx + 1); });

    // 悬停暂停
    if (carousel) {
      carousel.addEventListener('mouseenter', function () {
        paused = true; stop();
        carousel.classList.add('is-paused');
        if (hint) hint.innerHTML = '<i></i>PAUSED';
      });
      carousel.addEventListener('mouseleave', function () {
        paused = false;
        carousel.classList.remove('is-paused');
        if (hint) hint.innerHTML = '<i></i>AUTO-PLAY · ' + items.length + ' SCREENS';
        schedule();
      });
    }

    // 进入视口才启动
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { start(); io.disconnect(); }
    }, { threshold: .25 });
    io.observe(carousel);

    // 键盘左右切换（聚焦时）
    if (carousel) {
      carousel.tabIndex = 0;
      carousel.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); setIndex(idx - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); setIndex(idx + 1); }
      });
    }

    /* —— 触摸滑动 —— */
    var startX = 0, dx = 0, dragging = false;
    if (carousel) {
      carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; dx = 0; dragging = true; stop(); }, { passive: true });
      carousel.addEventListener('touchmove',  function (e) { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
      carousel.addEventListener('touchend',   function () {
        dragging = false;
        if (Math.abs(dx) > 50) setIndex(idx + (dx < 0 ? 1 : -1));
        else start();
      });
    }

    renderInfo(0);
    if (window.__observeReveal) window.__observeReveal(list);
  })();

  /* ========== ⑧-a 技术栈 ========== */
  (function stack() {
    var box = $('#stackGrid');
    var items = CFG.stack || [];
    if (!box || !items.length) return;
    box.innerHTML = items.map(function (s, i) {
      var lis = (s.items || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
      return '<div class="lore__card reveal" style="--c:' + esc(s.accent || '#fffa00') + '" data-delay="' + (i * 80) + '">' +
        '<div class="lore__top"><h3 class="lore__title">' + esc(s.title) + '</h3><span class="lore__icon">' + esc(s.icon || '◆') + '</span></div>' +
        '<div class="lore__sub">MODULE ' + String(i + 1).padStart(2, '0') + '</div>' +
        '<ul class="lore__items">' + lis + '</ul>' +
      '</div>';
    }).join('');
    if (window.__observeReveal) window.__observeReveal(box);
  })();

  /* ========== ⑧-b 时间轴 ========== */
  (function timeline() {
    var box = $('#timelineList');
    var items = CFG.timeline || [];
    if (!box || !items.length) return;
    box.innerHTML = items.map(function (t, i) {
      return '<li class="cal__item reveal" data-delay="' + (i * 80) + '">' +
        '<span class="cal__dot"></span>' +
        '<div class="cal__time">' + esc(t.time) + '</div>' +
        '<div><h3 class="cal__title">' + esc(t.title) + '</h3>' +
        '<div class="cal__sub">' + esc(t.sub) + '</div>' +
        '<p class="cal__desc">' + esc(t.desc) + '</p></div>' +
      '</li>';
    }).join('');
    if (window.__observeReveal) window.__observeReveal(box);
  })();

  /* ========== ⑧-c 日志 + Tab ========== */
  (function notes() {
    var tabs = $('#infoTabs'), grid = $('#infoGrid'), more = $('#infoMore');
    var all = CFG.notes || [];
    if (!grid) return;

    var PAGE = 6, cur = 'ALL', shown = PAGE;

    var cates = ['ALL'];
    all.forEach(function (n) { if (cates.indexOf(n.cate) < 0) cates.push(n.cate); });

    if (tabs) {
      tabs.innerHTML = cates.map(function (c) {
        return '<button class="info__tab' + (c === 'ALL' ? ' is-active' : '') + '" data-c="' + esc(c) + '" role="tab">' + esc(c === 'ALL' ? 'ALL' : c) + '</button>';
      }).join('');
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('.info__tab');
        if (!b) return;
        cur = b.dataset.c; shown = PAGE;
        $$('.info__tab', tabs).forEach(function (x) { x.classList.toggle('is-active', x === b); });
        render();
      });
    }

    function rows() { return cur === 'ALL' ? all : all.filter(function (n) { return n.cate === cur; }); }

    function render() {
      var rs = rows().slice(0, shown);
      if (!rs.length) { grid.innerHTML = '<p class="info__brief" style="padding:0 var(--gut)">暂无内容</p>'; return; }
      grid.innerHTML = rs.map(function (n, i) {
        var cover = '<div class="info__cover info__cover--gen" style="--c:' + esc(n.color || 'var(--accent-2)') + '"></div>';
        if (n.cover) cover = '<div class="info__cover"><img src="' + esc(n.cover) + '" alt="" loading="lazy"></div>';
        return '<a class="info__card" href="' + esc(n.url || '#notes') + '" data-delay="' + (i * 70) + '">' +
          cover + '<span class="info__cate">' + esc(n.cate) + '</span>' +
          '<div class="info__body">' +
            '<span class="info__date">' + esc(n.date) + '</span>' +
            '<h3 class="info__title">' + esc(n.title) + '</h3>' +
            '<p class="info__brief">' + esc(n.brief) + '</p>' +
            '<span class="info__more">READ</span>' +
          '</div></a>';
      }).join('');
      if (more) more.style.display = shown >= rows().length ? 'none' : '';
      if (window.__observeReveal) window.__observeReveal(grid);
    }

    if (more) more.addEventListener('click', function () { shown += PAGE; render(); });
    render();
  })();

  /* ========== ⑨ 首屏数据指标（取自 config.js） ========== */
  (function heroStats() {
    var box = $('#heroStats');
    var stats = (CFG.hero && CFG.hero.stats) || [];
    if (!box || !stats.length) return;
    box.innerHTML = stats.map(function (s) {
      return '<li><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></li>';
    }).join('');
  })();

})();

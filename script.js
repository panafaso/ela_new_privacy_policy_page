$(function () {

  const groupColumn = 4;
  const headerOffset = 110;
  const backBtn = document.getElementById('backToTop');

  /*
  =========================
  CATEGORY ORDER
  =========================
  */

  const categoryOrder = {
    'EURES': 1,
    'Operations': 2,
    'People & Organisation': 3,
    'Legal and Regulatory Affairs & Data Protection': 4,
    'Corporate Services': 5,
    'AI solutions': 6,
    'Independent Mandated Functions': 7
  };

  $.fn.dataTable.ext.order['category-order'] = function (settings, col) {
    return this.api()
      .column(col, { order: 'index' })
      .nodes()
      .map(function (td) {
        return categoryOrder[$(td).text().trim()] || 999;
      });
  };

  /*
  =========================
  DATATABLE
  =========================
  */

  const table = $('#registerTable').DataTable({

    pageLength: 50,

    lengthMenu: [
      [50, 100],
      [50, 100]
    ],

    order: [
      [groupColumn, 'asc'],
      [0, 'asc']
    ],

    columnDefs: [

      {
        targets: groupColumn,
        visible: false,
        orderable: true,
        searchable: false,
        orderDataType: 'category-order'
      },

      {
        targets: [1, 2, 3],
        orderable: false,
        searchable: false
      },

      {
        targets: [0],
        orderable: true,
        searchable: true
      }

    ],

    rowGroup: {

      dataSrc: groupColumn,

      startRender: function (rows, group) {

        return $('<tr/>')
          .append(
            '<td colspan="4">' + group + '</td>'
          );
      }
    }
  });

  /*
  =========================
  GROUP CLICK SORT
  =========================
  */

  $('#registerTable tbody').on('click', 'tr.dtrg-group', function () {

    const currentOrder = table.order();

    if (
      currentOrder.length &&
      currentOrder[0][0] === groupColumn &&
      currentOrder[0][1] === 'asc'
    ) {

      table.order([
        [groupColumn, 'desc'],
        [0, 'asc']
      ]).draw();

    } else {

      table.order([
        [groupColumn, 'asc'],
        [0, 'asc']
      ]).draw();
    }
  });

  /*
  =========================
  TOC LINKS
  =========================
  */

  const tocLinks = Array.from(
    document.querySelectorAll('.toc-list a[href^="#"]')
  ).filter(a =>
    document.querySelector(a.getAttribute('href'))
  );

  const sections = tocLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  sections.forEach((sec, index) => {

    if (index > 0) {
      sec.classList.add('content-gap');
    }

  });

  function setActiveToc(targetId) {

    tocLinks.forEach(a => {

      a.classList.toggle(
        'active',
        a.getAttribute('href') === targetId
      );

    });
  }

  /*
  =========================
  TOC CLICK
  =========================
  */

  tocLinks.forEach(a => {

    a.addEventListener('click', (e) => {

      e.preventDefault();

      const id = a.getAttribute('href');
      const el = document.querySelector(id);

      if (!el) return;

      const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });

      setActiveToc(id);

      history.replaceState(null, '', id);

    });
  });

  /*
  =========================
  ACTIVE SECTION OBSERVER
  =========================
  */

  if (sections.length) {

    const observer = new IntersectionObserver((entries) => {

      const visible = entries
        .filter(en => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (
        visible &&
        visible.target &&
        visible.target.id
      ) {

        setActiveToc('#' + visible.target.id);
      }

    }, {

      root: null,

      rootMargin: `-${headerOffset}px 0px -55% 0px`,

      threshold: [0.15, 0.25, 0.4, 0.6]

    });

    sections.forEach(sec => observer.observe(sec));
  }

  /*
  =========================
  INITIAL ACTIVE TOC
  =========================
  */

  if (
    window.location.hash &&
    document.querySelector(window.location.hash)
  ) {

    setActiveToc(window.location.hash);

  } else if (tocLinks.length) {

    setActiveToc(
      tocLinks[0].getAttribute('href')
    );
  }

  /*
  =========================
  BACK TO TOP
  =========================
  */

  if (backBtn) {

    const updateBackToTop = () => {

      backBtn.classList.toggle(
        'show',
        window.scrollY > 120
      );

    };

    updateBackToTop();

    window.addEventListener(
      'scroll',
      updateBackToTop,
      { passive: true }
    );

    backBtn.addEventListener('click', () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    });
  }

});

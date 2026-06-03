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
    'Human Resources': 3,
    'Legal and Regulatory Affairs': 4,
    'Corporate Services': 5,
    'AI Solutions': 6,
    'Independent mandated functions': 7
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

    pageLength: 100,

lengthMenu: [
  [100],
  [100]
],

    order: [
  [groupColumn, 'asc'],
  [1, 'asc']
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
    targets: 0,
    orderable: false,
    searchable: true
  },

  {
    targets: 1,
    orderable: true,
    searchable: true
  },

  {
    targets: 2,
    orderable: false,
    searchable: false
  },

  {
    targets: 3,
    orderable: false,
    searchable: true
  }

],

    rowGroup: {

      dataSrc: groupColumn,
      
const showInfoIcon = [
  'Operations',
  'Corporate Services',
  'Independent mandated functions'
].includes(group);
  
startRender: function (rows, group) {

  const descriptions = {

    "EURES":
      "EURES includes activities related to labour mobility, free movement of workers and access to EURES employment services across the EU.",

    "Operations":
      "Operations includes activities related to Operational Coordination and Liaison, Enforcement and Analysis activities, Cooperation Support and Information related activities.",

    "Corporate Services":
      "Corporate Services includes operations in the fields of: i) Finance, Budget and Procurement, ii) Events and Facilities Management, and iii) ICT and Digitalisation Support.",

    "Legal and Regulatory Affairs":
      "Legal and Regulatory Affairs & Data Protection includes activities related to legal support, governance and compliance.",

    "Human Resources":
      "Human Resources includes activities related to human resources management, organisational development and staff support.",

    "AI Solutions":
      "AI Solutions includes activities involving artificial intelligence tools and systems used in ELA activities.",

    "Independent mandated functions":
      "Independent mandated functions includes activities related to independently mandated roles and functions within ELA, including the Executive Director, Spokesperson and Accounting activities."
  };

  const description = descriptions[group] || '';

  return $(`
    <tr class="category-row">
      <td colspan="4">

        <div class="category-header">

          <span class="category-title">
            ${group}
          </span>

          <div class="info-wrap">

            <span class="info-icon">i</span>

            <div class="info-tooltip">
              ${description}
            </div>

          </div>

        </div>

      </td>
    </tr>
  `);
}

    }
  });

  /*
  =========================
  GROUP CLICK SORT
  =========================
  */


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

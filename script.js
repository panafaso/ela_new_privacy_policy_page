$(function () {

  const groupColumn = 4;
  const headerOffset = 110;
  const backBtn = document.getElementById('backToTop');


  const categoryOrder = {
    'EURES': 1,
    'Operations': 2,
    'Human Resources': 3,
    'Legal and Regulatory Affairs': 4,
    'Data Protection': 5
    'Corporate Services': 6,
    'AI Solutions': 7,
    'Independent mandated functions': 8
  };

  $.fn.dataTable.ext.order['category-order'] = function (settings, col) {
    return this.api()
      .column(col, { order: 'index' })
      .nodes()
      .map(function (td) {
        return categoryOrder[$(td).text().trim()] || 999;
      });
  };


  const table = $('#registerTable').DataTable({

    pageLength: 100,

lengthMenu: [
  [100],
  [100]
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
    targets: 0,
    orderable: true,
    searchable: true
  },

  {
    targets: 1,
    orderable: false,
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

  startRender: function (rows, group) {

    const showInfoIcon = [
      'Operations',
      'Corporate Services',
      'Independent mandated functions'
    ].includes(group);

    const descriptions = {
      "Operations":
        "Operations includes activities related to Coordination and Liaison, Enforcement and Analysis, Cooperation Support, and Information-Communication services",

      "Corporate Services":
        "Corporate Services includes operations in the sectors of: i) Finance, Budget and Procurement, ii) Events and Facilities Management, and iii) ICT and Digitalisation Support.",

      "Independent mandated functions":
        "Independent mandated functions includes activities related to independently mandated roles and functions within ELA, including the Executive Director, Spokesperson and Accountant activities."
    };

    const description = descriptions[group] || '';

    return $(`
      <tr class="category-row">
        <td colspan="4">

          <div class="category-header">

            <span class="category-title">
              ${group}
            </span>

            ${showInfoIcon ? `
              <div class="info-wrap">
                <span class="info-icon">i</span>
                <div class="info-tooltip">
                  ${description}
                </div>
              </div>
            ` : ''}

          </div>

        </td>
      </tr>
    `);
  }

} 

}); 


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

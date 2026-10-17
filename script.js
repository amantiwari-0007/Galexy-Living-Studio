/* Galaxy Living Studio interactions — plain JavaScript, no framework required. */
'use strict';

// sessionStorage can throw (private mode, blocked storage); never let it break the page.
const safeStore = {
  get: key => { try { return sessionStorage.getItem(key); } catch { return null; } },
  remove: key => { try { sessionStorage.removeItem(key); } catch { /* ignore */ } }
};

// Mobile navigation
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
if (menuToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
}

// Homepage collection filters
const collectionButtons = [...document.querySelectorAll('[data-collection-filter]')];
const collectionCards = [...document.querySelectorAll('[data-collection]')];
collectionButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.collectionFilter || 'all';
  collectionButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  collectionCards.forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.collection !== filter;
  });
}));

// Catalogue category filters
const productButtons = [...document.querySelectorAll('[data-product-filter]')];
const productCards = [...document.querySelectorAll('[data-product-category]')];
const resultCount = document.querySelector('#catalogueResultCount');
function applyProductFilter(filter = 'all') {
  const validFilters = ['all', 'mattress', 'bedding', 'linen', 'curtains', 'windows'];
  const chosen = validFilters.includes(filter) ? filter : 'all';
  productButtons.forEach(item => {
    const active = item.dataset.productFilter === chosen;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  productCards.forEach(card => {
    const show = chosen === 'all' || card.dataset.productCategory === chosen;
    card.hidden = !show;
    if (show) visible++;
  });
  if (resultCount) {
    resultCount.textContent = `${visible} ${visible === 1 ? 'collection' : 'collections'} shown`;
  }
}
productButtons.forEach(button => button.addEventListener('click', () => {
  applyProductFilter(button.dataset.productFilter);
}));
if (productButtons.length) {
  const params = new URLSearchParams(window.location.search);
  const categoryFromUrl = params.get('category');
  const hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
  const initialCategory = categoryFromUrl || (hashTarget?.dataset.productCategory) || 'all';
  applyProductFilter(initialCategory);
}

// Catalogue search and sorting: combines with the selected category filter.
const searchInput = document.querySelector('#productSearch');
const sortSelect = document.querySelector('#productSort');
const catalogueGrid = document.querySelector('.catalogue-grid');
const validCategories = ['all', 'mattress', 'bedding', 'linen', 'curtains', 'windows'];
const hashCard = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
const urlCategory = new URLSearchParams(window.location.search).get('category') || hashCard?.dataset.productCategory || 'all';
let selectedProductFilter = validCategories.includes(urlCategory) ? urlCategory : 'all';
const originalProductOrder = [...productCards];
const baseApplyProductFilter = applyProductFilter;
applyProductFilter = function(filter = selectedProductFilter) {
  selectedProductFilter = filter;
  baseApplyProductFilter(filter);
  updateCatalogueResults();
};
function updateCatalogueResults() {
  if (!catalogueGrid || !productCards.length) return;
  const term = (searchInput?.value || '').trim().toLocaleLowerCase();
  let visible = 0;
  const sorted = [...originalProductOrder];
  const sort = sortSelect?.value || 'featured';
  if (sort === 'name-asc') sorted.sort((a,b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
  if (sort === 'name-desc') sorted.sort((a,b) => b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
  if (sort === 'category') sorted.sort((a,b) => a.dataset.productCategory.localeCompare(b.dataset.productCategory));
  sorted.forEach(card => {
    catalogueGrid.appendChild(card);
    const categoryMatch = selectedProductFilter === 'all' || card.dataset.productCategory === selectedProductFilter;
    const searchMatch = !term || card.textContent.toLocaleLowerCase().includes(term);
    const show = categoryMatch && searchMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'product' : 'products'} found`;
}
searchInput?.addEventListener('input', updateCatalogueResults);
sortSelect?.addEventListener('change', updateCatalogueResults);
if (productButtons.length) updateCatalogueResults();

// Custom curtain enquiry builder creates a summary; it never submits an order.
const curtainBuilder = document.querySelector('#curtainBuilder');
if (curtainBuilder) {
  const result = document.querySelector('#curtainBuilderResult');
  const summaryField = document.querySelector('#curtainSummary');
  const copyStatus = document.querySelector('#curtainCopyStatus');
  curtainBuilder.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(curtainBuilder);
    const line = (label,key) => `${label}: ${String(values.get(key) || '').trim() || 'Not specified'}`;
    const message = ['Hello Galaxy Living Studio,','', 'I would like to enquire about curtains.',
      line('Room / area','room'),line('Curtain style','style'),line('Fabric preference','fabric'),
      line('Preferred colour','colour'),line('Lining','lining'),line('Preferred light level','light'),
      line('Approx. window width','width') + ' cm',line('Approx. finished drop','height') + ' cm',
      line('Additional notes','notes'),'','Please advise on suitable options, final measurement requirements, pricing and availability.'].join('\n');
    summaryField.value = message;
    result.hidden = false;
    if (copyStatus) copyStatus.textContent = 'Summary created. Copy it, or continue to WhatsApp and choose the studio chat.';
    result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
  });
  document.querySelector('#sendCurtainWhatsApp')?.addEventListener('click', () => {
    if (!summaryField?.value.trim()) { if (copyStatus) copyStatus.textContent = 'Create your enquiry summary first.'; return; }
    const url = `https://wa.me/918882901005?text=${encodeURIComponent(summaryField.value)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  document.querySelector('#copyCurtainSummary')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(summaryField.value); copyStatus.textContent = 'Summary copied.'; }
    catch { summaryField.focus(); summaryField.select(); const ok=document.execCommand('copy'); copyStatus.textContent=ok?'Summary copied.':'Select the text above and copy it manually.'; }
  });
}

// Enquiry links select the matching category before the visitor reaches the form.
document.querySelectorAll('.catalogue-card a[href="#enquire"]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('#interest');
    const card = link.closest('.catalogue-card');
    const cardEnquiryLink = card?.querySelector('.enquiry-link[data-interest]');
    if (select && cardEnquiryLink) {
      const desired = cardEnquiryLink.dataset.interest;
      const option = [...select.options].find(item => item.value === desired || item.textContent.trim() === desired);
      if (option) select.value = option.value;
    }
  });
});

// Image fallback: keep the card's neutral background instead of showing a broken-image icon.
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.classList.add('image-unavailable');
    img.setAttribute('aria-hidden', 'true');
    img.alt = '';
  }, { once: true });
});

// Accessible hero slideshows with autoplay, pause-on-hover/focus, arrows and dots.
document.querySelectorAll('[data-slideshow]').forEach(slideshow => {
  const slides = [...slideshow.querySelectorAll('.hero-slide')];
  // The homepage places controls beside .hero-photo, while the catalogue
  // places them inside .catalogue-hero. Resolve both layouts from the section.
  const slideshowSection = slideshow.closest('.hero, .catalogue-hero') || slideshow.parentElement || slideshow;
  const controls = slideshowSection.querySelector('.hero-controls');
  if (!slides.length) return;
  if (slides.length < 2 || !controls) {
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== 0)));
    return;
  }
  const dots = [...controls.querySelectorAll('.hero-dot')];
  const previous = controls.querySelector('.hero-prev');
  const next = controls.querySelector('.hero-next');
  const counter = slideshowSection.querySelector('.slide-current');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
  let timer = null;
  let isHovered = false;
  let hasFocus = false;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.removeAttribute('loading');
    });
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
  }
  function stopAuto() { if (timer !== null) window.clearInterval(timer); timer = null; }
  function startAuto() {
    stopAuto();
    if (!reduceMotion && !document.hidden && !isHovered && !hasFocus) {
      timer = window.setInterval(() => showSlide(current + 1), 5500);
    }
  }
  previous?.addEventListener('click', () => { showSlide(current - 1); startAuto(); });
  next?.addEventListener('click', () => { showSlide(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startAuto(); }));
  slideshow.addEventListener('mouseenter', () => { isHovered = true; stopAuto(); });
  slideshow.addEventListener('mouseleave', () => { isHovered = false; startAuto(); });
  slideshow.addEventListener('focusin', () => { hasFocus = true; stopAuto(); });
  slideshow.addEventListener('focusout', event => {
    if (!slideshow.contains(event.relatedTarget)) { hasFocus = false; startAuto(); }
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
  showSlide(current);
  startAuto();
});

// HOMEPAGE ENQUIRY FORM
// This handler validates the form, saves a local draft where possible, and prepares a WhatsApp message.
// Important: localStorage belongs to this visitor's browser. It is not a shared database or an email inbox.
const enquiryForm = document.querySelector('#enquiryForm');
if (enquiryForm) {
  // Restore a product/category selected on another page, if the browser has that small preference saved.
  const savedInterest = safeStore.get('al-product-interest');
  const savedTitle = safeStore.get('al-product-title');
  const interestSelect = enquiryForm.querySelector('[name="interest"]');
  if (savedInterest && interestSelect) {
    const match = [...interestSelect.options].find(option =>
      option.value === savedInterest || option.textContent.trim() === savedInterest
    );
    if (match) interestSelect.value = match.value;
  }

  const status = document.querySelector('#formMessage');

  // Add clear custom validation for phone numbers before the browser opens WhatsApp.
  const phoneField = enquiryForm.querySelector('[name="phone"]');
  phoneField?.addEventListener('input', () => {
    const digits = phoneField.value.replace(/\D/g, '');
    phoneField.setCustomValidity(digits.length >= 7 && digits.length <= 15
      ? '' : 'Enter a phone number containing 7 to 15 digits.');
  });

  enquiryForm.addEventListener('submit', event => {
    // Stop the default page reload so we can validate and prepare the enquiry first.
    event.preventDefault();

    // Native required, email, minlength, and pattern rules show browser-friendly messages.
    if (!enquiryForm.reportValidity()) return;

    // Read all fields and trim accidental spaces from the user's answers.
    const formData = new FormData(enquiryForm);
    const getValue = name => String(formData.get(name) || '').trim();
    const enquiryData = {
      name: getValue('name'),
      phone: getValue('phone'),
      email: getValue('email'),
      interest: getValue('interest'),
      message: getValue('message'),
      submittedAt: new Date().toISOString()
    };

    // Save a local copy as a convenience; gracefully continue if private browsing blocks storage.
    try {
      localStorage.setItem('galaxy-living-last-enquiry', JSON.stringify(enquiryData));
    } catch (storageError) {
      console.warn('This browser did not allow a local enquiry draft to be saved.', storageError);
    }

    // Build a readable message containing the answers the visitor actually provided.
    const messageLines = [
      'Hello Galaxy Living Studio,',
      '',
      `My name is ${enquiryData.name}.`,
      `Phone: ${enquiryData.phone}`,
      `Email: ${enquiryData.email || 'Not provided'}`,
      `Interested in: ${enquiryData.interest}${savedTitle ? ` (${savedTitle})` : ''}`,
      `Additional details: ${enquiryData.message || 'No additional details provided.'}`,
      '',
      'Please share suitable options, pricing and next steps.'
    ];

    // Remove temporary product context after it has been included in this enquiry.
    safeStore.remove('al-product-interest');
    safeStore.remove('al-product-title');

    // Explain the next step accessibly; WhatsApp still requires the visitor to press Send.
    if (status) status.textContent = 'Your enquiry is ready. WhatsApp will open so you can review it and press Send. A local draft was saved only if this browser allows storage.';
    const whatsappUrl = `https://wa.me/918882901005?text=${encodeURIComponent(messageLines.join('\n'))}`;

    // Same-tab navigation is more reliable than a popup on browsers that block new windows.
    window.location.href = whatsappUrl;
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();


// CONTACT PAGE ENQUIRY FORM
// Collect the richer project brief, save a local draft when possible, then prefill WhatsApp.
const standaloneEnquiryForm = document.querySelector('#standaloneEnquiryForm');
if (standaloneEnquiryForm) {
  const status = document.querySelector('#standaloneStatus');
  const phoneField = standaloneEnquiryForm.querySelector('[name="phone"]');

  // Validate the number by digit count, allowing common characters such as +, spaces and brackets.
  phoneField?.addEventListener('input', () => {
    const digits = phoneField.value.replace(/\D/g, '');
    phoneField.setCustomValidity(digits.length >= 7 && digits.length <= 15
      ? '' : 'Enter a phone number containing 7 to 15 digits.');
  });

  // Build one consistent enquiry message from the named form fields.
  const buildMessage = data => {
    const get = key => String(data.get(key) || '').trim() || 'Not specified';
    return [
      'Hello Galaxy Living Studio,',
      '',
      `Name: ${get('name')}`,
      `Phone: ${get('phone')}`,
      `Email: ${get('email')}`,
      `City / area: ${get('location')}`,
      `Enquiry about: ${get('interest')}`,
      `Approximate budget: ${get('budget')}`,
      `Timeline: ${get('timeline')}`,
      '',
      'Project details:',
      get('message'),
      '',
      'Please recommend suitable options and next steps.'
    ].join('\n');
  };

  standaloneEnquiryForm.addEventListener('submit', event => {
    // Keep the visitor on the page if any required field or format is invalid.
    event.preventDefault();
    if (!standaloneEnquiryForm.reportValidity()) return;

    // Collect every answer once so the same data is used for local draft and WhatsApp.
    const formData = new FormData(standaloneEnquiryForm);
    const draft = Object.fromEntries([...formData.entries()].map(([key, value]) => [
      key, typeof value === 'string' ? value.trim() : value
    ]));
    draft.submittedAt = new Date().toISOString();

    // Local storage is only a convenience on this device; it does not deliver data to the business.
    try {
      localStorage.setItem('galaxy-living-last-enquiry', JSON.stringify(draft));
    } catch (storageError) {
      console.warn('This browser did not allow a local enquiry draft to be saved.', storageError);
    }

    // Prepare a URL-encoded WhatsApp message so punctuation and line breaks remain readable.
    const whatsappUrl = `https://wa.me/918882901005?text=${encodeURIComponent(buildMessage(formData))}`;
    if (status) status.textContent = 'Your enquiry is ready. WhatsApp will open so you can review it and press Send. A local draft was saved only if this browser allows storage.';

    // Same-tab navigation avoids most popup blockers; the user still chooses whether to send.
    window.location.href = whatsappUrl;
  });
}


// On-page WhatsApp mini panel: keep visitors on the current page until they choose to continue.
const whatsappToggle = document.querySelector('[data-whatsapp-toggle]');
const whatsappPanel = document.querySelector('#whatsappMiniPanel');
const whatsappMessage = document.querySelector('#whatsappMiniMessage');
const whatsappClose = document.querySelector('[data-whatsapp-close]');
const whatsappSend = document.querySelector('[data-whatsapp-send]');
function setWhatsAppPanel(open) {
  if (!whatsappPanel || !whatsappToggle) return;
  whatsappPanel.hidden = !open;
  whatsappPanel.setAttribute('aria-hidden', String(!open));
  whatsappToggle.setAttribute('aria-expanded', String(open));
  if (open) window.setTimeout(() => whatsappMessage?.focus(), 80);
}
whatsappToggle?.addEventListener('click', () => {
  setWhatsAppPanel(whatsappPanel?.hidden ?? true);
});
whatsappClose?.addEventListener('click', () => {
  setWhatsAppPanel(false);
  whatsappToggle?.focus();
});
whatsappSend?.addEventListener('click', () => {
  const message = whatsappMessage?.value.trim() || 'Hello Galaxy Living Studio, I would like to make an enquiry.';
  const url = `https://wa.me/918882901005?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && whatsappPanel && !whatsappPanel.hidden) {
    setWhatsAppPanel(false);
    whatsappToggle?.focus();
  }
});
document.addEventListener('click', event => {
  if (!whatsappPanel || whatsappPanel.hidden) return;
  if (whatsappPanel.contains(event.target) || whatsappToggle?.contains(event.target)) return;
  setWhatsAppPanel(false);
});


// FIXED QUICK-CONTACT DOCK -------------------------------------------------
// The call / enquiry / WhatsApp dock stays in a predictable position.
// It is intentionally NOT draggable: this avoids accidental movement and
// makes touch scrolling on phones feel natural. Adjust its position in CSS.
(() => {
  const dock = document.querySelector('.contact-dock');
  if (!dock) return; // Some pages may not include the floating contact dock.

  // Remove any position saved by an older draggable version of the website.
  // This prevents a previously moved dock from appearing in an unexpected spot.
  try {
    localStorage.removeItem('galaxyContactDockPosition');
  } catch (_) {
    // The dock still works normally if browser storage is unavailable.
  }
})();

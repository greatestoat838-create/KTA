/* KTA Spices — Shared JavaScript v3.2 (Universal Mobile Responsive & Search/Basket Handlers) */
'use strict';

/* ── 1. Scroll Reveal & Line Drawing ── */
(function(){
  var els = document.querySelectorAll('[data-reveal], .line-draw');
  if(!els.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var delay = e.target.dataset.delay ? parseInt(e.target.dataset.delay) * 40 : 0;
        setTimeout(function(){
          e.target.classList.add('revealed');
          e.target.classList.add('drawn');
        }, delay);
        io.unobserve(e.target);
      }
    });
  },{threshold:0.02,rootMargin:'0px 0px -20px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

/* ── 2. Universal Mobile Nav Drawer Handler ── */
(function(){
  function initMobileNav() {
    var hamburgers = document.querySelectorAll('.nav-hamburger, .home-hamburger, .mobile-hamburger-btn, #navHamburger, #homeHamburger, #mobileHamburger');
    var panel      = document.getElementById('mobilePanel');
    var overlay    = document.getElementById('mobileOverlay');
    var closeBtn   = document.getElementById('mobileClose');
    if(!panel) return;

    function openMenu(){
      panel.classList.add('is-open');
      if(overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    function shutMenu(){
      panel.classList.remove('is-open');
      if(overlay) overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    hamburgers.forEach(function(btn){
      btn.removeEventListener('click', btn._navHandler);
      btn._navHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        openMenu();
      };
      btn.addEventListener('click', btn._navHandler);
    });

    if(closeBtn) closeBtn.onclick = shutMenu;
    if(overlay)  overlay.onclick  = shutMenu;

    panel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', shutMenu);
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && panel.classList.contains('is-open')){
        shutMenu();
      }
    });

    // Touch swipe to close
    var startX = 0;
    panel.addEventListener('touchstart', function(e){
      startX = e.touches[0].clientX;
    }, {passive: true});

    panel.addEventListener('touchend', function(e){
      var diff = e.changedTouches[0].clientX - startX;
      if(diff > 50){ shutMenu(); }
    }, {passive: true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();

/* ── 3. Universal Search Overlay System ── */
(function(){
  var searchIndex = [
    // Top Whole Spices & Herbs with Multilingual Keys
    { title: 'Star Anise (Annachipoo — Royal 8-Pointed)', cat: 'Whole Spices', page: 'catalogue.html?search=annachipoo', desc: 'Single-origin eight-pointed unbroken star anise · thakkolam takkolam anasipoo chakri phool' },
    { title: 'Tellicherry Black Pepper (TGSEB Grade)', cat: 'Whole Spices', page: 'catalogue.html?search=black+pepper', desc: 'Bold single-estate malabar black pepper, high piperine · kurumulaku milagu kali mirch miriyalu' },
    { title: 'Dry Ginger (Whole & Ground Sonth)', cat: 'Whole Spices', page: 'catalogue.html?search=ginger', desc: 'Washed and sun-dried Cochin ginger · chukku sukku sonth saunth inji adrak allam' },
    { title: 'Green Cardamom (Alleppey 8mm+ Extra Bold)', cat: 'Whole Spices', page: 'catalogue.html?search=cardamom', desc: 'Grade A+ aromatic whole green cardamom pods · elakkaya elakkai elaichi yalukalu' },
    { title: 'Zanzibar Whole Cloves (Selected Grade A)', cat: 'Whole Spices', page: 'catalogue.html?search=cloves', desc: 'Handpicked whole clove buds with high essential oil · grampoo krambu lavangam laung' },
    { title: 'Kashmiri Mogra Saffron (Grade 1 Certified)', cat: 'Luxury Spices', page: 'catalogue.html?search=saffron', desc: '100% origin certified pure Kashmiri saffron stigmas · kunkumappoo kesar jafran' },
    { title: 'Ceylon Cinnamon True Quills (Alba Grade)', cat: 'Whole Spices', page: 'catalogue.html?search=cinnamon', desc: 'Ultra-pure thin bark true Ceylon cinnamon · pattai karuvapatta dalchini' },
    { title: 'Cassia Bark (Kesia Premium Lot)', cat: 'Whole Spices', page: 'catalogue.html?search=cassia', desc: 'Rich woody aromatic whole cassia bark quills · kesia dalchini karuvapatta' },
    { title: 'Biryani Bay Leaf (Selected Aromatic)', cat: 'Whole Spices', page: 'catalogue.html?search=biryani+leaf', desc: 'Farm-dried whole laurel bay leaves · vayana ila biryani ilai tejpatta' },
    { title: 'Black Cardamom (Large Pods)', cat: 'Whole Spices', page: 'catalogue.html?search=black+cardamom', desc: 'Smoky whole black cardamom pods · badi elaichi moti elaichi periya elakkai valiya elakkaya' },
    { title: 'Guntur S4 Hot Red Chillies', cat: 'Whole Spices', page: 'catalogue.html?search=guntur', desc: 'High capsaicin bright red dried Guntur chillies · vattal mulaku vara milagai lal mirch' },
    { title: 'Kashmiri Dried Chillies (High ASTA Color)', cat: 'Whole Spices', page: 'catalogue.html?search=kashmiri', desc: 'Vibrant natural crimson red Kashmiri chillies · piriyan mulaku kashmiri mirch degi mirch' },
    { title: 'Jaifal (Whole Nutmeg with Shell/Kernel)', cat: 'Whole Spices', page: 'catalogue.html?search=jaifal', desc: 'High butterfat whole aromatic nutmeg · jathikka jathikai jaiphal jajikaya' },
    { title: 'Javantri (Selected Mace Blades)', cat: 'Whole Spices', page: 'catalogue.html?search=javantri', desc: 'Golden orange unbroken mace flower blades · jathipathri jathipoov javitri vasavasi' },
    { title: 'Jeera (Whole Cumin Seeds)', cat: 'Whole Spices', page: 'catalogue.html?search=jeera', desc: 'Unadulterated high aroma whole cumin seeds · jeerakam seeragam zeera jeelakarra' },
    { title: 'Kalpasi (Dagad Phool / Stone Flower)', cat: 'Whole Spices', page: 'catalogue.html?search=kalpasi', desc: 'Exotic Chettinad lichen for authentic biryanis · marappasi dagad phool patthar phool' },
    { title: 'Kasuri Methi (Sun-Dried Fenugreek)', cat: 'Whole Spices', page: 'catalogue.html?search=kasuri+methi', desc: 'Crushed aromatic green fenugreek leaves · uluva ila vendhaya keerai kasoori methi' },
    { title: 'Turmeric Powder (5%+ Curcumin Batch)', cat: 'Ground Spices', page: 'catalogue.html?search=turmeric', desc: 'Pure origin Salem turmeric powder · manjal podi manjal thool haldi pasupu' },
    { title: 'Coriander Powder & Whole Seeds', cat: 'Spices', page: 'catalogue.html?search=coriander', desc: 'Green shade high volatile oil coriander · malli kothamalli dhaniya dhania' },
    { title: 'Fennel Seeds (Sombu Bold Green)', cat: 'Whole Spices', page: 'catalogue.html?search=fennel', desc: 'Sweet aromatic digestive fennel seeds · sombu perumjeerakam saunf sonf' },
    { title: 'Mustard Seeds & Fenugreek Seeds', cat: 'Whole Spices', page: 'catalogue.html?search=mustard', desc: 'Triple-cleaned black mustard & golden methi · kaduku kadugu sarson uluva vendhayam' },
    // Dry Fruits & Nuts
    { title: 'Jumbo Cashews W240 / W320 Premium', cat: 'Dry Fruits', page: 'catalogue.html?search=cashewnut', desc: 'Direct farm-graded whole creamy Indian cashews · kashuvandi kasuvandi kashuandi andipparippu kaju mundhiri munthiri godambi' },
    { title: 'California & Gurbandi Badam (Almonds)', cat: 'Dry Fruits', page: 'catalogue.html?search=badam', desc: 'High oil chef-grade whole raw almonds · baadam badami badam parippu' },
    { title: 'Pistachios (Pista Roasted & Salted)', cat: 'Dry Fruits', page: 'catalogue.html?search=pista', desc: 'Open-mouth green kernel Iranian pistachios · pistha roasted pista' },
    { title: 'Kashmiri & California Whole Walnuts', cat: 'Dry Fruits', page: 'catalogue.html?search=walnut', desc: 'Crisp half kernels rich in Omega-3 · akhrot akrot akroot' },
    { title: 'Kismiss & Black Currant Raisins', cat: 'Dry Fruits', page: 'catalogue.html?search=kismiss', desc: 'Golden seedless and black dried raisins · munthiringa unakka munthiri ular thiratchai kishmish' },
    { title: 'Royal Anjeer (Dried Whole Figs)', cat: 'Dry Fruits', page: 'catalogue.html?search=fig', desc: 'Plump natural sun-dried Turkish & Indian figs · athipazham athi pazham anjir' },
    // Commercial B2B Services & Custom Sourcing
    { title: 'Custom Origin Sourcing & Rare Botanicals', cat: 'Outsourcing Desk', page: 'https://wa.me/918592832871?text=Hello%20KTA%20Trade%20Desk%2C%20I%20am%20looking%20for%20Custom%20Sourcing%20%2F%20Rare%20Botanical%20Procurement%20for%20our%20commercial%20kitchen.%20Please%20advise%20on%20grade%20availability%2C%20minimums%2C%20and%20lot%20pricing.', desc: 'Single-origin lots, rare whole botanicals, custom grinding specs & contract institutional procurement' },
    { title: 'Hotel Smart 24/7 Rapid Supply Program', cat: 'Hotel Supply', page: 'index.html#hotelSmart', desc: 'Dedicated 24/7 emergency kitchen deliveries across South India · hotel smart logistics' },
    { title: 'Wholesale Commercial Price Catalogue (40kg+)', cat: 'B2B Trade', page: 'wholesale.html', desc: 'Commercial wholesale pricing for HORECA and food chains in 40kg+ consignments' },
    { title: 'Chef Credit & Kitchen Partnership Registry', cat: 'Partnership', page: 'partnership.html#registerKitchen', desc: 'Apply for 30-day kitchen credit terms & chef discovery sample boxes' },
    { title: 'KTA 25+ Years Legacy & Sourcing Heritage', cat: 'Heritage', page: 'heritage.html', desc: 'Learn about our origin plantations and quality control' },
    { title: 'Contact Executive Desk & WhatsApp Line', cat: 'Support', page: 'contact.html', desc: 'Direct hotline: +91 85928 32871 · Trade Desk' }
  ];

  function ensureSearchModal() {
    var existing = document.getElementById('searchModalBackdrop');
    if (existing) return existing;

    var backdrop = document.createElement('div');
    backdrop.id = 'searchModalBackdrop';
    backdrop.className = 'search-modal-backdrop';
    backdrop.innerHTML = [
      '<div class="search-modal-box" id="searchModalBox">',
      '  <div class="search-modal-header">',
      '    <div class="search-modal-input-wrap">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '        <circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line>',
      '      </svg>',
      '      <input type="text" id="searchModalInput" class="search-modal-input" placeholder="Search in English, Tamil, Malayalam, Hindi &amp; Indian languages..." autocomplete="off">',
      '    </div>',
      '    <button class="search-modal-close" id="searchModalClose" aria-label="Close search">&times;</button>',
      '  </div>',
      '  <div class="search-modal-body">',
      '    <div class="search-chips-title">Popular Searches</div>',
      '    <div class="search-chips-list">',
      '      <a href="catalogue.html?search=black+pepper" class="search-chip" data-query="Pepper">Tellicherry Pepper</a>',
      '      <a href="catalogue.html?search=ginger" class="search-chip" data-query="Dry Ginger">Dry Ginger</a>',
      '      <a href="catalogue.html?search=cardamom" class="search-chip" data-query="Cardamom">Green Cardamom</a>',
      '      <a href="catalogue.html?search=cashewnut" class="search-chip" data-query="Cashews">W320 Cashews</a>',
      '      <a href="https://wa.me/918592832871?text=Hello%20KTA%20Trade%20Desk%2C%20I%20am%20looking%20for%20Custom%20Sourcing%20%2F%20Agricultural%20Procurement%20for%20our%20commercial%20kitchen.%20Please%20advise%20on%20grade%20availability%2C%20minimums%2C%20and%20lot%20pricing." target="_blank" rel="noopener" class="search-chip" data-query="Custom Sourcing">Custom Sourcing</a>',
      '      <a href="index.html#hotelSmart" class="search-chip" data-query="Hotel Smart">Hotel Smart 24/7</a>',
      '      <a href="wholesale.html" class="search-chip" data-query="Wholesale">Wholesale Supply (100kg+)</a>',
      '      <a href="catalogue.html?search=cloves" class="search-chip" data-query="Cloves">Selected Cloves</a>',
      '    </div>',
      '    <div class="search-chips-title" id="searchResultsLabel" style="margin-top:16px;">Catalogue Items &amp; Services</div>',
      '    <div class="search-results-list" id="searchResultsList"></div>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(backdrop);
    return backdrop;
  }

  var MULTILINGUAL_SYNONYMS = {
    // Cinnamon / Cassia / Pattai
    'karuvapatta': ['cinnamon', 'cassia', 'pattai', 'kesia'],
    'karuvapetta': ['cinnamon', 'cassia', 'pattai', 'kesia'],
    'karuvapattai': ['cinnamon', 'cassia', 'pattai', 'kesia'],
    'pattai': ['cinnamon', 'cassia', 'pattai'],
    'dalchini': ['cinnamon', 'cassia', 'pattai'],
    'darchini': ['cinnamon', 'cassia', 'pattai'],
    'kesia': ['cassia', 'cinnamon'],
    'cassia': ['cassia', 'cinnamon'],
    'lavangapatta': ['cinnamon', 'pattai'],
    'dalchina chekka': ['cinnamon'],
    'chakke': ['cinnamon'],

    // Black & White Pepper
    'kurumulaku': ['pepper', 'black pepper'],
    'kurmulaku': ['pepper', 'black pepper'],
    'nallamulaku': ['pepper', 'black pepper'],
    'milagu': ['pepper', 'black pepper'],
    'karuppu milagu': ['pepper', 'black pepper'],
    'kali mirch': ['pepper', 'black pepper'],
    'kalimirch': ['pepper', 'black pepper'],
    'golki': ['pepper', 'black pepper'],
    'miriyalu': ['pepper', 'black pepper'],
    'mriyalu': ['pepper', 'black pepper'],
    'kari menasu': ['pepper', 'black pepper'],
    'safed mirch': ['white pepper'],
    'vellai milagu': ['white pepper'],
    'velutha kurumulaku': ['white pepper'],

    // Cardamom
    'elakkaya': ['cardamom'],
    'elakkai': ['cardamom'],
    'elam': ['cardamom'],
    'elaichi': ['cardamom'],
    'hari elaichi': ['cardamom'],
    'safed elaichi': ['cardamom', 'white cardamom'],
    'velutha elakkaya': ['white cardamom'],
    'vellai elakkai': ['white cardamom'],
    'badi elaichi': ['black cardamom'],
    'moti elaichi': ['black cardamom'],
    'periya elakkai': ['black cardamom'],
    'valiya elakkaya': ['black cardamom'],
    'yalukalu': ['cardamom'],
    'yelakulu': ['cardamom'],
    'elakki': ['cardamom'],

    // Cloves
    'grampoo': ['cloves'],
    'krambu': ['cloves'],
    'karambu': ['cloves'],
    'kirambu': ['cloves'],
    'lavangam': ['cloves'],
    'laung': ['cloves'],
    'lavang': ['cloves'],
    'lavangalu': ['cloves'],
    'lavanga': ['cloves'],

    // Star Anise
    'thakkolam': ['annachipoo', 'star anise'],
    'takkolam': ['annachipoo', 'star anise'],
    'annachipoo': ['annachipoo', 'star anise'],
    'anasipoo': ['annachipoo', 'star anise'],
    'chakri phool': ['annachipoo', 'star anise'],
    'chakra phool': ['annachipoo', 'star anise'],
    'anasphal': ['annachipoo', 'star anise'],
    'anasa puvvu': ['annachipoo', 'star anise'],
    'biryani puvvu': ['annachipoo', 'star anise'],
    'chakra moggu': ['annachipoo', 'star anise'],

    // Turmeric
    'manjal': ['turmeric'],
    'manjal podi': ['turmeric'],
    'haldi': ['turmeric'],
    'pasupu': ['turmeric'],
    'arishina': ['turmeric'],

    // Cumin
    'jeerakam': ['jeera', 'cumin'],
    'nalla jeerakam': ['jeera'],
    'seeragam': ['jeera'],
    'zeera': ['jeera'],
    'shahi jeera': ['valyajeerakam', 'shahi jeera'],
    'shahijeera': ['valyajeerakam', 'shahi jeera'],
    'valyajeerakam': ['valyajeerakam'],
    'jeelakarra': ['jeera'],
    'jeerige': ['jeera'],

    // Fennel
    'perumjeerakam': ['fennel', 'sombu'],
    'perunjeerakam': ['fennel', 'sombu'],
    'sombu': ['fennel', 'sombu'],
    'saunf': ['fennel', 'sombu'],
    'sonf': ['fennel', 'sombu'],
    'sopu': ['fennel', 'sombu'],
    'sompu': ['fennel', 'sombu'],

    // Mace
    'jathipathri': ['javantri', 'mace'],
    'jathipoov': ['javantri', 'mace'],
    'javitri': ['javantri', 'mace'],
    'vasavasi': ['javantri', 'mace'],
    'japatri': ['javantri', 'mace'],

    // Nutmeg
    'jathikka': ['jaifal', 'nutmeg'],
    'jathika': ['jaifal', 'nutmeg'],
    'jathikai': ['jaifal', 'nutmeg'],
    'jaiphal': ['jaifal', 'nutmeg'],
    'jajikaya': ['jaifal', 'nutmeg'],
    'jajikayi': ['jaifal', 'nutmeg'],

    // Bay Leaf
    'vayana ila': ['biryani leaf', 'bay leaf'],
    'biryani ila': ['biryani leaf', 'bay leaf'],
    'biryani ilai': ['biryani leaf', 'bay leaf'],
    'tejpatta': ['biryani leaf', 'bay leaf'],
    'tej patta': ['biryani leaf', 'bay leaf'],
    'biryani aaku': ['biryani leaf'],

    // Stone Flower
    'marappasi': ['kalpasi', 'stone flower'],
    'dagad phool': ['kalpasi', 'stone flower'],
    'patthar phool': ['kalpasi', 'stone flower'],
    'pathar phool': ['kalpasi', 'stone flower'],

    // Fenugreek
    'uluva': ['methi', 'kasuri methi'],
    'vendhayam': ['methi'],
    'venthayam': ['methi'],
    'menthulu': ['methi'],
    'kasoori methi': ['kasuri methi'],

    // Mustard
    'kaduku': ['mustard'],
    'kadugu': ['mustard'],
    'sarson': ['mustard'],
    'rai': ['mustard'],
    'aavalu': ['mustard'],
    'sasive': ['mustard'],

    // Ginger
    'chukku': ['ginger'],
    'sukku': ['ginger'],
    'sonth': ['ginger'],
    'saunth': ['ginger'],
    'inji': ['ginger'],
    'adrak': ['ginger'],
    'allam': ['ginger'],
    'sonti': ['ginger'],
    'shunti': ['ginger'],

    // Coriander
    'malli': ['coriander'],
    'kothamalli': ['coriander'],
    'dhaniya': ['coriander'],
    'dhania': ['coriander'],
    'dhaniyalu': ['coriander'],
    'kothambari': ['coriander'],

    // Chilli
    'vattal mulaku': ['chilly', 'kashmiri', 'guntur'],
    'chuvanna mulaku': ['chilly', 'kashmiri', 'guntur'],
    'piriyan mulaku': ['kashmiri'],
    'vara milagai': ['chilly', 'guntur', 'kashmiri'],
    'lal mirch': ['chilly', 'kashmiri', 'guntur'],
    'degi mirch': ['kashmiri'],

    // Nigella
    'karinjeerakam': ['nigella'],
    'karunjeeragam': ['nigella'],
    'kalonji': ['nigella'],

    // Sesame
    'ellu': ['white ellu', 'sesame'],
    'til': ['white ellu', 'sesame'],
    'safed til': ['white ellu', 'sesame'],
    'nuvvulu': ['white ellu', 'sesame'],

    // Nuts & Dry fruits
    'kashuvandi': ['cashewnut'],
    'andipparippu': ['cashewnut'],
    'mundhiri': ['cashewnut'],
    'kaju': ['cashewnut'],
    'jeedipappu': ['cashewnut'],
    'godambi': ['cashewnut'],

    'badam': ['badam'],
    'baadam': ['badam'],
    'almonds': ['badam'],
    'badami': ['badam'],

    'pista': ['pista'],
    'pistha': ['pista'],

    'akhrot': ['walnut'],
    'akrot': ['walnut'],

    'munthiringa': ['kismiss'],
    'unakka munthiri': ['kismiss'],
    'ular thiratchai': ['kismiss'],
    'kishmish': ['kismiss'],
    'munakka': ['kismiss'],

    'eenthapazham': ['dates'],
    'pericham pazham': ['dates'],
    'khajoor': ['dates'],
    'khajur': ['dates'],

    'athipazham': ['fig'],
    'athi pazham': ['fig'],
    'anjeer': ['fig'],
    'anjir': ['fig']
  };

  function getCustomSourcingCardHtml(query) {
    var rawQ = (query || '').trim();
    var displayQ = rawQ ? rawQ.replace(/</g, '&lt;') : 'rare botanicals or bulk spice lots';
    var waMsg = rawQ ?
      ("Hello KTA Trade Desk, I am looking to custom-source \"" + rawQ + "\" (unlisted grade / custom specification / bulk lot) for our commercial kitchen. Please advise on origin availability, minimum lot sizes, and pricing.") :
      ("Hello KTA Trade Desk, I am looking for Custom Sourcing / Agricultural Procurement for our commercial kitchen. Please advise on grade availability, minimums, and lot pricing.");
    var waUrl = "https://wa.me/918592832871?text=" + encodeURIComponent(waMsg);

    return [
      '<div class="search-custom-sourcing-card">',
      '  <div class="scs-badge">Custom Sourcing &amp; Outsourcing Desk</div>',
      '  <div class="scs-title">Looking to source <em>"' + displayQ + '"</em> or rare botanical lots?</div>',
      '  <div class="scs-desc">Our origin merchant network sources custom institutional lots, Grade-1 Kashmiri saffron, pure vanilla beans, rare whole botanicals, custom grinding specs, and unlisted high-volume commodities directly to your kitchen.</div>',
      '  <a href="' + waUrl + '" target="_blank" rel="noopener" class="scs-wa-btn">',
      '    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
      '    Direct WhatsApp Sourcing Desk ↗',
      '  </a>',
      '</div>'
    ].join('');
  }

  function renderSearchResults(query, listEl, labelEl) {
    var q = (query || '').trim().toLowerCase();
    
    // Check multilingual aliases
    var searchTerms = [q];
    if (q && MULTILINGUAL_SYNONYMS[q]) {
      searchTerms = searchTerms.concat(MULTILINGUAL_SYNONYMS[q]);
    } else if (q) {
      Object.keys(MULTILINGUAL_SYNONYMS).forEach(function(key) {
        if (key.indexOf(q) !== -1 || q.indexOf(key) !== -1) {
          searchTerms = searchTerms.concat(MULTILINGUAL_SYNONYMS[key]);
        }
      });
    }

    var matches = searchIndex.filter(function(item){
      if(!q) return true;
      var text = (item.title + ' ' + item.cat + ' ' + item.desc).toLowerCase();
      return searchTerms.some(function(term){
        return term && text.indexOf(term) !== -1;
      });
    });

    if (labelEl) {
      labelEl.textContent = q ? ('Matching Registry Items (' + matches.length + ')') : 'Catalogue Items & Services';
    }

    var html = '';
    if (matches.length > 0) {
      html += matches.slice(0, 7).map(function(item){
        return [
          '<a href="' + item.page + '" class="search-result-item">',
          '  <div>',
          '    <div class="search-result-title">' + item.title + '</div>',
          '    <div class="search-result-subtitle">' + item.desc + ' · <span style="color:#435128;font-weight:700;">' + item.cat + '</span></div>',
          '  </div>',
          '  <span class="search-result-arrow">→</span>',
          '</a>'
        ].join('');
      }).join('');
    } else if (q) {
      html += '<div style="padding:16px;text-align:center;color:#666;font-size:13px;background:#faf9f6;border-radius:12px;border:1px solid rgba(0,0,0,0.06);">No exact standard catalogue SKU for "<strong>' + query.replace(/</g,'&lt;') + '</strong>".</div>';
    }

    // Always append Custom Sourcing Card
    html += getCustomSourcingCardHtml(query);

    listEl.innerHTML = html;
  }

  function initSearchModal() {
    var backdrop = ensureSearchModal();
    var input    = document.getElementById('searchModalInput');
    var closeBtn = document.getElementById('searchModalClose');
    var listEl   = document.getElementById('searchResultsList');
    var labelEl  = document.getElementById('searchResultsLabel');

    function openSearch() {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      renderSearchResults('', listEl, labelEl);
      setTimeout(function(){ if(input) { input.focus(); input.select(); } }, 100);
    }

    function closeSearch() {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      if(input) input.value = '';
    }

    // Delegated click listener for all search buttons across pages
    document.addEventListener('click', function(e){
      var searchBtn = e.target.closest('.desktop-search-btn, .mobile-search-btn, #desktopSearchBtn, #mobileSearchBtn');
      if (searchBtn) {
        e.preventDefault();
        e.stopPropagation();
        openSearch();
        return;
      }

      if (e.target === backdrop || e.target.closest('#searchModalClose')) {
        e.preventDefault();
        closeSearch();
        return;
      }

      var chip = e.target.closest('.search-chip');
      if (chip) {
        var q = chip.getAttribute('data-query');
        if (q && input) {
          e.preventDefault();
          input.value = q;
          renderSearchResults(q, listEl, labelEl);
        }
      }
    });

    if (input) {
      input.addEventListener('input', function(){
        renderSearchResults(input.value, listEl, labelEl);
      });

      input.addEventListener('keydown', function(e){
        if (e.key === 'Enter') {
          var val = (input.value || '').trim();
          if (val) {
            window.location.href = 'catalogue.html?search=' + encodeURIComponent(val);
          }
        }
      });
    }

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && backdrop.classList.contains('is-open')){
        closeSearch();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchModal);
  } else {
    initSearchModal();
  }
})();

/* ── 4. Universal Cart / Enquiry Basket Drawer Handler & Three Dots ── */
(function(){
  function ensureMoreOptionsModal() {
    var existing = document.getElementById('moreOptionsBackdrop');
    if (existing) return existing;

    var backdrop = document.createElement('div');
    backdrop.id = 'moreOptionsBackdrop';
    backdrop.className = 'more-options-backdrop';
    backdrop.innerHTML = [
      '<div class="more-options-sheet" id="moreOptionsSheet">',
      '  <div class="more-options-handle"></div>',
      '  <div class="more-options-head">',
      '    <div class="more-options-title">Quick Actions</div>',
      '    <button class="more-options-close" id="moreOptionsClose" aria-label="Close">&times;</button>',
      '  </div>',
      '  <div class="more-options-list">',
      '    <a href="#" class="more-option-item" id="moreOptSearch">',
      '      <span class="more-opt-icon-wrap">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">Search Spices &amp; Catalogue</div>',
      '        <div class="more-opt-sub">Instant SKU, origin, and HSN lookup</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '    <a href="https://wa.me/918592832871?text=Hello%20KTA%20Trade%20Desk%2C%20I%20am%20looking%20for%20Custom%20Sourcing%20%2F%20Agricultural%20Procurement%20for%20our%20commercial%20kitchen.%20Please%20advise%20on%20grade%20availability%2C%20minimums%2C%20and%20lot%20pricing." target="_blank" rel="noopener" class="more-option-item" style="background:rgba(67,81,40,0.04);border:1px solid rgba(67,81,40,0.12);border-radius:14px;">',
      '      <span class="more-opt-icon-wrap" style="background:rgba(67,81,40,0.14);color:var(--olive);">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title" style="color:var(--olive);font-weight:700">Custom Sourcing &amp; Procurement</div>',
      '        <div class="more-opt-sub">Single-origin rare lots, custom grind specs &amp; multi-ton consignments</div>',
      '      </div>',
      '      <span class="more-opt-arrow" style="color:var(--olive)">→</span>',
      '    </a>',
      '    <a href="catalogue.html" class="more-option-item">',
      '      <span class="more-opt-icon-wrap">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M6 6h10M6 10h10"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">Browse Full Spice Catalogue</div>',
      '        <div class="more-opt-sub">50+ origin-certified varieties &amp; dry fruits</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '    <a href="wholesale.html" class="more-option-item">',
      '      <span class="more-opt-icon-wrap">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/><path d="m12 13 9-5"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">Wholesale Commercial Pricing</div>',
      '        <div class="more-opt-sub">Tiered lot quotes &amp; 100kg+ bulk supply</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '    <a href="index.html#hotelSmart" class="more-option-item">',
      '      <span class="more-opt-icon-wrap">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="1" y="6" rx="2"/><circle cx="5" cy="19" r="2"/><circle cx="13" cy="19" r="2"/><path d="M17 6h3l3 4.5v5.5h-2"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">24/7 Hotel Smart Delivery</div>',
      '        <div class="more-opt-sub">Dedicated rapid replenishment for hotels &amp; kitchens</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '    <a href="partnership.html#registerKitchen" class="more-option-item">',
      '      <span class="more-opt-icon-wrap">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">Register Kitchen Partnership</div>',
      '        <div class="more-opt-sub">Chef welcome discovery box &amp; 30-day billing</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '    <a href="tel:+918592832871" class="more-option-item" style="color:var(--olive);">',
      '      <span class="more-opt-icon-wrap" style="background:rgba(67,81,40,0.12);color:var(--olive);">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">Call Trade Desk: +91 85928 32871</div>',
      '        <div class="more-opt-sub">Mon–Sat · 8am–8pm IST · Direct Hotline</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '    <a href="https://wa.me/918592832871?text=Hello%20KTA%20Team%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener" class="more-option-item" style="color:#128c46;">',
      '      <span class="more-opt-icon-wrap" style="background:rgba(18,140,70,0.12);color:#128c46;">',
      '        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
      '      </span>',
      '      <div class="more-opt-content">',
      '        <div class="more-opt-title">Chat on WhatsApp</div>',
      '        <div class="more-opt-sub">Instant quotation &amp; lot tracking queries</div>',
      '      </div>',
      '      <span class="more-opt-arrow">→</span>',
      '    </a>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(backdrop);
    return backdrop;
  }

  function initMoreOptions() {
    var backdrop = ensureMoreOptionsModal();
    var closeBtn = document.getElementById('moreOptionsClose');
    var searchOpt = document.getElementById('moreOptSearch');

    function openMore() {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeMore() {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function(e) {
      var moreBtn = e.target.closest('.mobile-more-btn, #mobileMoreBtn');
      if (moreBtn) {
        e.preventDefault();
        e.stopPropagation();
        openMore();
        return;
      }

      if (e.target === backdrop || e.target.closest('#moreOptionsClose')) {
        e.preventDefault();
        closeMore();
        return;
      }

      var searchLink = e.target.closest('#moreOptSearch');
      if (searchLink) {
        e.preventDefault();
        closeMore();
        var searchBtn = document.getElementById('desktopSearchBtn') || document.getElementById('mobileSearchBtn');
        if (searchBtn) searchBtn.click();
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && backdrop.classList.contains('is-open')){
        closeMore();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMoreOptions);
  } else {
    initMoreOptions();
  }
})();

/* ── 5. Universal Cart / Enquiry Basket Drawer Handler ── */
(function(){
  function ensureQuickBasket() {
    var existing = document.getElementById('quickBasketBackdrop');
    if (existing) return existing;

    var backdrop = document.createElement('div');
    backdrop.id = 'quickBasketBackdrop';
    backdrop.className = 'quick-basket-backdrop';
    backdrop.innerHTML = [
      '<div class="quick-basket-drawer" id="quickBasketDrawer">',
      '  <div class="quick-basket-head">',
      '    <div>',
      '      <div class="quick-basket-title">Kitchen Sample Tray</div>',
      '      <div class="quick-basket-sub">Chef Direct Tasting &amp; Bulk Orders</div>',
      '    </div>',
      '    <button class="quick-basket-close" id="quickBasketClose" aria-label="Close">&times;</button>',
      '  </div>',
      '  <div class="quick-basket-body">',
      '    <div class="quick-basket-card">',
      '      <h4 style="display:flex;align-items:center;gap:8px;">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;color:var(--olive);"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>',
      '        Origin-Certified Samples',
      '      </h4>',
      '      <p>Select raw origin cardamom, Tellicherry pepper, and saffron samples directly delivered to your restaurant or commercial kitchen.</p>',
      '      <a href="catalogue.html" class="quick-basket-btn btn-primary-green" style="font-size:12px;padding:9px 16px;">Browse Spice Catalogue →</a>',
      '    </div>',
      '    <div class="quick-basket-card">',
      '      <h4 style="display:flex;align-items:center;gap:8px;">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;color:var(--olive);"><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/></svg>',
      '        Bulk &amp; Wholesale Trade Desk',
      '      </h4>',
      '      <p>Direct supply contracts, batch lab reports, and priority next-day replenishment across South India.</p>',
      '      <a href="wholesale.html" class="quick-basket-btn btn-outline-dark" style="font-size:12px;padding:9px 16px;">View Wholesale Pricing →</a>',
      '    </div>',
      '    <div class="quick-basket-actions">',
      '      <a href="https://wa.me/918592832871?text=Hello%20KTA%20Trade%20Desk%2C%20I%20want%20to%20request%20samples%20and%20commercial%20pricing." target="_blank" rel="noopener" class="quick-basket-btn btn-wa" style="display:flex;align-items:center;justify-content:center;gap:8px;">',
      '        <svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
      '        Quick WhatsApp Order Request',
      '      </a>',
      '      <a href="tel:+918592832871" class="quick-basket-btn btn-outline-dark" style="display:flex;align-items:center;justify-content:center;gap:8px;">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      '        Call Trade Desk: +91 85928 32871',
      '      </a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(backdrop);
    return backdrop;
  }

  function initCartButtons() {
    var cartBtns = document.querySelectorAll('.mobile-cart-btn, #mobileCartBtn');
    if (!cartBtns.length) return;

    cartBtns.forEach(function(btn){
      btn.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();

        // If on catalogue.html and sample tray exists, open sample tray drawer
        var trayDrawer = document.getElementById('trayDrawer');
        var trayBackdrop = document.getElementById('trayBackdrop');
        if (trayDrawer && trayBackdrop) {
          trayDrawer.classList.add('active');
          trayBackdrop.classList.add('active');
          document.body.style.overflow = 'hidden';
          if (typeof window.renderTray === 'function') window.renderTray();
          return;
        }

        // On other pages, open Quick Basket drawer
        var qBackdrop = ensureQuickBasket();
        var qClose    = document.getElementById('quickBasketClose');

        function openQuickBasket() {
          qBackdrop.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
        function closeQuickBasket() {
          qBackdrop.classList.remove('is-open');
          document.body.style.overflow = '';
        }

        if (qClose) qClose.onclick = closeQuickBasket;
        qBackdrop.onclick = function(ev){
          if(ev.target === qBackdrop) closeQuickBasket();
        };

        openQuickBasket();
      };
    });

    // Update cart badge if localStorage has items
    try {
      var saved = localStorage.getItem('kta_sample_tray');
      var items = saved ? JSON.parse(saved) : [];
      var badges = document.querySelectorAll('.mobile-cart-badge, #cartBadgeCount');
      badges.forEach(function(b){
        if (items && items.length > 0) {
          b.textContent = items.length;
          b.style.display = 'inline-block';
        } else {
          b.style.display = 'none';
        }
      });
    } catch(err){}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartButtons);
  } else {
    initCartButtons();
  }
})();

/* ── 5. Stat Counters ── */
(function(){
  var els = document.querySelectorAll('[data-counter]');
  if(!els.length) return;

  function animate(el){
    var target   = parseFloat(el.dataset.counter);
    var suffix   = el.dataset.suffix||'';
    var prefix   = el.dataset.prefix||'';
    var decimals = (String(target).split('.')[1]||'').length;
    var duration = 800;
    var start    = null;
    function ease(t){ return 1-Math.pow(1-t,3); }
    function step(ts){
      if(!start) start=ts;
      var p  = Math.min((ts-start)/duration,1);
      var v  = target*ease(p);
      el.textContent = prefix+(decimals?v.toFixed(decimals):Math.round(v))+suffix;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); }
    });
  },{threshold:0.2});
  els.forEach(function(el){ io.observe(el); });
})();

/* ── 6. Horizontal Scroll Arrows & Flamingo Estate 1-by-1 Step Movement ── */
(function(){
  function initFlamingoScrollers() {
    document.querySelectorAll('.scroll-row-wrap').forEach(function(wrap){
      var row  = wrap.querySelector('.scroll-row');
      var prev = wrap.querySelector('.arrow-prev');
      var next = wrap.querySelector('.arrow-next');
      if(!row || row.dataset.flamingoInit) return;
      row.dataset.flamingoInit = 'true';

      function getStep() {
        var card = row.querySelector('.product-card, .ws-product-card, .estate-card');
        return card ? (card.offsetWidth + 16) : 240;
      }

      function stepScroll(dir) {
        var step = getStep();
        var target = row.scrollLeft + dir * step;
        row.scrollTo({ left: target, behavior: 'smooth' });
      }

      if(prev) prev.onclick = function(e){ e.preventDefault(); stepScroll(-1); };
      if(next) next.onclick = function(e){ e.preventDefault(); stepScroll(1); };

      // Desktop Trackpad / Mouse Wheel Damping (Moves strictly 1 card per deliberate gesture)
      var wheelLock = false;
      row.addEventListener('wheel', function(e){
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 18) {
          e.preventDefault();
          if (wheelLock) return;
          wheelLock = true;
          var dir = e.deltaX > 0 ? 1 : -1;
          stepScroll(dir);
          setTimeout(function(){ wheelLock = false; }, 360);
        }
      }, { passive: false });

      // Mobile Touch Gesture Snap Damping
      var touchStartX = 0;
      var touchStartScroll = 0;
      row.addEventListener('touchstart', function(e){
        touchStartX = e.touches[0].pageX;
        touchStartScroll = row.scrollLeft;
      }, { passive: true });

      row.addEventListener('touchend', function(e){
        var touchEndX = e.changedTouches[0].pageX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          var dir = diff > 0 ? 1 : -1;
          var step = getStep();
          var targetIndex = Math.round((touchStartScroll + dir * step) / step);
          row.scrollTo({ left: Math.max(0, targetIndex * step), behavior: 'smooth' });
        }
      }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlamingoScrollers);
  } else {
    initFlamingoScrollers();
  }
})();


/* ── 7. Wholesale Carousel ── */
(function(){
  var carousel = document.getElementById('wsCarousel');
  if(!carousel) return;
  var slides  = carousel.querySelectorAll('.ws-slide');
  var prevBtn = document.getElementById('wsPrev');
  var nextBtn = document.getElementById('wsNext');
  var counter = document.getElementById('wsCounter');
  var total   = slides.length;
  var current = 0;
  var timer;

  function show(idx){
    slides.forEach(function(s){ s.classList.remove('active'); });
    slides[idx].classList.add('active');
    if(counter) counter.textContent=(idx+1)+' / '+total;
  }
  function advance(){ current=(current+1)%total; show(current); }

  function startTimer(){ timer=setInterval(advance,5000); }
  function resetTimer(){ clearInterval(timer); startTimer(); }

  if(prevBtn) prevBtn.addEventListener('click',function(){ current=(current-1+total)%total; show(current); resetTimer(); });
  if(nextBtn) nextBtn.addEventListener('click',function(){ current=(current+1)%total; show(current); resetTimer(); });

  show(0);
  startTimer();
})();

/* ── 8. FAQ Accordion Handler ── */
window.toggleFaq = function(el) {
  var header = el;
  if (!header.classList.contains('faq-header') && !header.classList.contains('faq-question')) {
    header = el.closest('.faq-header, .faq-question');
  }
  if (!header) return;

  var item = header.closest('.faq-card, .faq-item');
  if (!item) return;

  var wasActive = item.classList.contains('active');
  document.querySelectorAll('.faq-card, .faq-item').forEach(function(i) {
    i.classList.remove('active');
  });

  if (!wasActive) {
    item.classList.add('active');
  }
};

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-header, .faq-question').forEach(function(hdr) {
    hdr.removeAttribute('onclick');
    hdr.style.cursor = 'pointer';
    hdr.addEventListener('click', function(e) {
      e.preventDefault();
      window.toggleFaq(this);
    });
  });

  document.querySelectorAll('.faq-btn-icon').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleFaq(this.closest('.faq-header, .faq-question') || this);
    });
  });
});

/* ── 9. Universal Nav Scroll Floating ── */
(function(){
  var nav = document.getElementById('homeNav');
  if(!nav) return;
  window.addEventListener('scroll', function(){
    if(window.scrollY > 30){
      nav.classList.add('floating');
    } else {
      nav.classList.remove('floating');
    }
  }, {passive:true});
})();

/* ── 10. Technical Batch QC Spec Sheet System ── */
var QC_SPECS = {
  'BLACK PEPPER': {
    botanical: 'Piper nigrum L.',
    grade: 'TGSEB Tellicherry Garbled Extra Bold',
    hsn: '09041140',
    oil: '3.2 – 3.8 ml/100g (Min 3.0)',
    active: '5.8% – 6.4% Residual Piperine',
    moisture: 'Max 11.0%',
    extraneous: 'Max 0.2% (Clinically Graded)',
    density: '560 – 580 g/L',
    origin: 'Malabar Coast & Wayanad Highlands, Kerala',
    pkg: '40kg Food-Grade Multi-Wall Master Bags / 1kg Barrier Pouches'
  },
  'CLOVES': {
    botanical: 'Syzygium aromaticum',
    grade: 'Hand-Selected Grade A Whole Flower Buds',
    hsn: '09071010',
    oil: '17.0 – 19.5 ml/100g (High Eugenol)',
    active: 'Head Retention > 92%',
    moisture: 'Max 10.5%',
    extraneous: 'Max 0.4% (Stems & Dust Cleaned)',
    density: '540 – 560 g/L',
    origin: 'Selected Coastal & Island Plantations',
    pkg: '25kg & 40kg Moisture-Barrier Consignments'
  },
  'DRY GINGER (WHOLE)': {
    botanical: 'Zingiber officinale Roscoe',
    grade: 'Unbleached Cochin Sun-Dried Whole Rhizome',
    hsn: '09101110',
    oil: '2.0 – 2.6 ml/100g',
    active: 'Zingiberene & Gingerol > 3.4%',
    moisture: 'Max 11.5%',
    extraneous: 'Max 0.5%',
    density: '380 – 420 g/L',
    origin: 'Central Kerala Lowland Plantations',
    pkg: '40kg Jute with Food-Grade Inner Liner'
  },
  'ANNACHIPOO': {
    botanical: 'Illicium verum Hook. f.',
    grade: 'Royal 8-Pointed Unbroken Whole Star',
    hsn: '090931',
    oil: '8.5 – 10.0 ml/100g (Trans-Anethole)',
    active: 'Broken Pods < 3.5%',
    moisture: 'Max 10.0%',
    extraneous: 'Max 0.5%',
    density: '320 – 350 g/L',
    origin: 'Origin High-Elevation Orchards',
    pkg: '10kg / 25kg Rigid Corrugated Master Cases'
  },
  'CASSIA (KESIA)': {
    botanical: 'Cinnamomum cassia Blume',
    grade: 'Cleaned Whole Quill & Broken Bark Cuts',
    hsn: '09061190',
    oil: '1.8 – 2.4 ml/100g (Cinnamaldehyde)',
    active: 'Thick-Bark High Volatile Cut',
    moisture: 'Max 12.0%',
    extraneous: 'Max 0.5%',
    density: '420 – 450 g/L',
    origin: 'Direct Grower Plantations',
    pkg: '25kg & 40kg Master Bales'
  },
  'CASHEWNUT': {
    botanical: 'Anacardium occidentale L.',
    grade: 'W320 First Quality Whole White Kernels',
    hsn: '080131',
    oil: 'Natural Moisture 4.2% – 4.8%',
    active: 'Kernel Count: 300–320 / lb',
    moisture: 'Max 5.0%',
    extraneous: 'Zero Impurities / Vacuum Packed',
    density: 'N/A (Uniform Whole Count)',
    origin: 'Kollam & Mangalore Processing Hubs',
    pkg: '20kg Vacuum-Flush Nitrogen Tins / Master Cartons'
  },
  'TURMERIC POWDER': {
    botanical: 'Curcuma longa L.',
    grade: 'High Curcumin Single-Estate Ground Powder',
    hsn: '09103030',
    oil: '3.5 – 4.2 ml/100g Essential Turmerones',
    active: 'Curcumin Content >= 5.0%',
    moisture: 'Max 10.0%',
    extraneous: '100% Pure Rhizome / Zero Starch Fillers',
    density: '520 – 550 g/L',
    origin: 'Salem & Erode Origin Belts',
    pkg: '25kg Multi-Wall Food Pouch Bags'
  }
};

window.openSpecSheet = function(skuName) {
  var key = (skuName || '').toUpperCase().trim();
  var spec = QC_SPECS[key] || {
    botanical: 'Single-Origin Culinary Specimen',
    grade: 'First Quality Food-Service Batch',
    hsn: '0904 / 0910 Series',
    oil: 'Standard Export Volatile Oil Threshold',
    active: 'Certified Active Essential Yield',
    moisture: 'Max 11.0% (Oven Tested)',
    extraneous: '< 0.5% Food Safety Tolerances',
    density: 'Graded Uniform Bulk Density',
    origin: 'South Indian Verified Plantations',
    pkg: '40kg Food-Grade Master Consignment Bags'
  };

  var existing = document.getElementById('specModalBackdrop');
  if (existing) existing.remove();

  var backdrop = document.createElement('div');
  backdrop.id = 'specModalBackdrop';
  backdrop.className = 'spec-modal-backdrop';
  backdrop.innerHTML = [
    '<div class="spec-modal">',
    '  <button class="rfq-modal-close" onclick="document.getElementById(\'specModalBackdrop\').remove()">&times;</button>',
    '  <div class="spec-modal-head">',
    '    <span class="harvest-origin-badge">Official Batch Specification</span>',
    '    <div class="spec-modal-sku" style="margin-top:6px">' + key + '</div>',
    '    <div class="spec-modal-botanical">' + spec.botanical + '</div>',
    '  </div>',
    '  <table class="spec-table">',
    '    <tbody>',
    '      <tr><th>HSN Code</th><td>' + spec.hsn + '</td></tr>',
    '      <tr><th>Commercial Grade</th><td>' + spec.grade + '</td></tr>',
    '      <tr><th>Volatile Oil Yield</th><td>' + spec.oil + '</td></tr>',
    '      <tr><th>Active Potency</th><td>' + spec.active + '</td></tr>',
    '      <tr><th>Moisture Threshold</th><td>' + spec.moisture + '</td></tr>',
    '      <tr><th>Extraneous Matter</th><td>' + spec.extraneous + '</td></tr>',
    '      <tr><th>Bulk Density</th><td>' + (spec.density || 'Standard Graded') + '</td></tr>',
    '      <tr><th>Origin Region</th><td>' + spec.origin + '</td></tr>',
    '      <tr><th>Standard Packaging</th><td>' + spec.pkg + '</td></tr>',
    '    </tbody>',
    '  </table>',
    '  <div class="spec-coa-note">',
    '    <strong>Laboratory Protocol:</strong> Every batch is tested under FSSAI compliance for moisture equilibrium, microbiology, and volatile oil retention. Full Certificates of Analysis (COA) are dispatched with master consignments.',
    '  </div>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap">',
    '    <a href="https://wa.me/918592832871?text=' + encodeURIComponent('Hello KTA Trade Desk, I am requesting the full Laboratory Certificate of Analysis (COA) and pricing for ' + key + ' (HSN: ' + spec.hsn + ').') + '" target="_blank" rel="noopener" class="rfq-submit-btn" style="flex:1">Request Batch COA &amp; Rates ↗</a>',
    '  </div>',
    '</div>'
  ].join('');

  document.body.appendChild(backdrop);
  setTimeout(function(){ backdrop.classList.add('is-open'); }, 10);

  backdrop.addEventListener('click', function(e){
    if(e.target === backdrop) backdrop.remove();
  });
};

/* ── 11. One-Tap Institutional RFQ Modal ── */
window.openFastRfq = function(skuName, hsn, origin) {
  var existing = document.getElementById('rfqModalBackdrop');
  if (existing) existing.remove();

  var selectedWeight = '100kg (Wholesale MOQ)';

  var backdrop = document.createElement('div');
  backdrop.id = 'rfqModalBackdrop';
  backdrop.className = 'rfq-modal-backdrop';
  backdrop.innerHTML = [
    '<div class="rfq-modal">',
    '  <button class="rfq-modal-close" onclick="document.getElementById(\'rfqModalBackdrop\').remove()">&times;</button>',
    '  <div class="harvest-origin-badge">Institutional Quotation Desk</div>',
    '  <h3 class="rfq-modal-title" style="margin-top:6px">Commercial Lot RFQ</h3>',
    '  <div class="rfq-modal-sku">' + (skuName || 'Single-Origin Variety') + (hsn ? ' · HSN: ' + hsn : '') + '</div>',
    '  <div class="rfq-option-label">1. Select Target Volume</div>',
    '  <div class="rfq-weights-grid" id="rfqWeightButtons">',
    '    <button type="button" class="rfq-weight-btn active" data-val="100kg (Wholesale MOQ)">100kg</button>',
    '    <button type="button" class="rfq-weight-btn" data-val="250kg">250kg</button>',
    '    <button type="button" class="rfq-weight-btn" data-val="500kg">500kg</button>',
    '    <button type="button" class="rfq-weight-btn" data-val="1 Ton+ Lot">1 Ton+</button>',
    '  </div>',
    '  <div class="rfq-option-label">2. Master Packaging Unit</div>',
    '  <select id="rfqPkgSelect" class="rfq-pkg-select">',
    '    <option value="40kg Master Food-Grade Bags (Standard)">40kg Master Food-Grade Bags (Standard)</option>',
    '    <option value="25kg Multi-Wall Food Pouches">25kg Multi-Wall Food Pouches</option>',
    '    <option value="Export Multi-Layer Moisture-Locked Consignment">Export Multi-Layer Moisture-Locked Consignment</option>',
    '  </select>',
    '  <div class="rfq-option-label">3. Destination Receiving Bay (City)</div>',
    '  <input type="text" id="rfqCityInput" class="rfq-city-input" placeholder="e.g. Chennai, Bengaluru, Hyderabad, Kochi">',
    '  <button type="button" class="rfq-submit-btn" id="rfqSendBtn">',
    '    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>',
    '    Generate WhatsApp Quote ↗',
    '  </button>',
    '</div>'
  ].join('');

  document.body.appendChild(backdrop);
  setTimeout(function(){ backdrop.classList.add('is-open'); }, 10);

  var btns = backdrop.querySelectorAll('.rfq-weight-btn');
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      selectedWeight = b.getAttribute('data-val');
    });
  });

  backdrop.querySelector('#rfqSendBtn').addEventListener('click', function(){
    var pkg = backdrop.querySelector('#rfqPkgSelect').value;
    var city = backdrop.querySelector('#rfqCityInput').value.trim() || 'South India Delivery Bay';
    var msg = "Hello KTA Trade Desk, I am requesting a formal wholesale quotation for: *" + (skuName || 'Spices') + "*\n" +
              "• Target Volume: " + selectedWeight + "\n" +
              "• Packaging: " + pkg + "\n" +
              "• Delivery Destination: " + city + "\n" +
              "Please share active lot batch availability and commercial tiered rates.";
    var waUrl = "https://wa.me/918592832871?text=" + encodeURIComponent(msg);
    window.open(waUrl, '_blank');
    backdrop.remove();
  });

  backdrop.addEventListener('click', function(e){
    if(e.target === backdrop) backdrop.remove();
  });
};

/* ── Flush Reservation Modal Handlers ── */
window.openFlushReservation = function(spiceName, seasonWindow) {
  var modal = document.getElementById('flushReserveModal');
  if (!modal) return;
  var varInp = document.getElementById('flushVarietyInput');
  var ssnInp = document.getElementById('flushSeasonInput');
  if (varInp) varInp.value = spiceName;
  if (ssnInp) ssnInp.value = seasonWindow || 'Upcoming Harvest Window';
  modal.style.display = 'flex';
};

window.closeFlushReservation = function() {
  var modal = document.getElementById('flushReserveModal');
  if (modal) modal.style.display = 'none';
};

window.selectFlushWeight = function(weightStr, btn) {
  var hidden = document.getElementById('flushSelectedWeight');
  if (hidden) hidden.value = weightStr;
  var parent = btn.parentElement;
  if (parent) {
    parent.querySelectorAll('.rfq-chip').forEach(function(c){ c.classList.remove('active'); });
    btn.classList.add('active');
  }
};

window.submitFlushReservation = function() {
  var variety = document.getElementById('flushVarietyInput') ? document.getElementById('flushVarietyInput').value : 'Origin Spices';
  var season = document.getElementById('flushSeasonInput') ? document.getElementById('flushSeasonInput').value : 'Upcoming Flush';
  var weight = document.getElementById('flushSelectedWeight') ? document.getElementById('flushSelectedWeight').value : '100kg (3 Master Bags)';
  var hotel = document.getElementById('flushHotelName') ? document.getElementById('flushHotelName').value.trim() : '';
  
  var hotelText = hotel ? " for *" + hotel + "*" : "";
  var msg = "Hello KTA Trade Desk, I would like to reserve upcoming direct harvest allocation" + hotelText + ":\n" +
            "• Variety: *" + variety + "*\n" +
            "• Harvest Window: " + season + "\n" +
            "• Target Volume: " + weight + "\n" +
            "Please record our priority allocation and notify our purchase desk as soon as initial farm lots complete sun-curing.";
  
  var waUrl = "https://wa.me/918592832871?text=" + encodeURIComponent(msg);
  window.open(waUrl, '_blank');
  window.closeFlushReservation();
};

/* ── Chef Welcome Box Free Announcement Modal Controller ── */
(function(){
  function initChefWelcomeModal() {
    var modal = document.getElementById('chefWelcomeModal');
    var closeBtn = document.getElementById('chefPopupCloseBtn');
    var floatTrigger = document.getElementById('chefFloatTrigger');
    var claimBtn = document.getElementById('claimBoxBtn');

    if (!modal) return;

    function openModal() {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem('kta_chef_popup_seen', 'true');
      } catch (e) {}
    }

    // Smooth auto trigger on page load (600ms)
    setTimeout(function(){
      if (!modal.classList.contains('is-active')) {
        openModal();
      }
    }, 600);

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e){
        e.preventDefault();
        closeModal();
      });
    }

    modal.addEventListener('click', function(e){
      if (e.target === modal) {
        closeModal();
      }
    });

    if (floatTrigger) {
      floatTrigger.addEventListener('click', function(e){
        e.preventDefault();
        openModal();
      });
    }

    if (claimBtn) {
      claimBtn.addEventListener('click', function(){
        closeModal();
      });
    }

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Expose global opener
    window.openChefWelcomeBoxModal = openModal;
    window.closeChefWelcomeBoxModal = closeModal;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChefWelcomeModal);
  } else {
    initChefWelcomeModal();
  }
})();



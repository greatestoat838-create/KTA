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
    // Whole Spices, Herbs & Powders
    { title: 'Green Cardamom (Alleppey 8mm+ Extra Bold)', cat: 'Whole Spices', page: 'catalogue.html?search=green+cardamom', desc: 'ഏലക്ക Elakka ஏலக்காய் Elakkai ഏലക്കി Yakki ഏലക്കായലു Yelakulu छोटी इलायची Chhoti Elaichi elaichi' },
    { title: 'Cardamom Powder (Pure Ground)', cat: 'Ground Spices', page: 'catalogue.html?search=cardamom+powder', desc: 'ഏലക്ക പൊടി Elakka Podi ஏலக்காய் பொடி Elakkai Podi ഏലക്കി പുഡി Yakki Pudi ഏലക്ക കുണ്ട Yelakula Podi इलायची पाउडर Elaichi Powder' },
    { title: 'Black Cardamom (Large Pods)', cat: 'Whole Spices', page: 'catalogue.html?search=black+cardamom', desc: 'വലിയ ഏലക്ക Valiya Elakka கருப்பு ஏலக்காய் Karuppu Elakkai കപ്പു ഏലക്കി Kappu Yakki നല്ലാ ഏലക്കായലു Nalla Yelakulu बड़ी इलायची Badi Elaichi' },
    { title: 'White Cardamom (Selected Grade)', cat: 'Whole Spices', page: 'catalogue.html?search=white+cardamom', desc: 'വെള്ള ഏലക്ക Vella Elakka வெள்ளை ஏலக்காய் Vellai Elakkai ബെള്ള ഏലക്കി Bella Yakki தெல்ல ഏലക്കായാലു Tella Yelakulu सफेद इलायची Safed Elaichi' },
    { title: 'Tellicherry Black Pepper (TGSEB Grade)', cat: 'Whole Spices', page: 'catalogue.html?search=black+pepper', desc: 'കുരുമുളക് Kurumulaku குறுமிளகு மிளகு Milagu കരിമെണസു Kari Menasu മിരിയാലു Miriyalu काली मिर्च Kali Mirch' },
    { title: 'Pepper Powder (Ground Black Pepper)', cat: 'Ground Spices', page: 'catalogue.html?search=pepper+powder', desc: 'കുരുമുളക് പൊടി Kurumulaku Podi மிளகு தூள் Milagu Thool മെണസിന പുഡി Menasina Pudi മിരിയാല പൊടി Miriyala Podi काली मिर्च पाउडर Kali Mirch Powder' },
    { title: 'White Pepper Powder (Ground White Pepper)', cat: 'Ground Spices', page: 'catalogue.html?search=white+pepper', desc: 'വെള്ള കുരുമുളക് പൊടി Vella Kurumulaku Podi வெள்ளை மிளகு தூள் Vellai Milagu Thool ബെള്ള മെണസിന പുഡി Bella Menasina Pudi தெல்ல മിരിയാല പൊടി Tella Miriyala Podi सफेद मिर्च पाउडर Safed Mirch' },
    { title: 'Star Anise (Annachipoo — Royal 8-Pointed)', cat: 'Whole Spices', page: 'catalogue.html?search=annachipoo', desc: 'തക്കോലം Thakkolam அன்னாசிப்பூ Annashipoo അനസൂവൂ Anasavu അനാസ പൂവു Anasa Poovu चक्र फूल Chakra Phool' },
    { title: 'Biryani Bay Leaf (Selected Aromatic)', cat: 'Whole Spices', page: 'catalogue.html?search=biryani+leaf', desc: 'കറുവപ്പട്ട ഇല ബിരിയാണി ഇല Biryani Ila பிரியாணி இலை Biryani Ilai ബിരിയാണി എലെ Biryani Ele ബിരിയാണി ആകു Biryani Aaku तेज पत्ता Tej Patta' },
    { title: 'Cassia Bark (Kesia Premium Lot)', cat: 'Whole Spices', page: 'catalogue.html?search=cassia', desc: 'കറുവാപ്പട്ട Karuvapatta லவங்கம் Lavangam ദാചിന്നി Dachinni ദാവാചിന്ന പക്ക Lavanga Patta चीनी दालचीनी Kassia' },
    { title: 'Ceylon Cinnamon True Quills (Pattai)', cat: 'Whole Spices', page: 'catalogue.html?search=cinnamon', desc: 'എലവംഗം പട്ട Patta பட்டை Pattai ചക്കെ Chakke ദാൽചിനി Dalchini दालचीनी Dalchini' },
    { title: 'Zanzibar Whole Cloves (Selected Grade A)', cat: 'Whole Spices', page: 'catalogue.html?search=cloves', desc: 'ഗ്രാമ്പൂ കരയാമ്പൂ Gramboo கிராம்பு Krambu ലവംഗ Lavanga ലവംഗാലു Lavangalu लौंग Laung' },
    { title: 'Coriander Whole Seeds', cat: 'Whole Spices', page: 'catalogue.html?search=coriander+whole', desc: 'മല്ലി കൊത്തമല്ലി Malli கொத்தமல்லி Kothamalli കൊത്തുമ്പരി Kothambari ധനീയാലു Dhaniyalu साबुत धनिया Sabut Dhaniya' },
    { title: 'Coriander Powder', cat: 'Ground Spices', page: 'catalogue.html?search=coriander+powder', desc: 'മല്ലിപ്പൊടി Malli Podi മല്ലിത്തൂൾ Malli Thool കൊത്തുമ്പരി പുഡി Kothambari Pudi ധനിയാല പൊടി Dhaniyala Podi धनिया पाउडर Dhaniya Powder' },
    { title: 'Dry Ginger (Sun-Dried Cochin Whole)', cat: 'Whole Spices', page: 'catalogue.html?search=dry+ginger', desc: 'ചുക്ക് Chukku சுக்கு Sukku അള്ളെ ശൊന്തി Shonthi ശൊണ്ടി Shonthi सोंठ Sonth' },
    { title: 'Dry Ginger Powder (Sonth / Chukku Podi)', cat: 'Ground Spices', page: 'catalogue.html?search=dry+ginger+powder', desc: 'ചുക്കുപൊടി Chukku Podi சுக்கு தூள் Sukku Thool ശൊന്തി പുഡി Shonthi Pudi ശൊണ്ടി പൊടി Shonthi Podi सोंठ पाउडर Sonth Powder' },
    { title: 'Guntur S4 Hot Red Chillies', cat: 'Whole Spices', page: 'catalogue.html?search=guntur', desc: 'ഗുണ്ടൂർ മുളക് Guntur Mulaku குண்டூர் மிளகாய் Guntur Milagai ഗുണ്ടൂറു മെണസിനകായി Guntur Menasinakai ഗുണ്ടൂറു മിരപകായ Guntur Mirapakaya गुंटूर मिर्च Guntur Mirch' },
    { title: 'Kashmiri Dried Chillies (High ASTA Color)', cat: 'Whole Spices', page: 'catalogue.html?search=kashmiri', desc: 'കാശ്മീരി മുളക് Kashmiri Mulaku காஷ்மீரி மிளகாய் Kashmiri Milagai കശ്മീരി മെണസിനകായി Kashmiri Menasinakai കാശ്മീരി മിരപകായ Kashmiri Mirapakaya कश्मीरी मिर्च Kashmiri Mirch' },
    { title: 'Jaifal (Whole Nutmeg with Kernel)', cat: 'Whole Spices', page: 'catalogue.html?search=jaifal', desc: 'ജാതിക്ക Jathikka ஜாதிக்காய் Jadhikkai ജാജികായി Jajikai ജാജികായ Jajikaya जायफल Jaiphal' },
    { title: 'Javantri (Selected Mace Blades)', cat: 'Whole Spices', page: 'catalogue.html?search=javantri', desc: 'ജാതിപത്രി Jathipathri ஜாதிபத்ரி Jadhipathri ജാതിപത്രി Jathipathri ജാതിപത്രി Jathipathri जावित्री Javitri' },
    { title: 'Jeera (Whole Cumin Seeds)', cat: 'Whole Spices', page: 'catalogue.html?search=jeera+whole', desc: 'ജീരകം Jeerakam சீரகம் Seeragam ജീരിഗെ Jeerige ജീല കർര Jeelakarra जीरा Zeera' },
    { title: 'Jeera Powder (Fresh Ground Cumin)', cat: 'Ground Spices', page: 'catalogue.html?search=jeera+powder', desc: 'ജീരകപ്പൊടി Jeeraka Podi சீரகத் தூள் Seeraga Thool ജീരിഗെ പുഡി Jeerige Pudi ജീല കർര പൊടി Jeelakarra Podi जीरा पाउडर Zeera Powder' },
    { title: 'Valyajeerakam (Shahi Jeera / Black Cumin)', cat: 'Whole Spices', page: 'catalogue.html?search=valyajeerakam', desc: 'വലിയ ജീരകം Valiya Jeerakam ஷாஹി சீரகம் Shahi Seeragam ഷാഹി ജീരിഗെ Shahi Jeerige ഷാഹി ജീല കർര Shahi Jeelakarra शाही जीरा काला जीरा Shahi Jeera' },
    { title: 'Fennel Seeds (Sombu Bold Green)', cat: 'Whole Spices', page: 'catalogue.html?search=sombu', desc: 'പെരുഞ്ചീരകം Perumjeerakam சோம்பு Sombu ബഡ്ഡീശേപ്പു Baddisheppu സോമ്പു Sombu सौंफ Saunf' },
    { title: 'Kalpasi (Dagad Phool / Stone Flower)', cat: 'Whole Spices', page: 'catalogue.html?search=kalpasi', desc: 'കൽപ്പാസി Kalpasi கல்பாசி Kalpasi കല്ലൂഹൂവു Kalluhuvu രാതി പൂവു Rathi Poovu दगड़ फूल पत्थर के फूल Dagad Phool' },
    { title: 'Kasuri Methi (Sun-Dried Fenugreek)', cat: 'Whole Spices', page: 'catalogue.html?search=kasuri+methi', desc: 'കസൂരി മേത്തി Kasuri Methi கசூரி மேதி Kasuri Methi കസൂരി മേതി Kasuri Methi കസൂരി മേതി Kasuri Methi कसूरी मेथी Kasuri Methi' },
    { title: 'Methi Seeds (Whole Fenugreek)', cat: 'Whole Spices', page: 'catalogue.html?search=methi', desc: 'ഉലുവ Uluva வெந்தயம் Venthayam മെന്ത്യ Menthya മന്തലു Menthulu मेथी दाना Methi Dana' },
    { title: 'Mustard Seeds (Black Mustard)', cat: 'Whole Spices', page: 'catalogue.html?search=mustard', desc: 'കടുക് Kadugu கடுகு Kadugu സാസിവെ Sasive ആവാലു Avalu राई सरसों Rai Sarson' },
    { title: 'Turmeric Powder (5%+ Curcumin Batch)', cat: 'Ground Spices', page: 'catalogue.html?search=turmeric', desc: 'മഞ്ഞൾപ്പൊടി Manjal Podi மஞ்சள் தூள் Manjal Thool അരശിന പുഡി Arishina Pudi പസുകു പൊടി Pasupu Podi हल्दी पाउडर Haldi Powder' },
    { title: 'Nigella (Black Seed / Kalonji)', cat: 'Whole Spices', page: 'catalogue.html?search=nigella', desc: 'കരിഞ്ചീരകം Karinjeerakam கருஞ்சீரகம் Karunjeeragam കരിജീരിഗെ Kari Jeerige നല്ലാ ജീല കർര Nalla Jeelakarra कलौंजी Kalonji' },
    { title: 'White Ellu (Triple Cleaned Sesame)', cat: 'Whole Spices', page: 'catalogue.html?search=white+ellu', desc: 'വെള്ള എള്ള് Vella Ellu வெள்ளை எள் Vellai Ellu ബെള്ള എള്ളു Bella Ellu തെല്ല നു്വലു Tella Nuvvulu सफेद तिल Safed Til' },
    { title: 'Chia Seeds (Raw Culinary Grade)', cat: 'Seeds', page: 'catalogue.html?search=chia', desc: 'ചിയാ വിത്തുകൾ Chia Seeds சியா விதைகள் Chia Seeds ചിയാ ബീജ Chia Beeja ചിയാ വിത്തുലു Chia Vittulu चिया बीज Chia Seeds' },
    { title: 'Sabja Seeds (Sweet Basil / Falooda)', cat: 'Seeds', page: 'catalogue.html?search=sabja', desc: 'കഞ്ചാവ് വിത്ത് കസകസാ വിത്ത് Sabja Seeds சப்ஜா விதை Sabja Vithai കമാ കസ്തൂരി Kama Kasthuri സബ്ജാ വിത്തുലു Sabja Vittulu सबजा तकमरिया Sabja Takmaria' },
    { title: 'Pumpkin Seeds (Hulled Pepitas)', cat: 'Seeds', page: 'catalogue.html?search=pumpkin+seeds', desc: 'മത്തങ്ങ വിത്തുകൾ Mathanga Vithukal பூசணி விதை Poosani Vithai കുമ്പളകായി ബീജ Kumbalakai Beeja ഗുമ്മഡികായ വിത്തുലു Gummadikaya Vittulu कद्दू के बीज Kaddu ke Beej' },
    { title: 'Sunflower Seeds (Hulled Raw)', cat: 'Seeds', page: 'catalogue.html?search=sunflower+seeds', desc: 'സൂര്യകാന്തി വിത്ത് Suryakanthi Vithu சூரியகாந்தி விதை Suriyaganthi Vithai സൂര്യകാന്തി ബീജ Suryakanthi Beeja പൊദ്ദു തിരുഗുഡു വിത്തുലു Poddu Thirugudu Vittulu सूरजमुखी के बीज Surajmukhi ke Beej' },
    { title: 'Watermelon Seeds (Dried Magaz Grade)', cat: 'Seeds', page: 'catalogue.html?search=watermelon+seeds', desc: 'തണ്ണിമത്തൻ വിത്ത് Thannimathan Vithu தர்பூசணி விதை Tharboosani Vithai കല്ലംഗഡി ബീജ Kallangadi Beeja പുച്ചകായ വിത്തുലു Puchakaya Vittulu मगज तरबूज के बीज Magaz Tarbooj ke Beej' },
    { title: 'Groundnut Seeds (Raw Peanut)', cat: 'Seeds', page: 'catalogue.html?search=groundnut', desc: 'നിലക്കടല Nilakkadala நிலக்கடலை வேர்க்கடலை Verkadalai നേലകടലെ Nelakadale വേരുശെനഗ കുള്ളു Verusenaga Gullu मूंगफली दाना Moongphali' },
    { title: 'Roasted Peanut (Dry Roast Crunchy)', cat: 'Dry Fruits', page: 'catalogue.html?search=roasted+peanut', desc: 'വറുത്ത നിലക്കടല Varutha Nilakkadala வறுத்த கடலை Varutha Kadalai ഹുരിദ കടലെ Hurida Kadale വേയിഞ്ചിന ശെനഗപപ്പു Veyinchina Senagapappu भुनी मूंगफली Bhuni Moongphali' },
    { title: 'Dry Rose Petals (Damascena Grade)', cat: 'Luxury Spices', page: 'catalogue.html?search=rose+petals', desc: 'ഉണങ്ങിയ റോസാപ്പൂ ഇതളുകൾ Unangiya Rosappoo Idhalukal காய்ந்த ரோஜா இதழ்கள் Kaintha Roja Idhazhgal ഉണഗിദ റോജ ഹൂവിന എസളുകളു Unagida Roja Esalu എണ്ഡിന റോജാ റെക്കലു Endina Roja Rekkalu सूखे गुलाब की पंखुड़ियां Sukhe Gulab ki Pattiyan' },
    { title: 'Kashmiri Mogra Saffron (Grade 1 Certified)', cat: 'Luxury Spices', page: 'catalogue.html?search=saffron', desc: 'കുങ്കുമപ്പൂവ് Kunkumappoov குங்குமப்பூ Kungumappoo കുങ്കുമ കേസരി Kunkuma Kesari കുങ്കുമ പൂവു Kunkuma Poovu केसर जाफरान Kesar Zafran' },

    // Premium Dry Fruits & Nuts
    { title: 'California & Gurbandi Badam (Almonds)', cat: 'Dry Fruits', page: 'catalogue.html?search=badam', desc: 'ബദാം Badam பாதாம் Badam ബാദാമി Badami ബാദാം പപ്പു Badam Pappu बादाम Badam' },
    { title: 'Jumbo Cashews W240 / W320 Premium', cat: 'Dry Fruits', page: 'catalogue.html?search=cashewnut', desc: 'അണ്ടിപ്പരിപ്പ് Andipparippu kashuvandi kasuvandi முந்திரி Munthiri mundhiri ഗോഡംബി Godambi ജീഡിപപ്പു Jeedi Pappu काजू Kaju' },
    { title: 'Dates (Premium Whole Arabian)', cat: 'Dry Fruits', page: 'catalogue.html?search=dates', desc: 'ഈന്തപ്പഴം Eenthappazham பேரீச்சம்பழம் Beerichampazham ഈരജൂറ Eerajoora ഖർജൂരപ്പണ്ടു Kharjoora Pandu खजूर Khajoor' },
    { title: 'Royal Anjeer (Dried Whole Figs)', cat: 'Dry Fruits', page: 'catalogue.html?search=fig', desc: 'അത്തിപ്പഴം Athippazham அத்திப்பழம் Athippazham അഞ്ചൂറ Anjoora മേഡിപണ്ടു Anjeeru Medi Pandu अंजीर Anjeer' },
    { title: 'Kismiss (Golden Seedless Raisins)', cat: 'Dry Fruits', page: 'catalogue.html?search=kismiss', desc: 'ഉണക്കമുന്തിരി Unakka Munthiri உலர் திராட்சை Ular Dhrakshai ഒണ ഡ്രാക്ഷി Ona Drakshi കിഷ്മിഷ് Kishmish Endo Draksha किशमिश Kishmish' },
    { title: 'Black Kismiss (Black Currant Raisins)', cat: 'Dry Fruits', page: 'catalogue.html?search=black+kismiss', desc: 'കറുത്ത മുന്തിരി Karutha Munthiri கருப்பு திராட்சை Karuppu Dhrakshai കപ്പു ഡ്രാക്ഷി Kappu Drakshi നല്ലാ ഡ്രാക്ഷ Nalla Draksha काली किशमिश Kali Kishmish' },
    { title: 'Special Kismiss (Long Green Raisins)', cat: 'Dry Fruits', page: 'catalogue.html?search=special+kismiss', desc: 'നീളൻ പച്ച മുന്തിരി Neelan Pacha Munthiri பச்சை திராட்சை Pachai Dhrakshai ഹസിരു ഡ്രാക്ഷി Hasiru Drakshi പച്ച ഡ്രാക്ഷ Pacha Draksha हरी लंबी किशमिश Hari Kishmish' },
    { title: 'Pistachios (Pista Roasted & Salted)', cat: 'Dry Fruits', page: 'catalogue.html?search=pista', desc: 'പിസ്ത Pista பிஸ்தா Pista പിസ്താ Pista പിസ്താ പപ്പു Pista Pappu पिस्ता Pista' },
    { title: 'Kashmiri & California Whole Walnuts', cat: 'Dry Fruits', page: 'catalogue.html?search=walnut', desc: 'വാൾനട്ട് Walnut அக்ரூட் Akroot അക്രോട്ടു Akrootu അക്രോട്ടു Akrootu अखरोट Akhrot' },

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
      '      <a href="wholesale.html" class="search-chip" data-query="Wholesale">Wholesale Supply (500kg+)</a>',
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
    // Cardamom (Green, White, Black, Ground)
    'elaka': ['cardamom', 'green cardamom'],
    'elakka': ['cardamom', 'green cardamom'],
    'elakkaya': ['cardamom', 'green cardamom'],
    'elakaya': ['cardamom', 'green cardamom'],
    'elakkai': ['cardamom', 'green cardamom'],
    'elakai': ['cardamom', 'green cardamom'],
    'yelakkai': ['cardamom', 'green cardamom'],
    'yelakai': ['cardamom', 'green cardamom'],
    'elam': ['cardamom', 'green cardamom'],
    'elaichi': ['cardamom', 'green cardamom'],
    'elachi': ['cardamom', 'green cardamom'],
    'hari elaichi': ['cardamom', 'green cardamom'],
    'choti elaichi': ['cardamom', 'green cardamom'],
    'chhoti elaichi': ['cardamom', 'green cardamom'],
    'yalukalu': ['cardamom', 'green cardamom'],
    'yelakulu': ['cardamom', 'green cardamom'],
    'elakulu': ['cardamom', 'green cardamom'],
    'elakki': ['cardamom', 'green cardamom'],
    'yalakki': ['cardamom', 'green cardamom'],
    'velchi': ['cardamom', 'green cardamom'],
    'hirvi velchi': ['cardamom', 'green cardamom'],
    'cardamom': ['cardamom'],
    'cardamon': ['cardamom'],
    'cardamum': ['cardamom'],
    'elathari': ['cardamom'],

    // White Cardamom & Black Cardamom
    'white cardamom': ['white cardamom'],
    'safed elaichi': ['white cardamom'],
    'velutha elakkaya': ['white cardamom'],
    'vellai elakkai': ['white cardamom'],
    'black cardamom': ['black cardamom'],
    'badi elaichi': ['black cardamom'],
    'moti elaichi': ['black cardamom'],
    'kali elaichi': ['black cardamom'],
    'periya elakkai': ['black cardamom'],
    'valiya elakkaya': ['black cardamom'],

    // Pepper (Tellicherry Black Pepper, Powder, White Pepper)
    'pepper': ['pepper', 'black pepper'],
    'black pepper': ['black pepper'],
    'tellicherry': ['black pepper'],
    'kurumulaku': ['black pepper', 'pepper'],
    'kurumolaku': ['black pepper', 'pepper'],
    'kurmulaku': ['black pepper', 'pepper'],
    'kurumilagu': ['black pepper', 'pepper'],
    'milagu': ['black pepper', 'pepper'],
    'karuppu milagu': ['black pepper', 'pepper'],
    'nallamulaku': ['black pepper', 'pepper'],
    'kali mirch': ['black pepper', 'pepper'],
    'kalimirch': ['black pepper', 'pepper'],
    'golki': ['black pepper', 'pepper'],
    'gol mirch': ['black pepper', 'pepper'],
    'miriyalu': ['black pepper', 'pepper'],
    'nalla miriyalu': ['black pepper', 'pepper'],
    'kari menasu': ['black pepper', 'pepper'],
    'kali miri': ['black pepper', 'pepper'],
    'golmorich': ['black pepper', 'pepper'],
    'white pepper': ['white pepper'],
    'safed mirch': ['white pepper'],
    'vellai milagu': ['white pepper'],
    'velutha kurumulaku': ['white pepper'],
    'tella miriyalu': ['white pepper'],
    'bili menasu': ['white pepper'],

    // Cumin (Jeera / Cumin Seeds / Cumin Powder / Shahi Jeera)
    'jeera': ['jeera', 'cumin'],
    'cumin': ['jeera', 'cumin'],
    'zeera': ['jeera', 'cumin'],
    'jira': ['jeera', 'cumin'],
    'jeere': ['jeera', 'cumin'],
    'jeerakam': ['jeera', 'cumin'],
    'nalla jeerakam': ['jeera', 'cumin'],
    'seeragam': ['jeera', 'cumin'],
    'seragam': ['jeera', 'cumin'],
    'jeeragam': ['jeera', 'cumin'],
    'jeelakarra': ['jeera', 'cumin'],
    'jilakarra': ['jeera', 'cumin'],
    'jeelakara': ['jeera', 'cumin'],
    'jilakara': ['jeera', 'cumin'],
    'jeerige': ['jeera', 'cumin'],
    'jirige': ['jeera', 'cumin'],
    'shahi jeera': ['valyajeerakam', 'shahi jeera'],
    'shahijeera': ['valyajeerakam', 'shahi jeera'],
    'valyajeerakam': ['valyajeerakam', 'shahi jeera'],
    'sahajira': ['valyajeerakam', 'shahi jeera'],

    // Fennel / Sombu / Saunf
    'fennel': ['fennel', 'sombu'],
    'sombu': ['fennel', 'sombu'],
    'saunf': ['fennel', 'sombu'],
    'sonf': ['fennel', 'sombu'],
    'perumjeerakam': ['fennel', 'sombu'],
    'perunjeerakam': ['fennel', 'sombu'],
    'perum jeerakam': ['fennel', 'sombu'],
    'perunjeeragam': ['fennel', 'sombu'],
    'sopu': ['fennel', 'sombu'],
    'sompu': ['fennel', 'sombu'],
    'badishep': ['fennel', 'sombu'],
    'mouri': ['fennel', 'sombu'],
    'variyali': ['fennel', 'sombu'],

    // Cloves / Grampoo / Laung / Krambu
    'cloves': ['cloves'],
    'clove': ['cloves'],
    'grampoo': ['cloves'],
    'krambu': ['cloves'],
    'kirambu': ['cloves'],
    'karambu': ['cloves'],
    'kramboo': ['cloves'],
    'lavangam': ['cloves'],
    'laung': ['cloves'],
    'lavang': ['cloves'],
    'long': ['cloves'],
    'lavangalu': ['cloves'],
    'lavanga': ['cloves'],
    'laving': ['cloves'],
    'lobongo': ['cloves'],

    // Cinnamon & Cassia
    'cinnamon': ['cinnamon', 'pattai'],
    'pattai': ['cinnamon', 'pattai'],
    'karuvapatta': ['cinnamon', 'pattai', 'cassia', 'kesia'],
    'karuvappatta': ['cinnamon', 'pattai'],
    'karuvapattai': ['cinnamon', 'pattai'],
    'dalchini': ['cinnamon', 'pattai', 'cassia', 'kesia'],
    'darchini': ['cinnamon', 'pattai'],
    'cassia': ['cassia', 'kesia'],
    'kesia': ['cassia', 'kesia'],
    'lavangapattai': ['cinnamon', 'pattai'],
    'dalchina chekka': ['cinnamon'],
    'chakke': ['cinnamon'],
    'taj': ['cinnamon', 'cassia'],

    // Star Anise
    'star anise': ['star anise', 'annachipoo'],
    'annachipoo': ['star anise', 'annachipoo'],
    'annasi poo': ['star anise', 'annachipoo'],
    'anasipoo': ['star anise', 'annachipoo'],
    'thakkolam': ['star anise', 'annachipoo'],
    'takkolam': ['star anise', 'annachipoo'],
    'thakolam': ['star anise', 'annachipoo'],
    'chakri phool': ['star anise', 'annachipoo'],
    'chakra phool': ['star anise', 'annachipoo'],
    'anasphal': ['star anise', 'annachipoo'],
    'anasa puvvu': ['star anise', 'annachipoo'],
    'biryani puvvu': ['star anise', 'annachipoo'],
    'chakra moggu': ['star anise', 'annachipoo'],

    // Turmeric
    'turmeric': ['turmeric'],
    'manjal': ['turmeric'],
    'manjal podi': ['turmeric'],
    'manjal thool': ['turmeric'],
    'haldi': ['turmeric'],
    'pasupu': ['turmeric'],
    'pasupu podi': ['turmeric'],
    'arishina': ['turmeric'],
    'halad': ['turmeric'],
    'holud': ['turmeric'],
    'curcumin': ['turmeric'],

    // Ginger / Sonth / Chukku
    'ginger': ['ginger', 'dry ginger'],
    'dry ginger': ['dry ginger', 'ginger'],
    'chukku': ['dry ginger', 'ginger'],
    'sukku': ['dry ginger', 'ginger'],
    'sonth': ['dry ginger', 'ginger'],
    'saunth': ['dry ginger', 'ginger'],
    'inji': ['dry ginger', 'ginger'],
    'adrak': ['dry ginger', 'ginger'],
    'allam': ['dry ginger', 'ginger'],
    'sonti': ['dry ginger', 'ginger'],
    'shunti': ['dry ginger', 'ginger'],
    'sunth': ['dry ginger', 'ginger'],
    'soont': ['dry ginger', 'ginger'],

    // Coriander
    'coriander': ['coriander'],
    'malli': ['coriander'],
    'kothamalli': ['coriander'],
    'dhaniya': ['coriander'],
    'dhania': ['coriander'],
    'dhaniyalu': ['coriander'],
    'kothambari': ['coriander'],
    'dhane': ['coriander'],

    // Nutmeg & Mace
    'nutmeg': ['jaifal', 'nutmeg'],
    'jaifal': ['jaifal', 'nutmeg'],
    'jaiphal': ['jaifal', 'nutmeg'],
    'jathikka': ['jaifal', 'nutmeg'],
    'jathika': ['jaifal', 'nutmeg'],
    'jathikai': ['jaifal', 'nutmeg'],
    'jadhikai': ['jaifal', 'nutmeg'],
    'jajikaya': ['jaifal', 'nutmeg'],
    'jajikayi': ['jaifal', 'nutmeg'],
    'mace': ['javantri', 'mace'],
    'javantri': ['javantri', 'mace'],
    'javitri': ['javantri', 'mace'],
    'jathipathri': ['javantri', 'mace'],
    'jathipoov': ['javantri', 'mace'],
    'vasavasi': ['javantri', 'mace'],
    'japatri': ['javantri', 'mace'],

    // Bay Leaf
    'bay leaf': ['biryani leaf', 'bay leaf'],
    'biryani leaf': ['biryani leaf', 'bay leaf'],
    'vayana ila': ['biryani leaf', 'bay leaf'],
    'biryani ila': ['biryani leaf', 'bay leaf'],
    'biryani ilai': ['biryani leaf', 'bay leaf'],
    'brinji ilai': ['biryani leaf', 'bay leaf'],
    'tejpatta': ['biryani leaf', 'bay leaf'],
    'tej patta': ['biryani leaf', 'bay leaf'],
    'biryani aaku': ['biryani leaf', 'bay leaf'],
    'tejpata': ['biryani leaf', 'bay leaf'],

    // Stone Flower / Kalpasi
    'kalpasi': ['kalpasi', 'stone flower'],
    'stone flower': ['kalpasi', 'stone flower'],
    'marappasi': ['kalpasi', 'stone flower'],
    'dagad phool': ['kalpasi', 'stone flower'],
    'patthar phool': ['kalpasi', 'stone flower'],
    'pathar phool': ['kalpasi', 'stone flower'],
    'kallupasi': ['kalpasi', 'stone flower'],

    // Fenugreek & Kasuri Methi
    'methi': ['methi', 'kasuri methi'],
    'fenugreek': ['methi', 'kasuri methi'],
    'kasuri methi': ['kasuri methi'],
    'kasoori methi': ['kasuri methi'],
    'uluva': ['methi', 'kasuri methi'],
    'vendhayam': ['methi', 'kasuri methi'],
    'menthulu': ['methi'],

    // Mustard
    'mustard': ['mustard'],
    'kaduku': ['mustard'],
    'kadugu': ['mustard'],
    'sarson': ['mustard'],
    'rai': ['mustard'],
    'aavalu': ['mustard'],
    'sasive': ['mustard'],

    // Chillies
    'chilli': ['chilly', 'guntur', 'kashmiri'],
    'chilly': ['chilly', 'guntur', 'kashmiri'],
    'red chilli': ['chilly', 'guntur', 'kashmiri'],
    'guntur': ['guntur'],
    'kashmiri': ['kashmiri'],
    'vattal mulaku': ['chilly', 'guntur', 'kashmiri'],
    'vara milagai': ['chilly', 'guntur', 'kashmiri'],
    'lal mirch': ['chilly', 'guntur', 'kashmiri'],
    'piriyan mulaku': ['kashmiri'],
    'degi mirch': ['kashmiri'],

    // Saffron
    'saffron': ['saffron'],
    'kunkumappoo': ['saffron'],
    'kumkumapoo': ['saffron'],
    'kungumapoo': ['saffron'],
    'kesar': ['saffron'],
    'zafran': ['saffron'],
    'jafran': ['saffron'],

    // Nigella & Sesame
    'nigella': ['nigella'],
    'kalonji': ['nigella'],
    'karinjeerakam': ['nigella'],
    'karunjeeragam': ['nigella'],
    'black seed': ['nigella'],
    'sesame': ['white ellu', 'sesame'],
    'ellu': ['white ellu', 'sesame'],
    'til': ['white ellu', 'sesame'],
    'safed til': ['white ellu', 'sesame'],
    'nuvvulu': ['white ellu', 'sesame'],

    // Seeds
    'chia': ['chia seeds'],
    'sabja': ['sabja seeds'],
    'falooda seeds': ['sabja seeds'],
    'pumpkin seeds': ['pumpkin seeds'],
    'pepitas': ['pumpkin seeds'],
    'sunflower seeds': ['sunflower seeds'],
    'watermelon seeds': ['watermelon seeds'],
    'magaz': ['watermelon seeds'],
    'groundnut': ['groundnut seeds', 'roasted peanut'],
    'peanut': ['groundnut seeds', 'roasted peanut'],
    'kappalandi': ['groundnut seeds', 'roasted peanut'],
    'verkadalai': ['groundnut seeds', 'roasted peanut'],
    'mungfali': ['groundnut seeds', 'roasted peanut'],
    'rose petals': ['dry rose petals'],

    // Dry Fruits & Nuts
    'cashew': ['cashewnut'],
    'cashewnut': ['cashewnut'],
    'kaju': ['cashewnut'],
    'kashuvandi': ['cashewnut'],
    'kasuvandi': ['cashewnut'],
    'andipparippu': ['cashewnut'],
    'mundhiri': ['cashewnut'],
    'munthiri': ['cashewnut'],
    'jeedipappu': ['cashewnut'],
    'godambi': ['cashewnut'],
    'badam': ['badam'],
    'baadam': ['badam'],
    'almond': ['badam'],
    'almonds': ['badam'],
    'badami': ['badam'],
    'pista': ['pista'],
    'pistha': ['pista'],
    'pistachio': ['pista'],
    'walnut': ['walnut'],
    'walnuts': ['walnut'],
    'akhrot': ['walnut'],
    'akrot': ['walnut'],
    'akroot': ['walnut'],
    'kismiss': ['kismiss', 'black kismiss', 'special kismiss'],
    'kismis': ['kismiss', 'black kismiss', 'special kismiss'],
    'kishmish': ['kismiss', 'black kismiss', 'special kismiss'],
    'raisins': ['kismiss', 'black kismiss', 'special kismiss'],
    'munthiringa': ['kismiss', 'black kismiss', 'special kismiss'],
    'unakka munthiri': ['kismiss', 'black kismiss', 'special kismiss'],
    'ular thiratchai': ['kismiss', 'black kismiss', 'special kismiss'],
    'dates': ['dates'],
    'khajoor': ['dates'],
    'khajur': ['dates'],
    'eenthapazham': ['dates'],
    'pericham pazham': ['dates'],
    'fig': ['fig'],
    'figs': ['fig'],
    'anjeer': ['fig'],
    'anjir': ['fig'],
    'athipazham': ['fig']
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
      '  <p class="scs-desc">Unlisted grades, specific grind specs, and farm-direct container-load consignments.</p>',
      '  <a href="' + waUrl + '" target="_blank" rel="noopener" class="scs-wa-btn">',
      '    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
      '    Request Custom Sourcing on WhatsApp',
      '  </a>',
      '</div>'
    ].join('');
  }

  function renderSearchResults(query, listEl, labelEl) {
    var q = (query || '').trim().toLowerCase();
    
    // Check multilingual aliases safely
    var searchTerms = [q];
    if (q && MULTILINGUAL_SYNONYMS[q]) {
      searchTerms = searchTerms.concat(MULTILINGUAL_SYNONYMS[q]);
    }
    if (q) {
      Object.keys(MULTILINGUAL_SYNONYMS).forEach(function(key) {
        if (key === q || key.startsWith(q) || q.startsWith(key)) {
          searchTerms = searchTerms.concat(MULTILINGUAL_SYNONYMS[key]);
        } else {
          var kWords = key.split(/\s+/);
          var qWords = q.split(/\s+/);
          var matchesWord = kWords.some(function(kw) {
            return qWords.some(function(qw) {
              return kw === qw || (qw.length >= 3 && kw.startsWith(qw));
            });
          });
          if (matchesWord) {
            searchTerms = searchTerms.concat(MULTILINGUAL_SYNONYMS[key]);
          }
        }
      });
    }

    var dedupTerms = [];
    searchTerms.forEach(function(t) {
      if (t && dedupTerms.indexOf(t) === -1) dedupTerms.push(t);
    });

    var matches = searchIndex.filter(function(item){
      if(!q) return true;
      var text = (item.title + ' ' + item.cat + ' ' + item.desc).toLowerCase();
      return dedupTerms.some(function(term){
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
      '        <div class="more-opt-title">Search Spices &amp; Products</div>',
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
      '        <div class="more-opt-title">Browse Full Products &amp; Spices</div>',
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
      '        <div class="more-opt-sub">Tiered lot quotes &amp; 500kg+ bulk supply</div>',
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
      '    <a href="https://wa.me/918592832871?text=Hello%20KTA%20Team%2C%20I%20would%20like%20to%20make%20an%20enquiry." target="_blank" rel="noopener" class="more-option-item">',
      '      <span class="more-opt-icon-wrap">',
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
      '      <a href="catalogue.html" class="quick-basket-btn btn-primary-green" style="font-size:12px;padding:9px 16px;">Browse Products →</a>',
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

/* ── 6. Horizontal Scroll Navigation (Fluid Native Momentum & Smooth Step Navigation) ── */
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
        return card ? (card.offsetWidth + 16) : Math.min(320, row.clientWidth * 0.8);
      }

      function stepScroll(dir) {
        var step = getStep();
        row.scrollBy({ left: dir * step, behavior: 'smooth' });
      }

      if(prev) {
        prev.onclick = function(e){ e.preventDefault(); stepScroll(-1); };
      }
      if(next) {
        next.onclick = function(e){ e.preventDefault(); stepScroll(1); };
      }
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    origin: 'Highland Specific',
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
    '      <tr><th>Harvest Terroir</th><td>' + (spec.origin || 'Highland Specific') + '</td></tr>',
    '      <tr><th>Standard Packaging</th><td>' + spec.pkg + '</td></tr>',
    '    </tbody>',
    '  </table>',
    '  <div class="spec-coa-note">',
    '    <strong>Laboratory Protocol:</strong> Every batch is tested under FSSAI compliance for moisture equilibrium, microbiology, and volatile oil retention. Full Certificates of Analysis (COA) are dispatched with master consignments.',
    '  </div>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap">',
    '    <a href="https://wa.me/918592832871?text=' + encodeURIComponent('Hello KTA Trade Desk, I am requesting the full Laboratory Certificate of Analysis (COA) and pricing for ' + key + ' (HSN: ' + spec.hsn + ').') + '" target="_blank" rel="noopener" class="rfq-submit-btn" style="flex:1">Request Batch COA &amp; Rates</a>',
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

  var selectedWeight = '500kg (Wholesale MOQ)';

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
    '    <button type="button" class="rfq-weight-btn active" data-val="500kg (Wholesale MOQ)">500kg</button>',
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
    '    Generate WhatsApp Quote',
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
  var weight = document.getElementById('flushSelectedWeight') ? document.getElementById('flushSelectedWeight').value : '500kg (13 Master Bags)';
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
    var p = window.location.pathname.toLowerCase();
    var filename = p.substring(Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\')) + 1);
    if (filename && filename !== 'index.html' && filename.includes('.html')) {
      return;
    }

    var modal = document.getElementById('chefWelcomeModal');

    // If modal not present in DOM, dynamically create and append it
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'chefWelcomeModal';
      modal.className = 'chef-popup-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'chefPopupTitle');
      modal.innerHTML = [
        '<div class="chef-popup-card">',
        '  <button class="chef-popup-close" id="chefPopupCloseBtn" aria-label="Close Modal">&times;</button>',
        '  <div class="chef-popup-visual">',
        '    <img src="images/ktachefboxnew.webp" alt="KTA Chef Discovery Welcome Sample Box" class="chef-popup-box-img" loading="eager">',
        '    <div class="chef-popup-stamp">COMPLIMENTARY</div>',
        '  </div>',
        '  <div class="chef-popup-content">',
        '    <div>',
        '      <span class="chef-popup-eyebrow">Executive Chef Program</span>',
        '      <h2 class="chef-popup-title" id="chefPopupTitle">Claim Your <span class="chef-popup-highlight">Free Chef Welcome Box</span>.</h2>',
        '      <p class="chef-popup-desc">Test our single-origin Highland spice harvests directly in your kitchen pass before placing commercial bulk contracts.</p>',
        '      <form id="chefInlineClaimForm" onsubmit="window.handleChefModalSubmit(event)" style="margin-top:10px">',
        '        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">',
        '          <input type="text" id="chefModalName" placeholder="Executive Chef Name *" required style="padding:9px 12px;border:1px solid #d5ddd0;border-radius:6px;font-size:12.5px;outline:none;background:#fdfdfd;font-family:inherit;width:100%;box-sizing:border-box;">',
        '          <input type="text" id="chefModalHotel" placeholder="Hotel / Establishment *" required style="padding:9px 12px;border:1px solid #d5ddd0;border-radius:6px;font-size:12.5px;outline:none;background:#fdfdfd;font-family:inherit;width:100%;box-sizing:border-box;">',
        '        </div>',
        '        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">',
        '          <input type="tel" id="chefModalPhone" placeholder="WhatsApp / Phone Number *" required style="padding:9px 12px;border:1px solid #d5ddd0;border-radius:6px;font-size:12.5px;outline:none;background:#fdfdfd;font-family:inherit;width:100%;box-sizing:border-box;">',
        '          <input type="email" id="chefModalEmail" placeholder="Official Email (Optional)" style="padding:9px 12px;border:1px solid #d5ddd0;border-radius:6px;font-size:12.5px;outline:none;background:#fdfdfd;font-family:inherit;width:100%;box-sizing:border-box;">',
        '        </div>',
        '        <div class="chef-popup-actions" style="margin-top:0">',
        '          <button type="submit" class="chef-popup-btn-primary" id="claimBoxSubmitBtn" style="border:none;cursor:pointer;flex:1;text-align:center;">Claim Free Box</button>',
        '          <a href="https://wa.me/918592832871?text=Hello%20KTA%20Trade%20Desk%2C%20I%20am%20an%20Executive%20Chef%20requesting%20the%20Free%20Chef%20Welcome%20Box%20to%20test." target="_blank" rel="noopener" class="chef-popup-btn-secondary">WhatsApp</a>',
        '        </div>',
        '      </form>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
      document.body.appendChild(modal);
    }

    // Always create and append the persistent floating trigger if not present
    var floatTrigger = document.getElementById('chefFloatTrigger');
    if (!floatTrigger) {
      floatTrigger = document.createElement('button');
      floatTrigger.id = 'chefFloatTrigger';
      floatTrigger.className = 'chef-float-trigger';
      floatTrigger.setAttribute('aria-label', 'Claim Free Chef Welcome Box');
      floatTrigger.innerHTML = [
        '<span class="chef-float-icon">',
        '  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>',
        '    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>',
        '    <line x1="12" y1="22.08" x2="12" y2="12"></line>',
        '  </svg>',
        '</span>',
        '<span class="chef-float-text">Chef Welcome Box · Free</span>',
        '<span class="chef-float-dot"></span>'
      ].join('');
      document.body.appendChild(floatTrigger);
    }

    var closeBtn = document.getElementById('chefPopupCloseBtn');
    var claimBtn = document.getElementById('claimBoxBtn');

    function openModal() {
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem('kta_chef_welcome_popup_seen', 'true');
      } catch (e) {}
    }

    // Auto open on initial entry ONLY on home page
    var isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    var hasSeen = false;
    try {
      hasSeen = sessionStorage.getItem('kta_chef_welcome_popup_seen') === 'true';
    } catch(e) {}

    if (isHome && !hasSeen) {
      setTimeout(function(){
        if (!modal.classList.contains('is-active')) {
          openModal();
        }
      }, 10000);
    }

    if (floatTrigger) {
      floatTrigger.onclick = function(e) {
        e.preventDefault();
        openModal();
      };
    }

    if (closeBtn) {
      closeBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      };
    }

    modal.onclick = function(e) {
      if (e.target === modal) {
        closeModal();
      }
    };

    if (claimBtn) {
      claimBtn.onclick = function() {
        closeModal();
      };
    }

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    window.openChefWelcomeBoxModal = openModal;
    window.closeChefWelcomeBoxModal = closeModal;

    window.handleChefModalSubmit = function(e) {
      e.preventDefault();
      var name = document.getElementById('chefModalName') ? document.getElementById('chefModalName').value.trim() : '';
      var hotel = document.getElementById('chefModalHotel') ? document.getElementById('chefModalHotel').value.trim() : '';
      var phone = document.getElementById('chefModalPhone') ? document.getElementById('chefModalPhone').value.trim() : '';
      var email = document.getElementById('chefModalEmail') ? document.getElementById('chefModalEmail').value.trim() : '';

      if (!name || !hotel || !phone) {
        alert('Please fill in your Name, Hotel Name, and Contact Phone Number.');
        return;
      }

      var formData = {
        managerName: name,
        hotelName: hotel,
        contactPhone: phone,
        email: email || 'Not Provided',
        volume: 'Chef Welcome Discovery Box (Zero-Cost Trial Kit)',
        message: 'Complimentary Chef Welcome Discovery Box Request from Universal Modal Popup',
        sourcePage: window.location.pathname || 'Universal Chef Modal'
      };

      if (window.submitKTAForm) {
        window.submitKTAForm(formData, {
          formName: 'Chef Welcome Discovery Box',
          successMsg: 'Thank you, Chef ' + name + '! Your Free Chef Welcome Box request for ' + hotel + ' has been registered. Our culinary trade desk will prepare and dispatch your sample kit to your kitchen pass.'
        });
      }

      closeModal();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChefWelcomeModal);
  } else {
    initChefWelcomeModal();
  }
})();

/* ══════════════════════════════════════════════════════════════
   UNIVERSAL LEAD DISPATCHER (GOOGLE SHEETS / EXCEL + INSTANT EMAIL)
   ══════════════════════════════════════════════════════════════ */
window.KTA_FORM_CONFIG = {
  // Live Google Apps Script Web App URL for Excel CRM logging & Zoho Mail alerts:
  webhookUrl: 'https://script.google.com/macros/s/AKfycbzZs4S4fiBna6BAwDufir68Zbwim67wdgl5rVNgadCD-ta6fALYyKSso5fxXDN2AkiXyA/exec',
  wholesaleEmail: 'wholesale@ktaspices.in',
  ordersEmail: 'orders@ktaspices.in',
  generalEmail: 'info@ktaspices.in'
};

window.submitKTAForm = function(formData, options) {
  options = options || {};
  var formName = options.formName || 'Website Inquiry';
  var successMsg = options.successMsg || 'Thank you! Your inquiry has been successfully received.';

  formData.formName = formName;
  formData.timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 1. Dispatch to Google Apps Script / Webhook if configured
  if (window.KTA_FORM_CONFIG && window.KTA_FORM_CONFIG.webhookUrl) {
    try {
      fetch(window.KTA_FORM_CONFIG.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(function(err) {
        console.warn('Form Webhook Notice:', err);
      });
    } catch(e) {
      console.warn('Fetch error:', e);
    }
  }

  // 2. Alert confirmation to the user
  alert(successMsg);
};

/* ── Universal Footer Newsletter / Chef Dispatches Handler ── */
window.handleFooterSubscribe = function(event) {
  if (event && event.preventDefault) event.preventDefault();
  var form = event ? (event.target || event.currentTarget) : null;
  if (!form) return;
  var input = form.querySelector('.ef-subscribe-input');
  var btn = form.querySelector('.ef-subscribe-btn');
  var email = input ? input.value.trim() : '';

  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    alert('Please enter a valid chef or commercial email address.');
    return;
  }

  // 1. Store in localStorage CRM cache
  try {
    var list = JSON.parse(localStorage.getItem('kta_chef_dispatches_subscribers') || '[]');
    list.push({ email: email, date: new Date().toISOString() });
    localStorage.setItem('kta_chef_dispatches_subscribers', JSON.stringify(list));
  } catch(err){}

  // 2. Dispatch to live Google Sheets CRM Webhook & Zoho Mail
  if (typeof window.submitKTAForm === 'function') {
    window.submitKTAForm({
      email: email,
      inquiryType: 'Chef Dispatches Newsletter Subscription',
      source: 'Footer Dispatch Bar'
    }, {
      formName: 'Chef Dispatches Newsletter',
      successMsg: 'Thank you, Chef. You are now enrolled in KTA Highland Dispatches & Seasonal Harvest Pre-Allocations.'
    });
  } else {
    alert('Thank you, Chef. You are now enrolled in KTA Highland Dispatches & Seasonal Harvest Pre-Allocations.');
  }

  // 3. UI feedback
  if (input) input.value = '';
  if (btn) {
    var oldText = btn.textContent;
    btn.textContent = 'ENROLLED';
    btn.style.color = '#a3c27e';
    setTimeout(function() {
      btn.textContent = oldText;
      btn.style.color = '';
    }, 4000);
  }
};

/* ═══════════════════════════════════════════════════════════
   KTA COMMERCIAL AI CONCIERGE ENGINE
   Intelligent Trade Assistant for Executive Chefs & Buyers
   ═══════════════════════════════════════════════════════════ */
(function initKTAAIConcierge() {
  function renderAIWidget() {
    if (document.getElementById('ktaAiWidget')) return;

    var widget = document.createElement('div');
    widget.id = 'ktaAiWidget';
    widget.className = 'kta-ai-widget';
    widget.innerHTML = [
      '<div class="kta-ai-box" id="ktaAiBox" role="dialog" aria-label="KTA AI Concierge">',
      '  <div class="kta-ai-header">',
      '    <div class="kta-ai-header-left">',
      '      <div class="kta-ai-avatar">',
      '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '          <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>',
      '          <rect x="3" y="8" width="18" height="12" rx="4"/>',
      '          <circle cx="8.5" cy="14" r="1.5" fill="currentColor"/>',
      '          <circle cx="15.5" cy="14" r="1.5" fill="currentColor"/>',
      '        </svg>',
      '      </div>',
      '      <div>',
      '        <div class="kta-ai-header-title">KTA AI Concierge</div>',
      '        <div class="kta-ai-header-subtitle">Live Institutional Desk</div>',
      '      </div>',
      '    </div>',
      '    <button type="button" class="kta-ai-close-btn" id="ktaAiClose" aria-label="Close Assistant">',
      '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      '    </button>',
      '  </div>',
      '  <div class="kta-ai-chips">',
      '    <button type="button" class="kta-ai-chip" onclick="handleKTAChip(\'Tellicherry Pepper Specs\')">Tellicherry Pepper</button>',
      '    <button type="button" class="kta-ai-chip" onclick="handleKTAChip(\'Cardamom 8mm+\')">8mm+ Cardamom</button>',
      '    <button type="button" class="kta-ai-chip" onclick="handleKTAChip(\'Wholesale Minimum Order (MOQ)\')">Wholesale MOQ (500kg)</button>',
      '    <button type="button" class="kta-ai-chip" onclick="handleKTAChip(\'Free 1kg Sample Kit\')">Free 1kg Sample Kit</button>',
      '    <button type="button" class="kta-ai-chip" onclick="handleKTAChip(\'Hotel Smart 24/7 Logistics\')">Hotel Smart 24/7</button>',
      '    <button type="button" class="kta-ai-chip" onclick="handleKTAChip(\'Speak with Human Broker\')">Speak with Broker</button>',
      '  </div>',
      '  <div class="kta-ai-messages" id="ktaAiMessages">',
      '    <div class="kta-msg bot">',
      '      <div class="kta-bubble">',
      '        <strong>Welcome to KTA Spices Commercial Concierge.</strong><br>',
      '        I am your AI assistant for single-origin harvest specifications, wholesale pricing lots, and chef sample requests. How may I assist your kitchen or procurement team today?',
      '      </div>',
      '    </div>',
      '    <div class="kta-typing" id="ktaAiTyping">',
      '      <div class="kta-typing-dot"></div>',
      '      <div class="kta-typing-dot"></div>',
      '      <div class="kta-typing-dot"></div>',
      '    </div>',
      '  </div>',
      '  <form class="kta-ai-input-wrap" id="ktaAiForm" onsubmit="handleKTAAISubmit(event)">',
      '    <input type="text" id="ktaAiInput" class="kta-ai-input" placeholder="Ask about spices, wholesale lots, QC specs..." autocomplete="off">',
      '    <button type="submit" class="kta-ai-send-btn" aria-label="Send Message">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
      '        <line x1="22" y1="2" x2="11" y2="13"></line>',
      '        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>',
      '      </svg>',
      '    </button>',
      '  </form>',
      '</div>',
      '<div class="kta-ai-trigger" id="ktaAiTrigger" aria-label="Open KTA AI Concierge">',
      '  <div class="kta-ai-trigger-icon">',
      '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
      '      <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>',
      '      <rect x="3" y="8" width="18" height="12" rx="4"/>',
      '      <circle cx="8.5" cy="14" r="1.5" fill="currentColor"/>',
      '      <circle cx="15.5" cy="14" r="1.5" fill="currentColor"/>',
      '    </svg>',
      '  </div>',
      '  <span class="kta-ai-trigger-text">KTA AI Concierge</span>',
      '  <span class="kta-ai-trigger-pulse"></span>',
      '</div>'
    ].join('');

    document.body.appendChild(widget);

    var trigger = document.getElementById('ktaAiTrigger');
    var box = document.getElementById('ktaAiBox');
    var closeBtn = document.getElementById('ktaAiClose');
    var input = document.getElementById('ktaAiInput');

    trigger.addEventListener('click', function() {
      var isOpen = box.classList.contains('active');
      if (!isOpen) {
        box.classList.add('active');
        setTimeout(function() { if (input) input.focus(); }, 150);
      } else {
        box.classList.remove('active');
      }
    });

    closeBtn.addEventListener('click', function() {
      box.classList.remove('active');
    });
  }

  window.handleKTAChip = function(query) {
    var input = document.getElementById('ktaAiInput');
    if (input) input.value = query;
    var form = document.getElementById('ktaAiForm');
    if (form) handleKTAAISubmit(new Event('submit'));
  };

  window.handleKTAAISubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var input = document.getElementById('ktaAiInput');
    var text = input ? input.value.trim() : '';
    if (!text) return;

    input.value = '';
    appendUserMsg(text);

    var typing = document.getElementById('ktaAiTyping');
    var msgs = document.getElementById('ktaAiMessages');
    if (typing) {
      typing.classList.add('active');
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
    }

    setTimeout(function() {
      if (typing) typing.classList.remove('active');
      var reply = generateAIReply(text);
      appendBotMsg(reply.html, reply.actions);
    }, 600);
  };

  function appendUserMsg(text) {
    var msgs = document.getElementById('ktaAiMessages');
    var div = document.createElement('div');
    div.className = 'kta-msg user';
    div.innerHTML = '<div class="kta-bubble">' + escapeHtml(text) + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function appendBotMsg(html, actions) {
    var msgs = document.getElementById('ktaAiMessages');
    var div = document.createElement('div');
    div.className = 'kta-msg bot';
    
    var actHtml = '';
    if (actions && actions.length > 0) {
      actHtml = '<div class="kta-msg-actions">' + actions.map(function(a) {
        return '<a href="' + a.href + '" class="kta-msg-btn' + (a.primary ? ' primary' : '') + '"' + (a.target ? ' target="' + a.target + '" rel="noopener"' : '') + '>' + a.label + '</a>';
      }).join('') + '</div>';
    }

    div.innerHTML = '<div class="kta-bubble">' + html + actHtml + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function generateAIReply(q) {
    var query = q.toLowerCase();

    // Pepper
    if (query.indexOf('pepper') !== -1 || query.indexOf('piperine') !== -1 || query.indexOf('tgseb') !== -1) {
      return {
        html: '<strong>Tellicherry Bold Black Pepper (TGSEB)</strong><br>' +
              '• <strong>Origin:</strong> Wayanad & Munnar Highlands (Western Ghats)<br>' +
              '• <strong>HSN Code:</strong> 09041140<br>' +
              '• <strong>Active Piperine:</strong> 5.5% – 6.2% Concentration<br>' +
              '• <strong>Available Grades:</strong> TGSEB Bold Whole, Coarse Milled, Pinheads, Lite Berries & Oleoresin Extract Grade.<br>' +
              '• <strong>Packaging:</strong> 1kg Chef Foil Packs and 40kg Master Food-Grade Bags.',
        actions: [
          { label: 'View in Catalogue', href: 'catalogue.html?q=pepper' },
          { label: 'Request 1kg Sample', href: 'partnership.html#chefWelcome', primary: true }
        ]
      };
    }

    // Cardamom
    if (query.indexOf('cardamom') !== -1 || query.indexOf('elaichi') !== -1 || query.indexOf('8mm') !== -1) {
      return {
        html: '<strong>Alleppey Green Cardamom (8mm+ Extra Bold)</strong><br>' +
              '• <strong>Origin:</strong> Cardamom Hills, Idukki, Kerala<br>' +
              '• <strong>HSN Code:</strong> 09083140<br>' +
              '• <strong>Specifications:</strong> 8mm+ uniform pod diameter, high volatile essential oil density, zero artificial color dye.<br>' +
              '• <strong>Packaging:</strong> 1kg Aroma-Sealed Kitchen Tins & 25kg/40kg Bulk Bags.',
        actions: [
          { label: 'View Cardamom Lots', href: 'catalogue.html?q=cardamom' },
          { label: 'WhatsApp Instant Quote', href: 'https://wa.me/918592832871?text=Hello%20KTA%20Trade%20Desk%2C%20please%20share%20current%208mm%20Cardamom%20lot%20rates.', target: '_blank', primary: true }
        ]
      };
    }

    // Turmeric
    if (query.indexOf('turmeric') !== -1 || query.indexOf('curcumin') !== -1 || query.indexOf('haldi') !== -1) {
      return {
        html: '<strong>Salem Golden Turmeric Powder (5.2%+ Curcumin)</strong><br>' +
              '• <strong>Origin:</strong> Salem Terroir (Tamil Nadu)<br>' +
              '• <strong>HSN Code:</strong> 09103030<br>' +
              '• <strong>Quality Assurance:</strong> Verified 5.2%+ active curcumin density. Guaranteed zero lead chromate, zero synthetic dye, and zero starch filler.',
        actions: [
          { label: 'Explore Turmeric Lots', href: 'catalogue.html?q=turmeric' },
          { label: 'Request Lab Spec Sheet', href: 'wholesale.html#qc', primary: true }
        ]
      };
    }

    // Wholesale / Bulk / MOQ
    if (query.indexOf('wholesale') !== -1 || query.indexOf('bulk') !== -1 || query.indexOf('moq') !== -1 || query.indexOf('500kg') !== -1 || query.indexOf('price') !== -1) {
      return {
        html: '<strong>KTA Institutional Wholesale Procurement</strong><br>' +
              '• <strong>Minimum Consignment (MOQ):</strong> 500kg total volume across varieties.<br>' +
              '• <strong>Master Packaging:</strong> 40kg moisture-locked food-grade bags on shrink-wrapped pallets.<br>' +
              '• <strong>Freight & Logistics:</strong> Direct dispatch across South India (Chennai, Bangalore, Hyderabad, Kochi, Coimbatore).',
        actions: [
          { label: 'Open Wholesale Portal', href: 'wholesale.html', primary: true },
          { label: 'Generate Pro-Forma Invoice', href: 'wholesale.html#proforma' }
        ]
      };
    }

    // Sample Kit / Discovery Box
    if (query.indexOf('sample') !== -1 || query.indexOf('discovery') !== -1 || query.indexOf('tray') !== -1 || query.indexOf('free') !== -1 || query.indexOf('trial') !== -1) {
      return {
        html: '<strong>KTA Chef Discovery Tray (Free 1kg Sample Kit)</strong><br>' +
              'We supply certified 1kg full-size trial packs of our single-origin spices directly to Executive Chefs, F&B Directors, and Hotel Purchase Managers for sensory and kitchen line trials with zero obligation.',
        actions: [
          { label: 'Request Discovery Tray', href: 'partnership.html#chefWelcome', primary: true },
          { label: 'WhatsApp Concierge', href: 'https://wa.me/918592832871?text=Hello%20KTA%2C%20I%20would%20like%20to%20request%20a%20Chef%20Sample%20Discovery%20Kit.', target: '_blank' }
        ]
      };
    }

    // Hotel Smart / Logistics
    if (query.indexOf('hotel') !== -1 || query.indexOf('smart') !== -1 || query.indexOf('logistics') !== -1 || query.indexOf('delivery') !== -1 || query.indexOf('dispatch') !== -1) {
      return {
        html: '<strong>Hotel Smart 24/7 Procurement Outsourcing</strong><br>' +
              'A zero-downtime spice supply system for luxury hotel chains, multi-outlet restaurants, and industrial kitchens. Standing orders are fulfilled on automated restock cadences with rapid dispatch.',
        actions: [
          { label: 'Hotel Smart Overview', href: 'hotel-smart.html', primary: true },
          { label: 'Register Kitchen', href: 'partnership.html#registerKitchen' }
        ]
      };
    }

    // Human / Broker / Call / Contact
    if (query.indexOf('human') !== -1 || query.indexOf('broker') !== -1 || query.indexOf('call') !== -1 || query.indexOf('phone') !== -1 || query.indexOf('whatsapp') !== -1 || query.indexOf('contact') !== -1) {
      return {
        html: '<strong>Connect Directly with KTA Commercial Trade Desk:</strong><br>' +
              '• <strong>Hotline:</strong> +91 85928 32871<br>' +
              '• <strong>WhatsApp:</strong> wa.me/918592832871<br>' +
              '• <strong>Active Hours:</strong> Monday – Sunday, 8:00 AM – 8:00 PM',
        actions: [
          { label: 'Call Desk (+91 85928 32871)', href: 'tel:+918592832871', primary: true },
          { label: 'Chat on WhatsApp', href: 'https://wa.me/918592832871', target: '_blank' }
        ]
      };
    }

    // Default Fallback
    return {
      html: 'I can assist you with single-origin spice specifications (Tellicherry Pepper, Alleppey Cardamom, Salem Turmeric, Ginger, Cloves, Badam), wholesale master lot pricing (500kg+ MOQ), free 1kg Chef Discovery Kits, or connecting directly with our commercial brokers.',
      actions: [
        { label: 'Explore Products', href: 'catalogue.html' },
        { label: 'Wholesale Supply', href: 'wholesale.html' },
        { label: 'Connect on WhatsApp', href: 'https://wa.me/918592832871', target: '_blank', primary: true }
      ]
    };
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAIWidget);
  } else {
    renderAIWidget();
  }
})();





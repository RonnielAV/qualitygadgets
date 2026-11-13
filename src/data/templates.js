// Templates, presets, and constants for Eliotte MUA

export const BUSINESS_INFO = {
  name: "Eliotte Casimiro",
  brandName: "Eliotte MUA",
  role: "Makeup Artist",
  phone: "(849) 220-9464",
  email: "eliottecasimiro129@gmail.com",
  instagram: "@ELIOTTEMUA",
  bank: "Banco Popular Dominicano (BPD)",
  accountType: "Cta. Corriente en pesos",
  accountNumber: "BPD 814-307880",
  idCard: "031-0422823-8",
  notes: "Para separar la fecha, debe ser efectuado el pago del 50% del total de los servicios solicitados.",
  notesInvoice: "El pago puede ser efectuado a la cuenta corriente en pesos del BPD 814-307880 | ced 031-0422823-8 a nombre de Eliotte Casimiro."
};

// 19 Curated Font Themes - Haute Couture, Bridal & Editorial Typography
export const FONT_THEMES = [
  {
    id: "canva_caveat",
    name: "Caligrafía Canva Oficial (Caveat)",
    subtitle: "Trazos idénticos a los artes originales de Eliotte MUA",
    fontFamily: "'Caveat', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Canva Oficial",
    isCursive: true,
    letterSpacing: "0.02em",
  },
  {
    id: "cinzel_couture",
    name: "Cinzel Imperial (Clásico Romano)",
    subtitle: "Mayúsculas esculpidas en piedra, solemnes, nítidas y simétricas",
    fontFamily: "'Cinzel', serif",
    secondaryFontFamily: "'Cinzel', serif",
    category: "Serif",
    badge: "Imperial",
    isCursive: false,
    letterSpacing: "0.06em",
  },
  {
    id: "bodoni_moda",
    name: "Bodoni Moda (Alta Costura Vogue)",
    subtitle: "El estándar de oro de portadas de moda italiana y belleza",
    fontFamily: "'Bodoni Moda', serif",
    secondaryFontFamily: "'Bodoni Moda', serif",
    category: "Serif",
    badge: "Haute Couture",
    isCursive: false,
    letterSpacing: "0.04em",
  },
  {
    id: "editorial_playfair",
    name: "Editorial Vogue (Playfair Display)",
    subtitle: "Serif clásico refinado con porte aristocrático y equilibrado",
    fontFamily: "'Playfair Display', serif",
    secondaryFontFamily: "'Playfair Display', serif",
    category: "Serif",
    badge: "Vogue",
    isCursive: false,
    letterSpacing: "0.02em",
  },
  {
    id: "luxury_cormorant",
    name: "Lujo Aristocrático (Cormorant Garamond)",
    subtitle: "Estilo refinado, delicado y editorial de gala",
    fontFamily: "'Cormorant Garamond', serif",
    secondaryFontFamily: "'Cormorant Garamond', serif",
    category: "Serif",
    badge: "Lujo Gala",
    isCursive: false,
    letterSpacing: "0.03em",
  },
  {
    id: "italiana_milan",
    name: "Italiana Pasarela (Milán Fashion)",
    subtitle: "Proporciones esbeltas de pasarela europea contemporánea",
    fontFamily: "'Italiana', serif",
    secondaryFontFamily: "'Italiana', serif",
    category: "Serif",
    badge: "Milán",
    isCursive: false,
    letterSpacing: "0.05em",
  },
  {
    id: "prata_luxury",
    name: "Prata París (Cosmética & Belleza)",
    subtitle: "Trazos didones elegantes para perfumería y cosmética de lujo",
    fontFamily: "'Prata', serif",
    secondaryFontFamily: "'Prata', serif",
    category: "Serif",
    badge: "Belleza",
    isCursive: false,
    letterSpacing: "0.03em",
  },
  {
    id: "cinzel_decorative",
    name: "Cinzel Ornamental (Capiteles de Gala)",
    subtitle: "Capiteles romanos con remates ornamentales suntuosos",
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    secondaryFontFamily: "'Cinzel', serif",
    category: "Serif",
    badge: "Swash",
    isCursive: false,
    letterSpacing: "0.05em",
  },
  {
    id: "alex_brush",
    name: "Caligrafía Real Nupcial (Alex Brush)",
    subtitle: "Trazos clásicos aristocráticos para bodas de lujo",
    fontFamily: "'Alex Brush', 'Great Vibes', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Boda Luxury",
    isCursive: true,
    letterSpacing: "0.04em",
  },
  {
    id: "great_vibes",
    name: "Great Vibes (Gran Caligrafía Nupcial)",
    subtitle: "Curvas fluidas, pomposas y majestuosas para novias",
    fontFamily: "'Great Vibes', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Gran Boda",
    isCursive: true,
    letterSpacing: "0.03em",
  },
  {
    id: "allura_romance",
    name: "Allura Romance (Cursiva Sedosa)",
    subtitle: "Caligrafía ultrafina, suave, dulce y legible",
    fontFamily: "'Allura', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Romance",
    isCursive: true,
    letterSpacing: "0.02em",
  },
  {
    id: "pinyon_script",
    name: "Pinyon Script (Caligrafía Aristocrática)",
    subtitle: "Inclinación inglesa cortesana de máxima distinción",
    fontFamily: "'Pinyon Script', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Royal",
    isCursive: true,
    letterSpacing: "0.04em",
  },
  {
    id: "parisienne",
    name: "Alta Costura Parisina (Parisienne)",
    subtitle: "Inspiración francesa de moda y pasarela",
    fontFamily: "'Parisienne', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Paris",
    isCursive: true,
    letterSpacing: "0.03em",
  },
  {
    id: "marck_script",
    name: "Cursiva Fluida (Marck Script)",
    subtitle: "Caligrafía suelta, estilizada y sumamente elegante",
    fontFamily: "'Marck Script', cursive",
    secondaryFontFamily: "'Marck Script', cursive",
    category: "Cursiva",
    badge: "Fluida",
    isCursive: true,
    letterSpacing: "0.03em",
  },
  {
    id: "dancing_script",
    name: "Romántico Dinámico (Dancing Script)",
    subtitle: "Caligrafía espontánea, moderna y con gran personalidad",
    fontFamily: "'Dancing Script', cursive",
    secondaryFontFamily: "'Dancing Script', cursive",
    category: "Cursiva",
    badge: "Dinámico",
    isCursive: true,
    letterSpacing: "0.02em",
  },
  {
    id: "cedarville_signature",
    name: "Cedarville (Firma Autoral Espontánea)",
    subtitle: "Trazo manuscrito auténtico como firma personalizada",
    fontFamily: "'Cedarville Cursive', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Firma",
    isCursive: true,
    letterSpacing: "0.02em",
  },
  {
    id: "sacramento_fine",
    name: "Sacramento (Cursiva Retro Chic)",
    subtitle: "Trazos conectados de estética retro refinada",
    fontFamily: "'Sacramento', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Retro Chic",
    isCursive: true,
    letterSpacing: "0.03em",
  },
  {
    id: "covered_grace",
    name: "Covered Grace (Manuscrito de Pluma)",
    subtitle: "Caligrafía natural, orgánica y con personalidad artística",
    fontFamily: "'Covered By Your Grace', cursive",
    secondaryFontFamily: "'Caveat', cursive",
    category: "Cursiva",
    badge: "Pluma",
    isCursive: true,
    letterSpacing: "0.03em",
  },
  {
    id: "modern_montserrat",
    name: "Moderno Minimalista (Montserrat)",
    subtitle: "Geométrico, contemporáneo, corporativo y limpio",
    fontFamily: "'Montserrat', sans-serif",
    secondaryFontFamily: "'Montserrat', sans-serif",
    category: "Sans-Serif",
    badge: "Minimal",
    isCursive: false,
    letterSpacing: "0.03em",
  },
  {
    id: "raleway_couture",
    name: "Raleway Couture (Sans Proporción Vogue)",
    subtitle: "Líneas geométricas puras con elegancia arquitectónica",
    fontFamily: "'Raleway', sans-serif",
    secondaryFontFamily: "'Raleway', sans-serif",
    category: "Sans-Serif",
    badge: "Couture Sans",
    isCursive: false,
    letterSpacing: "0.05em",
  }
];

export const LOGO_VARIANTS = [
  {
    id: "white",
    name: "Blanco (Alto Contraste)",
    description: "Para barra gris oscura o fotos con fondo oscuro",
    url: "./assets/logos/logo-white-trans.png",
    previewBg: "bg-stone-900",
    textColor: "text-white"
  },
  {
    id: "black",
    name: "Negro (Fondo Claro)",
    description: "Para facturas, fondo blanco o fotos muy claras",
    url: "./assets/logos/logo-black-trans.png",
    previewBg: "bg-stone-100",
    textColor: "text-stone-900"
  },
  {
    id: "grey",
    name: "Gris / Plata (Contraste Suave)",
    description: "Para contrastes sutiles, elegantes y marcas de agua",
    url: "./assets/logos/logo-grey-trans.png",
    previewBg: "bg-stone-400",
    textColor: "text-stone-200"
  }
];

// Clean template photos strictly from 'Eliotte MUA Cotizaciones'
export const ALL_BACKGROUNDS = [
  { 
    id: "cotizacion_1", 
    label: "1. Novia / Boda (Limpia Oficial)", 
    url: "./assets/cotizacion-1.jpg", 
    category: "Boda",
    description: "Fotografía limpia oficial sin texto de novia para cotizaciones nupciales"
  },
  { 
    id: "cotizacion_2", 
    label: "2. Moda Editorial Azul (Limpia Oficial)", 
    url: "./assets/cotizacion-2.jpg", 
    category: "Moda",
    description: "Fotografía limpia oficial sin texto con iluminación azul para producciones de moda"
  },
  { 
    id: "cotizacion_3", 
    label: "3. Social / Quinceañera (Limpia Oficial)", 
    url: "./assets/cotizacion-3.jpg", 
    category: "Social / Comercial",
    description: "Fotografía limpia oficial sin texto con blusa de lino y collar para eventos y quinceañeras"
  }
];

export const QUOTE_TEMPLATES = [
  {
    id: "boda",
    name: "1. Boda / Wedding (Canva Exacto)",
    subtitle: "Wedding Price List Santiago",
    category: "Boda",
    defaultBg: "./assets/cotizacion-1.jpg",
    quoteNumber: "COT-2026-001",
    headerTitle: "Wedding",
    headerTitleColor: "#1a1a1a",
    headerTitleEn: "",
    sectionSubtitle: "Price List Santiago",
    currency: "US$",
    defaultLogo: "white",
    fontTheme: "canva_caveat",
    clientName: "",
    clientEmail: "",
    eventDate: "27 de septiembre 2024",
    defaultNote: "To book your date 50% of the total amount of the services .\nAt the Current Account (pesos)\nBPD 814-307880\nced 031-0422823-8\nEliotte Casimiro",
    suggestedServices: [
      { description: "Bride makeup (Airbrush)", price: 200, unit: "us", optional: false },
      { description: "Guest Makeup", price: 80, unit: "us", optional: false },
      { description: "Servicio de maquillaje de prueba para la novia", price: 150, unit: "us", optional: true },
      { description: "Servicio de retoque para la novia", price: 300, unit: "us", optional: true },
      { description: "Gastos de traslado", price: 50, unit: "us", optional: false }
    ],
    sampleItems: [
      { id: "1", description: "Bride makeup (Airbrush)", price: 200, qty: 1, optional: false, note: "" },
      { id: "2", description: "2 Guest Makeup $80.00us", price: 160, qty: 1, optional: false, note: "" }
    ]
  },
  {
    id: "editorial_comercial",
    name: "2. Social / Persio Abreu (Canva Exacto)",
    subtitle: "Cotización con Descuento",
    category: "Comercial / Social",
    defaultBg: "./assets/cotizacion-3.jpg",
    quoteNumber: "COT-2026-002",
    headerTitle: "Cotización",
    headerTitleColor: "#1a1a1a",
    headerTitleEn: "",
    sectionSubtitle: "",
    currency: "RD$",
    defaultLogo: "white",
    fontTheme: "canva_caveat",
    clientName: "Persio Abreu SRL",
    clientEmail: "",
    eventDate: "7/10/26",
    defaultNote: "El pago puede ser efectuado a la cuenta corriente en pesos del BPD 814-307880\nced 031-0422823-8\nEliotte Casimiro",
    suggestedServices: [
      { description: "-Servicio de maquillaje y retoque para 4 modelos", price: 40000, unit: "RD$", optional: false },
      { description: "-Descuento por servicio frecuente", price: -10000, unit: "RD$", optional: false },
      { description: "Servicio de maquillaje full day para catálogo", price: 25000, unit: "RD$", optional: false }
    ],
    sampleItems: [
      { id: "1", description: "-Servicio de maquillaje y retoque para 4 modelos", price: 40000, qty: 1, optional: false, note: "" },
      { id: "2", description: "-Descuento por servicio frecuente", price: -10000, qty: 1, optional: false, note: "" }
    ]
  },
  {
    id: "moda",
    name: "3. Moda Editorial / Camila Casual (Canva Exacto)",
    subtitle: "Cotización Moda con RNC",
    category: "Moda",
    defaultBg: "./assets/cotizacion-2.jpg",
    quoteNumber: "COT-2026-003",
    headerTitle: "Cotización Moda",
    headerTitleColor: "#1a1a1a",
    headerTitleEn: "",
    sectionSubtitle: "",
    currency: "RD$",
    defaultLogo: "white",
    fontTheme: "canva_caveat",
    clientName: "Persio Abreu SRL",
    clientEmail: "",
    rnc: "102-32053-5",
    eventDate: "6 y 7 de Septiembre 2023",
    defaultNote: "El pago puede ser efectuado a la cuenta corriente BPD 814-307880\nced 031-0422823-8\nEliotte Casimiro",
    suggestedServices: [
      { description: "-Servicio de maquillaje full day para fotos Camila Casual", price: 19800, unit: "RD$", optional: false },
      { description: "Servicio de maquillaje para modelos", price: 15000, unit: "RD$", optional: false },
      { description: "Servicio de retoque durante la sesión", price: 5000, unit: "RD$", optional: false }
    ],
    sampleItems: [
      { id: "1", description: "-Servicio de maquillaje full day para fotos Camila Casual\nDias 6 y 7 de Septiembre 2023", price: 19800, qty: 1, optional: false, note: "" }
    ]
  },
  {
    id: "quinceanera",
    name: "4. Quinceañera / Cumpleaños",
    subtitle: "Cotización Quinceañera Airbrush",
    category: "Evento Social",
    defaultBg: "./assets/cotizacion-3.jpg",
    quoteNumber: "COT-2026-002",
    headerTitle: "Cotización",
    headerTitleColor: "#1a1a1a",
    headerTitleEn: "",
    sectionSubtitle: "",
    currency: "US$",
    defaultLogo: "white",
    fontTheme: "canva_caveat",
    clientName: "",
    clientEmail: "",
    eventDate: "",
    defaultNote: "El pago puede ser efectuado a la cuenta corriente en pesos del BPD 814-307880\nced 031-0422823-8\nEliotte Casimiro",
    suggestedServices: [
      { description: "Servicio de maquillaje para quinceañera (Airbrush)", price: 150, unit: "us", optional: false },
      { description: "Servicio de maquillaje para acompañantes", price: 120, unit: "us", note: "P/P", optional: false },
      { description: "Servicio de Retoque durante el evento", price: 300, unit: "us", optional: true },
      { description: "Gastos de traslado", price: 150, unit: "us", optional: false }
    ],
    sampleItems: [
      { id: "1", description: "Servicio de maquillaje para quinceañera (Airbrush)", price: 150, qty: 1, optional: false, note: "" },
      { id: "2", description: "Servicio de maquillaje para 3 personas $120.us P/P", price: 360, qty: 1, optional: false, note: "P/P" },
      { id: "3", description: "Servicio de Retoque durante el evento (Opcional)", price: 300, qty: 1, optional: true, note: "Opcional" },
      { id: "4", description: "Gastos de traslado", price: 150, qty: 1, optional: false, note: "" }
    ]
  }
];

export const QUICK_SERVICES_CATALOG = [
  { name: "Maquillaje Novia (Airbrush)", priceUS: 200, priceRD: 12000, category: "Boda" },
  { name: "Prueba Maquillaje Novia (Airbrush)", priceUS: 150, priceRD: 9000, category: "Boda" },
  { name: "Maquillaje Damas / Invitadas", priceUS: 70, priceRD: 4200, category: "Boda" },
  { name: "Retoque Novia durante el evento", priceUS: 300, priceRD: 18000, category: "Boda" },
  { name: "Maquillaje Quinceañera (Airbrush)", priceUS: 150, priceRD: 9000, category: "Quinceañera" },
  { name: "Maquillaje Invitada / Social", priceUS: 80, priceRD: 4800, category: "Social" },
  { name: "Retoque durante evento (Plus regia / cambio de look)", priceUS: 300, priceRD: 18000, category: "Social" },
  { name: "Maquillaje para modelos (sesión fotos)", priceUS: 250, priceRD: 15000, category: "Moda" },
  { name: "Maquillaje Full Day para fotos", priceUS: 330, priceRD: 19800, category: "Moda" },
  { name: "Retoque durante sesión (2 a 3 horas)", priceUS: 85, priceRD: 5000, category: "Moda" },
  { name: "Gastos de traslado", priceUS: 50, priceRD: 3000, category: "Varios" },
  { name: "Descuento especial", priceUS: -50, priceRD: -3000, category: "Varios" }
];

export const DEFAULT_MASTER_CLASS = {
  clientName: "BEIA Academy",
  contactPerson: "Coordinación de Formación",
  phone: "(849) 220-9464",
  email: "eliottecasimiro129@gmail.com",
  instagram: "@eliottemua",
  currency: "USD",
  activePage: "proposal", // 'cover' | 'page1' | 'page2' | 'page3' | 'proposal'
  displayMode: "dynamic", // 'dynamic' (Live Editable Modules) | 'artistic' (Original Canva High-Fashion)
  logoVariant: "white",
  fontTheme: "cursive_signature",
  customNote: "Para reservar la fecha de la Master Class se requiere el abono del 50% de anticipo. El saldo restante debe completarse antes de iniciar el taller.",
  
  // Proposal Locations / Packages
  locations: [
    {
      id: "loc_1",
      name: "BEIA Santo Domingo",
      costPerPerson: 200,
      currency: "USD",
      minParticipants: 5,
      includes: [
        "Masterclass Profesional de Maquillaje.",
        "Material de apoyo.",
        "Certificado digital o físico.",
        "Acompañamiento técnico durante la práctica.",
        "Retroalimentación individual."
      ],
      note: "Cada participante debe llevar su modelo para practicar."
    },
    {
      id: "loc_2",
      name: "BEIA Santiago",
      costPerPerson: 250,
      currency: "USD",
      minParticipants: 5,
      includes: [
        "Masterclass Profesional de Maquillaje.",
        "Material de apoyo.",
        "Certificado digital o físico.",
        "Acompañamiento técnico durante la práctica.",
        "Retroalimentación individual."
      ],
      note: "Cada participante debe llevar su modelo para practicar."
    }
  ],

  // Syllabus / Temario modules
  syllabusQuote: "En esta Master Class buscamos que el profesional del maquillaje perfeccione sus técnicas, amplíe sus conocimientos avanzados y domine procedimientos especializados para crear looks editoriales, sociales, de pasarela y de alto impacto, integrando visagismo, teoría del color aplicada, productos de alta gama y ejecución en tiempos profesionales.",
  instructor: "Eliotte Casimiro",
  modules: [
    {
      number: 1,
      title: "Piel Profesional (Skin Prep Avanzado)",
      topics: [
        "Análisis de la piel.",
        "Rutinas skin prep según textura, edad y necesidades específicas.",
        "Control de grasa, manejo de poros, piel madura y piel con textura.",
        "Uso avanzado de primers, fijadores y boosters para fotografía."
      ]
    },
    {
      number: 2,
      title: "Teoría del Color Aplicada",
      topics: [
        "Corrección cromática avanzada.",
        "Dominio de subtonos en fotografía y luces.",
        "Mezclas personalizadas de bases.",
        "Cómo evitar oxidación y flashback."
      ]
    },
    {
      number: 3,
      title: "Bases, Corrección y Técnicas de Cobertura PRO",
      topics: [
        "Técnicas de aplicación profesional.",
        "Uniformidad HD y mezcla de bases a nivel profesional.",
        "Correctores: neutralización profunda, corrección por zonas, sculpting.",
        "Sellado avanzado: Baking selectivo, sellado por capas, técnicas antitextura."
      ]
    },
    {
      number: 4,
      title: "Visagismo y Corrección del Rostro",
      topics: [
        "Análisis de la morfología facial.",
        "Contouring 3D y profundización realista.",
        "Highlighting estratégico según luz, fotografía y tipo de rostro.",
        "Rubor: técnicas editoriales, lifting y placement avanzado."
      ]
    },
    {
      number: 5,
      title: "Ojos — Especializaciones",
      topics: [
        "Anatomía del ojo y sus correcciones.",
        "Técnicas.",
        "Maquillaje para piel madura.",
        "Delineados profesionales: gel, líquido, shadow liner, gráfico.",
        "Aplicación de pestañas y técnicas híbridas."
      ]
    },
    {
      number: 6,
      title: "Labios",
      topics: [
        "Corrección de asimetrías.",
        "Definición avanzada y técnicas plumping.",
        "Combinación profesional de tonos y texturas."
      ]
    },
    {
      number: 7,
      title: "Iluminación y Fotografía",
      topics: [
        "Cómo la luz modifica el maquillaje.",
        "Tipos de iluminación y su impacto en la piel.",
        "Cómo presentar tu trabajo profesionalmente.",
        "Manejo de cámara, ángulos y evidencias para portafolio."
      ]
    }
  ],
  practiceSection: {
    title: "Práctica con Modelo",
    text: "El programa incluye una demostración paso a paso realizada por la facilitadora a una modelo, seguida de una práctica supervisada donde los participantes pueden aplicar lo aprendido. Cada participante recibe retroalimentación individual para mejorar su desempeño, y se ofrece corrección técnica en vivo para asegurar el perfeccionamiento de las habilidades adquiridas."
  }
};

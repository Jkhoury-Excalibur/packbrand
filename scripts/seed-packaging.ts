import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DATABASE!;

// ── Packaging Categories (Vistaprint Catalog) ──

const CATEGORIES = [
  {
    name: 'Mailer Boxes',
    nameEs: 'Cajas de Envío',
    slug: 'mailer-boxes',
    description: 'Custom mailer boxes with full-print, logo, or plain options. Corrugated E-flute and B-flute construction.',
    descriptionEs: 'Cajas de envío personalizadas con impresión completa, logo o sin marca.',
    iconName: 'Box',
    sortOrder: 0,
  },
  {
    name: 'Shipping Boxes',
    nameEs: 'Cajas de Transporte',
    slug: 'shipping-boxes',
    description: 'Sturdy corrugated shipping boxes for e-commerce and retail. Full-print or plain options.',
    descriptionEs: 'Cajas de transporte resistentes para comercio electrónico y retail.',
    iconName: 'Package',
    sortOrder: 1,
  },
  {
    name: 'Product Boxes',
    nameEs: 'Cajas de Producto',
    slug: 'product-boxes',
    description: 'Folding carton retail boxes — tuck top, auto-lock, lock bottom, and gable styles.',
    descriptionEs: 'Cajas de cartón plegable para retail — varios estilos disponibles.',
    iconName: 'Gift',
    sortOrder: 2,
  },
  {
    name: 'Pouches',
    nameEs: 'Bolsas Flexibles',
    slug: 'pouches',
    description: 'Stand-up and flat pouches for food, cosmetics, and retail. Food-safe, leak-proof, and BPA-free.',
    descriptionEs: 'Bolsas tipo stand-up y planas para alimentos, cosméticos y retail.',
    iconName: 'ShoppingBag',
    sortOrder: 3,
  },
  {
    name: 'Poly Mailers',
    nameEs: 'Sobres de Polietileno',
    slug: 'poly-mailers',
    description: 'Lightweight poly mailers and compostable shipping bags for soft goods and apparel.',
    descriptionEs: 'Sobres de polietileno y opciones compostables para envíos ligeros.',
    iconName: 'Recycle',
    sortOrder: 4,
  },
  {
    name: 'Shopping Bags',
    nameEs: 'Bolsas de Compras',
    slug: 'shopping-bags',
    description: 'Paper, kraft, die-cut handle, and luxury shopping bags for retail and food service.',
    descriptionEs: 'Bolsas de papel, kraft y de lujo para retail y servicio de alimentos.',
    iconName: 'ShoppingBag',
    sortOrder: 5,
  },
  {
    name: 'Food & Beverage',
    nameEs: 'Alimentos y Bebidas',
    slug: 'food-beverage',
    description: 'Paper cups, coffee sleeves, treat bags, and food boxes. All food-safe and customizable.',
    descriptionEs: 'Vasos de papel, fundas de café, bolsas para dulces y cajas de comida.',
    iconName: 'Coffee',
    sortOrder: 6,
  },
  {
    name: 'Labels & Stickers',
    nameEs: 'Etiquetas y Stickers',
    slug: 'labels-stickers',
    description: 'Roll labels, packaging stickers, and singles in paper, vinyl, foil, and holographic materials.',
    descriptionEs: 'Etiquetas en rollo, stickers de empaque y singles en varios materiales.',
    iconName: 'Sticker',
    sortOrder: 7,
  },
  {
    name: 'Accessories',
    nameEs: 'Accesorios',
    slug: 'accessories',
    description: 'Packaging tape, tissue paper, crinkle paper, hang tags, and insert cards.',
    descriptionEs: 'Cinta de empaque, papel tissue, papel arrugado, etiquetas colgantes e insertos.',
    iconName: 'Ribbon',
    sortOrder: 8,
  },
];

// ── Products ──

const PRODUCTS = [
  // ═══════════════════════════════════════
  // MAILER BOXES
  // ═══════════════════════════════════════
  {
    categorySlug: 'mailer-boxes',
    name: 'Full-Print Mailer Boxes',
    nameEs: 'Cajas de Envío con Impresión Completa',
    shortDescription: 'Full-color printing on all 6 sides, inside and outside. Corrugated E-flute cardboard.',
    shortDescEs: 'Impresión a todo color en las 6 caras, interior y exterior.',
    description: 'Make a lasting impression with full-color custom printing on every surface — inside and out. These corrugated E-flute mailer boxes are sturdy enough to ship small to mid-sized items without additional packaging. Front-tuck closure keeps contents secure. Available in 12 sizes to fit everything from small accessories to mid-sized merchandise.',
    descEs: 'Impresión personalizada a todo color en cada superficie. Cajas de cartón corrugado E-flute resistentes para envíos sin empaque adicional.',
    tags: ['E-commerce', 'Subscription', 'Full Print'],
    features: ['Full-color print on all 6 sides (inside + outside)', '12 size options available', 'Corrugated E-flute cardboard construction', 'Front-tuck closure', 'No additional packaging needed'],
    sizes: ['6x4x2"', '8x6x2"', '9x6x3"', '10x8x3"', '11x8x4"', '12x9x4"', '12x10x5"', '13x10x4"', '14x10x4"', '15x10x5"', '16x12x4"', '18x12x6"'],
    specs: [
      { label: 'Material', value: 'Corrugated E-flute cardboard' },
      { label: 'Print', value: 'Full color — all 6 sides, inside + outside' },
      { label: 'Closure', value: 'Front tuck' },
      { label: 'Sizes', value: '12 options' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '3,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'mailer-boxes',
    name: 'Logo Mailer Boxes',
    nameEs: 'Cajas de Envío con Logo',
    shortDescription: 'Add your logo or small design to kraft mailer boxes. Popular choice for e-commerce brands.',
    shortDescEs: 'Agrega tu logo a cajas de envío kraft. Opción popular para marcas de e-commerce.',
    description: 'A cost-effective way to brand your shipments. Add your logo or small design to these sturdy mailer boxes — perfect for e-commerce, subscription boxes, and retail shipping. Available in 12 sizes with a clean, professional look that puts your brand front and center without the cost of full-wrap printing.',
    descEs: 'Una forma económica de personalizar tus envíos con tu logo o diseño.',
    tags: ['E-commerce', 'Logo', 'Budget-Friendly'],
    features: ['Logo or small design print on exterior', '12 size options', 'Sturdy corrugated construction', 'Cost-effective branding solution', 'Professional unboxing experience'],
    sizes: ['6x4x2"', '8x6x2"', '9x6x3"', '10x8x3"', '11x8x4"', '12x9x4"', '12x10x5"', '13x10x4"', '14x10x4"', '15x10x5"', '16x12x4"', '18x12x6"'],
    specs: [
      { label: 'Material', value: 'Corrugated cardboard' },
      { label: 'Print', value: 'Logo / small design on exterior' },
      { label: 'Sizes', value: '12 options' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '2,388 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: false,
    sortOrder: 1,
  },
  {
    categorySlug: 'mailer-boxes',
    name: 'Plain Mailer Boxes',
    nameEs: 'Cajas de Envío Sin Impresión',
    shortDescription: 'Unbranded, non-printed mailer boxes. Lightweight E-flute cardboard. Easy assembly.',
    shortDescEs: 'Cajas de envío sin marca ni impresión. Cartón E-flute liviano.',
    description: 'Simple, unbranded mailer boxes for businesses that need reliable packaging without custom printing. Made from sturdy E-flute cardboard, these lightweight yet strong boxes are ideal for apparel, beauty products, e-commerce, or subscription box businesses. Easy to assemble and ready to ship.',
    descEs: 'Cajas de envío sin marca para negocios que necesitan empaque confiable sin impresión personalizada.',
    tags: ['Plain', 'Unbranded', 'Budget'],
    features: ['No printing — plain unbranded', 'Sturdy E-flute cardboard', 'Lightweight yet strong', 'Easy assembly', 'Ideal for apparel, beauty, e-commerce'],
    sizes: ['6x4x2"', '8x6x2"', '9x6x3"', '10x8x3"', '12x9x4"', '14x10x4"'],
    specs: [
      { label: 'Material', value: 'Corrugated E-flute cardboard' },
      { label: 'Print', value: 'None — unbranded' },
      { label: 'Min. order', value: '12 units' },
      { label: 'Max. order', value: '600 units' },
    ],
    basePrice: 0,
    allowLogoUpload: false,
    allowCustomText: false,
    sortOrder: 2,
  },
  {
    categorySlug: 'mailer-boxes',
    name: 'Square Mailer Boxes',
    nameEs: 'Cajas de Envío Cuadradas',
    shortDescription: 'Custom square mailer boxes in white B-flute corrugated. Great for subscription orders and apparel.',
    shortDescEs: 'Cajas de envío cuadradas en cartón corrugado B-flute blanco.',
    description: 'Square mailer boxes made from sturdy white B-flute corrugated cardboard. A versatile shape that works great for smaller subscription orders, apparel, books, stationery, beauty products, and more. Full-color exterior printing with a clean white interior.',
    descEs: 'Cajas de envío cuadradas de cartón corrugado B-flute blanco. Ideales para suscripciones y productos varios.',
    tags: ['Subscription', 'Square', 'Apparel'],
    features: ['White B-flute corrugated cardboard', 'Full-color exterior printing', 'Square format for versatile use', 'Great for subscriptions, apparel, beauty', 'Shipping label compatible'],
    sizes: ['8x8x3"', '10x10x4"', '12x12x4"', '12x12x6"'],
    specs: [
      { label: 'Material', value: 'White B-flute corrugated cardboard' },
      { label: 'Print', value: 'Full color exterior' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '600 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 3,
  },
  {
    categorySlug: 'mailer-boxes',
    name: 'Tuck Top Mailer Boxes',
    nameEs: 'Cajas de Envío con Tapa Superior',
    shortDescription: 'Top-opening boxes with full-color exterior print. Memorable unboxing experience.',
    shortDescEs: 'Cajas con apertura superior e impresión a todo color. Experiencia de unboxing memorable.',
    description: 'These boxes open from the top, giving easy access to the product inside and creating a memorable unboxing experience. Full-color, all-over exterior printing lets you customize every visible surface. Available in 2 sizes with durable B-flute corrugated construction.',
    descEs: 'Apertura desde la parte superior para una experiencia de unboxing memorable. Impresión exterior a todo color.',
    tags: ['Unboxing', 'Top Open', 'Gift'],
    features: ['Top-opening design for easy access', 'Full-color all-over exterior print', 'Memorable unboxing experience', 'Durable B-flute corrugated construction', '2 size options'],
    sizes: ['10x8x4"', '12x10x5"'],
    specs: [
      { label: 'Material', value: 'B-flute corrugated cardboard' },
      { label: 'Print', value: 'Full color — entire exterior' },
      { label: 'Opening', value: 'Top tuck' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '600 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 4,
  },

  // ═══════════════════════════════════════
  // SHIPPING BOXES
  // ═══════════════════════════════════════
  {
    categorySlug: 'shipping-boxes',
    name: 'Full-Print Shipping Boxes',
    nameEs: 'Cajas de Transporte con Impresión Completa',
    shortDescription: 'Full-color printing inside and outside on corrugated shipping boxes.',
    shortDescEs: 'Impresión a todo color interior y exterior en cajas de transporte corrugadas.',
    description: 'Turn every shipment into a brand statement. Full-color printing on the inside and outside of sturdy corrugated shipping boxes. Ideal for e-commerce businesses that want their brand to stand out from the moment the package arrives to the moment it is opened.',
    descEs: 'Convierte cada envío en una declaración de marca con impresión a todo color.',
    tags: ['E-commerce', 'Full Print', 'Shipping'],
    features: ['Full-color print inside and outside', 'Sturdy corrugated construction', 'Multiple size options', 'Professional branding on every shipment', 'Strong enough for transit protection'],
    sizes: ['10x8x4"', '12x10x5"', '14x10x6"', '16x12x6"', '18x14x8"', '20x16x8"'],
    specs: [
      { label: 'Material', value: 'Corrugated cardboard' },
      { label: 'Print', value: 'Full color inside + outside' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '3,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'shipping-boxes',
    name: 'Plain Shipping Boxes',
    nameEs: 'Cajas de Transporte Sin Impresión',
    shortDescription: 'Unbranded corrugated C-flute shipping boxes. 5 sizes available.',
    shortDescEs: 'Cajas de transporte sin marca en cartón corrugado C-flute. 5 tamaños.',
    description: 'Reliable, unbranded corrugated C-flute shipping boxes for businesses that need sturdy protection without custom printing. Available in 5 sizes to accommodate a wide range of products. Easy to assemble and stack for efficient warehouse storage.',
    descEs: 'Cajas de transporte sin marca en cartón corrugado C-flute. 5 tamaños disponibles.',
    tags: ['Plain', 'Unbranded', 'Shipping'],
    features: ['C-flute corrugated cardboard', 'No printing — unbranded', '5 size options', 'Easy assembly', 'Stackable for storage'],
    sizes: ['10x8x6"', '12x10x6"', '14x12x8"', '16x12x10"', '20x16x10"'],
    specs: [
      { label: 'Material', value: 'Corrugated C-flute cardboard' },
      { label: 'Print', value: 'None — unbranded' },
      { label: 'Sizes', value: '5 options' },
    ],
    basePrice: 0,
    allowLogoUpload: false,
    allowCustomText: false,
    sortOrder: 1,
  },
  {
    categorySlug: 'shipping-boxes',
    name: 'Flat Shipping Boxes',
    nameEs: 'Cajas de Envío Planas',
    shortDescription: 'Pre-glued flat boxes for books, clothing, and flat products. Full-color or logo print.',
    shortDescEs: 'Cajas planas pre-pegadas para libros, ropa y productos planos.',
    description: 'Pre-glued flat shipping boxes made with corrugated cardboard to protect books, clothing, artwork, and other flat products. White exterior with natural kraft interior. Customizable with your logo or full-color exterior printing. Available in 2 sizes.',
    descEs: 'Cajas planas pre-pegadas de cartón corrugado para proteger libros, ropa y arte.',
    tags: ['Flat', 'Books', 'Apparel'],
    features: ['Pre-glued for easy assembly', 'Corrugated B-flute construction', 'White exterior, kraft interior', 'Full-color or logo print options', '2 size options'],
    sizes: ['12.5x10x1"', '15x12x2"'],
    specs: [
      { label: 'Material', value: 'B-flute corrugated cardboard' },
      { label: 'Exterior', value: 'White' },
      { label: 'Interior', value: 'Natural kraft' },
      { label: 'Sizes', value: '2 options' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: false,
    sortOrder: 2,
  },

  // ═══════════════════════════════════════
  // PRODUCT BOXES (Folding Cartons)
  // ═══════════════════════════════════════
  {
    categorySlug: 'product-boxes',
    name: 'Tuck Top Boxes',
    nameEs: 'Cajas con Tapa de Inserción',
    shortDescription: 'Folding carton tuck top boxes with full-color print and 3 lamination options. 10 sizes.',
    shortDescEs: 'Cajas de cartón plegable con tapa de inserción, impresión a color y 3 opciones de laminado.',
    description: 'Custom tuck top boxes with a treasure chest style opening. Full-color printing on the entire outside with 3 lamination options (matte, gloss, soft-touch) to match your brand aesthetic. Available in 10 sizes — perfect for cosmetics, candles, food items, and retail products.',
    descEs: 'Cajas con apertura tipo cofre, impresión a todo color y 3 opciones de laminado.',
    tags: ['Retail', 'Cosmetics', 'Folding Carton'],
    features: ['Full-color exterior printing', '3 lamination options: matte, gloss, soft-touch', 'Treasure chest style opening', '10 size options', 'Sleek folding carton material'],
    sizes: ['3x3x3"', '4x3x2"', '4x4x4"', '5x3x2"', '5x4x3"', '6x4x3"', '6x4x4"', '7x5x3"', '8x6x3"', '10x8x4"'],
    specs: [
      { label: 'Material', value: 'Folding carton' },
      { label: 'Print', value: 'Full color exterior' },
      { label: 'Lamination', value: 'Matte, gloss, or soft-touch' },
      { label: 'Sizes', value: '10 options' },
      { label: 'Min. order', value: '50 units' },
      { label: 'Sample', value: '$29.99 per sample' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'product-boxes',
    name: 'Auto-Lock Bottom Boxes',
    nameEs: 'Cajas con Fondo Auto-Armable',
    shortDescription: 'Pop-open auto-lock boxes for heavier items. 13 sizes, 3 lamination options. No assembly needed.',
    shortDescEs: 'Cajas auto-armables para artículos pesados. 13 tamaños, sin ensamblaje.',
    description: 'Auto-lock bottom boxes that pop into their final shape when opened — no assembly required. The bottom flaps automatically lock into place, providing strong support for heavier items like jars, candles, bottles, and premium products. Full-color exterior printing with 3 lamination options. Available in 13 sizes.',
    descEs: 'Cajas con fondo que se arma automáticamente al abrirse. Ideal para artículos pesados.',
    tags: ['Heavy Items', 'Auto-Lock', 'Premium'],
    features: ['Auto-lock bottom — no assembly required', 'Full-color exterior printing', '3 lamination options: matte, gloss, soft-touch', '13 size options', 'Strong bottom support for heavy items'],
    sizes: ['3x3x4"', '4x3x5"', '4x4x6"', '5x3x5"', '5x4x6"', '5x5x7"', '6x4x6"', '6x5x7"', '6x6x8"', '7x5x7"', '8x6x6"', '8x6x8"', '10x8x6"'],
    specs: [
      { label: 'Material', value: 'Folding carton' },
      { label: 'Print', value: 'Full color exterior' },
      { label: 'Lamination', value: 'Matte, gloss, or soft-touch' },
      { label: 'Assembly', value: 'Auto-lock — pop open' },
      { label: 'Sizes', value: '13 options' },
      { label: 'Min. order', value: '50 units' },
      { label: 'Sample', value: '$29.99 per sample' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 1,
  },
  {
    categorySlug: 'product-boxes',
    name: 'Lock Bottom Boxes',
    nameEs: 'Cajas con Fondo de Cierre',
    shortDescription: 'Snap lock bottom boxes with light assembly. Strong protection similar to auto-lock at a lower cost.',
    shortDescEs: 'Cajas con fondo de cierre snap. Ensamblaje ligero, protección fuerte.',
    description: 'Lock bottom boxes provide the same strong bottom protection as auto-lock boxes but require light assembly — snapping the bottom flaps into place. A cost-effective alternative for businesses that want secure packaging without the auto-lock premium. Full-color exterior printing available.',
    descEs: 'Cajas con fondo de cierre que requieren ensamblaje ligero. Alternativa económica a las auto-lock.',
    tags: ['Budget', 'Lock Bottom', 'Retail'],
    features: ['Snap lock bottom with light assembly', 'Full-color exterior printing', 'Cost-effective alternative to auto-lock', 'Strong bottom protection', 'Multiple size options'],
    sizes: ['4x3x5"', '5x4x6"', '6x4x6"', '6x6x8"', '8x6x6"', '8x6x8"'],
    specs: [
      { label: 'Material', value: 'Folding carton' },
      { label: 'Print', value: 'Full color exterior' },
      { label: 'Assembly', value: 'Light — snap lock bottom' },
      { label: 'Min. order', value: '50 units' },
      { label: 'Sample', value: '$29.99 per sample' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 2,
  },
  {
    categorySlug: 'product-boxes',
    name: 'Reverse Tuck Boxes',
    nameEs: 'Cajas de Inserción Inversa',
    shortDescription: 'Classic folding carton style with reverse tuck closure. Full-color print available.',
    shortDescEs: 'Estilo clásico de cartón plegable con cierre de inserción inversa.',
    description: 'A classic folding carton design where the top and bottom flaps tuck in from opposite directions, creating a secure and clean closure. Full-color exterior printing makes these ideal for retail shelving, cosmetics, food products, and more.',
    descEs: 'Diseño clásico de cartón plegable con solapas que se insertan en direcciones opuestas.',
    tags: ['Retail', 'Classic', 'Shelf Display'],
    features: ['Reverse tuck closure design', 'Full-color exterior printing', 'Clean, classic appearance', 'Ideal for retail shelf display', 'Multiple size options'],
    sizes: ['3x2x5"', '4x2x6"', '4x3x6"', '5x3x7"', '6x4x8"'],
    specs: [
      { label: 'Material', value: 'Folding carton' },
      { label: 'Print', value: 'Full color exterior' },
      { label: 'Closure', value: 'Reverse tuck' },
      { label: 'Min. order', value: '50 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 3,
  },
  {
    categorySlug: 'product-boxes',
    name: 'Gable Boxes',
    nameEs: 'Cajas con Asa',
    shortDescription: 'Unique gable shape with built-in handle. B-flute corrugated. 2 sizes.',
    shortDescEs: 'Forma de gablete con asa incorporada. Cartón corrugado B-flute.',
    description: 'Gable boxes with a unique shape and built-in handle — no bag or extra packaging needed. Made from strong B-flute corrugated cardboard. Perfect for gift packaging, food delivery, party favors, and retail. Full-color custom printing available. 2 sizes.',
    descEs: 'Cajas con forma de gablete y asa incorporada. Cartón corrugado B-flute resistente.',
    tags: ['Gift', 'Handle', 'Food Delivery'],
    features: ['Built-in carry handle', 'Unique gable shape', 'B-flute corrugated cardboard', 'Full-color custom printing', '2 size options'],
    sizes: ['6x4x4"', '8x5x5"'],
    specs: [
      { label: 'Material', value: 'B-flute corrugated cardboard' },
      { label: 'Print', value: 'Full color exterior' },
      { label: 'Handle', value: 'Built-in' },
      { label: 'Sizes', value: '2 options' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '600 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 4,
  },

  // ═══════════════════════════════════════
  // POUCHES
  // ═══════════════════════════════════════
  {
    categorySlug: 'pouches',
    name: 'Stand-Up Pouches',
    nameEs: 'Bolsas Stand-Up',
    shortDescription: 'Upright display pouches with zipper closure. Food-safe, leak-proof, microwave-safe, BPA-free. 20 sizes.',
    shortDescEs: 'Bolsas con base para exhibición vertical. Aptas para alimentos, a prueba de fugas.',
    description: 'Stand-up pouches with a sturdy base that lets them sit upright on shelves — ideal for retail display. Food-safe, leak-proof, microwave-safe, and BPA-free. Available with zipper closures, tear notches, and hanging holes. 20 size options for liquids, powders, cosmetics, snacks, coffee, and more.',
    descEs: 'Bolsas con base firme para exhibición en estantes. Aptas para alimentos, a prueba de fugas, aptas para microondas.',
    tags: ['Food Safe', 'Retail Display', 'Flexible'],
    features: ['Upright display with sturdy base', 'Food-safe, leak-proof, BPA-free', 'Microwave-safe', 'Zipper closure option', '20 size options', 'Tear notch and hanging hole options'],
    sizes: ['3.25x4.75x2"', '4x6x2.5"', '5x8x3"', '6x9x3"', '6x10x3.5"', '7x11x3.5"', '8x12x4"', '9x13x4"'],
    specs: [
      { label: 'Material', value: 'Multi-layer barrier film' },
      { label: 'Food safe', value: 'Yes — direct food contact' },
      { label: 'Microwave safe', value: 'Yes' },
      { label: 'BPA-free', value: 'Yes' },
      { label: 'Sizes', value: '20 options' },
      { label: 'Min. order', value: '100 units' },
      { label: 'Max. order', value: '10,000 units' },
      { label: 'Sample kit', value: '$4.99 (20 samples)' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'pouches',
    name: 'Flat Pouches',
    nameEs: 'Bolsas Planas',
    shortDescription: 'Sleek flat pouches for smaller, lighter items. Food-safe barrier protection.',
    shortDescEs: 'Bolsas planas para artículos pequeños y ligeros. Protección de barrera para alimentos.',
    description: 'Flat pouches with a slim profile — great for smaller, lighter, or slimmer items that do not need to stand upright. Strong barrier protection keeps contents fresh. Food-safe for direct contact with snacks, spices, samples, and more. Full-color custom printing on the entire surface.',
    descEs: 'Bolsas planas con perfil delgado para artículos pequeños que no necesitan estar de pie.',
    tags: ['Samples', 'Spices', 'Slim'],
    features: ['Slim flat profile', 'Strong barrier protection', 'Food-safe for direct contact', 'Full-color custom printing', 'Multiple size options'],
    sizes: ['3x5"', '4x6"', '5x7"', '5x8"', '6x9"', '7x10"', '8x12"'],
    specs: [
      { label: 'Material', value: 'Multi-layer barrier film' },
      { label: 'Food safe', value: 'Yes' },
      { label: 'Min. order', value: '100 units' },
      { label: 'Max. order', value: '10,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 1,
  },

  // ═══════════════════════════════════════
  // POLY MAILERS
  // ═══════════════════════════════════════
  {
    categorySlug: 'poly-mailers',
    name: 'Custom Poly Mailers',
    nameEs: 'Sobres de Polietileno Personalizados',
    shortDescription: 'Flexible polyethylene shipping bags. 4 sizes, 2 orientations. Holds up to 5 lbs.',
    shortDescEs: 'Bolsas de envío de polietileno flexibles. 4 tamaños, 2 orientaciones.',
    description: 'Lightweight polyethylene shipping bags for soft, flat, and not easily crushed products. Full-color custom printing makes every shipment a branding opportunity. Available in 4 sizes and 2 orientations. Robust 2 mil material holds up to 5 lbs. Gusseted options available for bulkier items.',
    descEs: 'Bolsas de envío de polietileno para productos suaves y planos. Impresión personalizada a todo color.',
    tags: ['Lightweight', 'Apparel', 'E-commerce'],
    features: ['Flexible polyethylene material', 'Full-color custom printing', '4 sizes, 2 orientations', 'Holds up to 5 lbs', '2 mil thickness', 'Gusseted option for bulky items'],
    sizes: ['6x9"', '10x13"', '12x15.5"', '14.5x19"'],
    specs: [
      { label: 'Material', value: 'Polyethylene — 2 mil' },
      { label: 'Weight capacity', value: 'Up to 5 lbs' },
      { label: 'Print', value: 'Full color' },
      { label: 'Sizes', value: '4 options, 2 orientations' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'poly-mailers',
    name: 'Compostable Poly Mailers',
    nameEs: 'Sobres Compostables',
    shortDescription: 'Eco-friendly compostable shipping bags. Break down into organic matter after use.',
    shortDescEs: 'Bolsas de envío compostables. Se descomponen en materia orgánica.',
    description: 'Compostable shipping bags for eco-conscious brands. After the customer tears open the mailer and removes the perforated flap, the envelope breaks down into organic matter. Full-color custom printing available. A sustainable alternative to traditional poly mailers.',
    descEs: 'Bolsas de envío compostables para marcas eco-conscientes. Se descomponen en materia orgánica.',
    tags: ['Eco-Friendly', 'Compostable', 'Sustainable'],
    features: ['Compostable material', 'Breaks down into organic matter', 'Perforated flap for easy opening', 'Full-color custom printing', 'Sustainable alternative to poly'],
    sizes: ['6x9"', '10x13"', '12x15.5"', '14.5x19"'],
    specs: [
      { label: 'Material', value: 'Compostable bio-material' },
      { label: 'Eco', value: 'Breaks down into organic matter' },
      { label: 'Print', value: 'Full color' },
      { label: 'Min. order', value: '50 units' },
      { label: 'Max. order', value: '10,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 1,
  },

  // ═══════════════════════════════════════
  // SHOPPING BAGS
  // ═══════════════════════════════════════
  {
    categorySlug: 'shopping-bags',
    name: 'Kraft Paper Bags',
    nameEs: 'Bolsas de Papel Kraft',
    shortDescription: 'Custom kraft paper bags with twisted handles. White or brown kraft. Full-color print.',
    shortDescEs: 'Bolsas de papel kraft con asas retorcidas. Kraft blanco o marrón.',
    description: 'Premium kraft paper shopping bags with twisted paper handles. Available in white or brown kraft with full-color custom printing. Perfect for retail boutiques, bakeries, restaurants, and events. 100% recyclable and eco-friendly.',
    descEs: 'Bolsas de papel kraft premium con asas de papel retorcido. Disponibles en blanco o marrón.',
    tags: ['Retail', 'Eco-Friendly', 'Paper'],
    features: ['Twisted paper handles', 'White or brown kraft options', 'Full-color custom printing', '100% recyclable', '2 size options'],
    sizes: ['8x4x10"', '10x5x13"'],
    specs: [
      { label: 'Material', value: 'Kraft paper' },
      { label: 'Handles', value: 'Twisted paper' },
      { label: 'Colors', value: 'White or brown kraft' },
      { label: 'Recyclable', value: 'Yes — 100%' },
      { label: 'Min. order', value: '25 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'shopping-bags',
    name: 'To-Go Bags',
    nameEs: 'Bolsas Para Llevar',
    shortDescription: 'Paper takeout bags with twisted handles. 5 sizes. 100% recycled fiber. Kraft or white.',
    shortDescEs: 'Bolsas de papel para llevar con asas retorcidas. 5 tamaños.',
    description: 'Strong paper to-go bags with twisted handles that keep meals secure on the go. Made with 100% recycled fiber paper. Available in kraft or white. 5 sizes for restaurants, retail shops, and events. Handles add about 3.75–4" above the listed bag height.',
    descEs: 'Bolsas de papel resistentes con asas retorcidas para comida para llevar. 5 tamaños disponibles.',
    tags: ['Takeout', 'Restaurant', 'Recycled'],
    features: ['Twisted handles for secure carry', '100% recycled fiber paper', 'Kraft or white options', '5 size options', 'Perfect for restaurants and retail'],
    sizes: ['6x3x9"', '8x4x10"', '10x5x13"', '12x7x14"', '13x7x17"'],
    specs: [
      { label: 'Material', value: '100% recycled fiber paper' },
      { label: 'Handles', value: 'Twisted — adds 3.75-4" above bag' },
      { label: 'Colors', value: 'Kraft or white' },
      { label: 'Sizes', value: '5 options' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 1,
  },
  {
    categorySlug: 'shopping-bags',
    name: 'Die-Cut Handle Bags',
    nameEs: 'Bolsas con Asa Troquelada',
    shortDescription: 'Sturdy poly bags with die-cut handles. Rip, tear, and puncture resistant. Holds up to 5 lbs.',
    shortDescEs: 'Bolsas de polietileno con asas troqueladas. Resistentes a rasgaduras.',
    description: 'Custom die-cut handle bags made from sturdy polyethylene. Rip-, tear-, and puncture-resistant — sturdier than traditional plastic or paper options. Holds up to 5 lbs. 2 mil thickness. Full-color custom printing on both sides. Perfect for retail, events, and trade shows.',
    descEs: 'Bolsas con asas troqueladas de polietileno resistente. Resistentes a rasgaduras y perforaciones.',
    tags: ['Retail', 'Events', 'Durable'],
    features: ['Die-cut handle design', 'Rip, tear, and puncture resistant', 'Holds up to 5 lbs', '2 mil polyethylene', 'Double-sided full-color printing'],
    sizes: ['9x12"', '12x15"', '15x18"', '16x18"'],
    specs: [
      { label: 'Material', value: 'Polyethylene — 2 mil' },
      { label: 'Weight capacity', value: 'Up to 5 lbs' },
      { label: 'Print', value: 'Full color — both sides' },
      { label: 'Min. order', value: '50 units' },
      { label: 'Max. order', value: '10,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 2,
  },
  {
    categorySlug: 'shopping-bags',
    name: 'Compostable Die-Cut Handle Bags',
    nameEs: 'Bolsas Compostables con Asa Troquelada',
    shortDescription: 'Eco-friendly compostable bags with die-cut handles. Breaks down after use.',
    shortDescEs: 'Bolsas compostables con asas troqueladas. Se descomponen después del uso.',
    description: 'An eco-friendly alternative to traditional die-cut handle bags. Made from compostable materials that break down after use. Same sturdy construction and die-cut handle design. Full-color custom printing available.',
    descEs: 'Alternativa ecológica a las bolsas con asa troquelada tradicionales. Material compostable.',
    tags: ['Eco-Friendly', 'Compostable', 'Retail'],
    features: ['Compostable material', 'Die-cut handle design', 'Breaks down after use', 'Full-color custom printing', 'Eco-friendly alternative'],
    sizes: ['9x12"', '12x15"', '15x18"'],
    specs: [
      { label: 'Material', value: 'Compostable bio-material' },
      { label: 'Eco', value: 'Compostable — breaks down after use' },
      { label: 'Print', value: 'Full color' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 3,
  },
  {
    categorySlug: 'shopping-bags',
    name: 'Luxury Shopping Bags',
    nameEs: 'Bolsas de Compras de Lujo',
    shortDescription: 'Premium heavyweight paper bags with ribbon or rope handles. Foil stamp and color options.',
    shortDescEs: 'Bolsas premium de papel pesado con asas de cinta o cuerda. Opciones de foil.',
    description: 'Luxury shopping bags made from heavyweight paper with ribbon or rope handles. Available with foil stamping, colored foil, and full-color print options. The premium feel and finish make these perfect for high-end retail, boutiques, jewelry stores, and special events.',
    descEs: 'Bolsas de lujo de papel pesado con asas de cinta o cuerda. Opciones de estampado en foil.',
    tags: ['Luxury', 'Premium', 'Boutique'],
    features: ['Heavyweight premium paper', 'Ribbon or rope handles', 'Foil stamping options', 'Full-color or single-color print', 'Premium finish for high-end retail'],
    sizes: ['8x4x10"', '10x5x13"', '13x5x10"', '16x6x12"'],
    specs: [
      { label: 'Material', value: 'Heavyweight premium paper' },
      { label: 'Handles', value: 'Ribbon or rope' },
      { label: 'Print', value: 'Full color, single color, or foil stamp' },
      { label: 'Finish', value: 'Premium — high-end feel' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 4,
  },

  // ═══════════════════════════════════════
  // FOOD & BEVERAGE
  // ═══════════════════════════════════════
  {
    categorySlug: 'food-beverage',
    name: 'Full-Print Paper Cups',
    nameEs: 'Vasos de Papel con Impresión Completa',
    shortDescription: 'Custom paper cups with full-color wrap print. Single or double-wall. 4 sizes (10–20 oz).',
    shortDescEs: 'Vasos de papel con impresión a todo color. Pared simple o doble. 4 tamaños.',
    description: 'Custom paper cups with full-color wrap-around printing. Available in 10, 12, 16, or 20 oz sizes. Choose single-wall for cold drinks or double-wall for hot drinks (the extra layer acts as a built-in sleeve). Sip-thru lids available in black or white, sold separately.',
    descEs: 'Vasos de papel con impresión envolvente a todo color. 4 tamaños disponibles.',
    tags: ['Coffee Shop', 'Hot Drinks', 'Cold Drinks'],
    features: ['Full-color wrap-around print', 'Single or double-wall options', '4 sizes: 10, 12, 16, 20 oz', 'Sip-thru lids available (sold separately)', 'Double-wall acts as built-in sleeve'],
    sizes: ['10 oz', '12 oz', '16 oz', '20 oz'],
    specs: [
      { label: 'Material', value: 'Food-grade paper' },
      { label: 'Wall', value: 'Single or double' },
      { label: 'Print', value: 'Full color wrap-around' },
      { label: 'Lids', value: 'Black or white sip-thru (sold separately)' },
      { label: 'Min. order', value: '1 unit' },
      { label: 'Max. order', value: '30,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'food-beverage',
    name: 'Logo Paper Cups',
    nameEs: 'Vasos de Papel con Logo',
    shortDescription: 'Paper cups with logo placement. Cost-effective branding for coffee shops and events.',
    shortDescEs: 'Vasos de papel con logo. Opción económica para cafeterías y eventos.',
    description: 'Paper cups with your logo printed in a designated area — a cost-effective alternative to full-wrap printing. Available in 10, 12, 16, and 20 oz sizes. Perfect for coffee shops, cafés, events, and catering. Sip-thru lids available separately.',
    descEs: 'Vasos de papel con tu logo impreso. Alternativa económica a la impresión envolvente.',
    tags: ['Coffee Shop', 'Budget-Friendly', 'Logo'],
    features: ['Logo print on designated area', 'Cost-effective branding', '4 sizes: 10, 12, 16, 20 oz', 'Sip-thru lids available separately', 'Great for high-volume use'],
    sizes: ['10 oz', '12 oz', '16 oz', '20 oz'],
    specs: [
      { label: 'Material', value: 'Food-grade paper' },
      { label: 'Print', value: 'Logo placement' },
      { label: 'Lids', value: 'Black or white sip-thru (sold separately)' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: false,
    sortOrder: 1,
  },
  {
    categorySlug: 'food-beverage',
    name: 'Coffee Sleeves',
    nameEs: 'Fundas para Vasos de Café',
    shortDescription: 'Custom coffee cup sleeves fitting 12–24 oz cups. Recyclable, hot/cold compatible.',
    shortDescEs: 'Fundas personalizadas para vasos de 12-24 oz. Reciclables.',
    description: 'Custom coffee sleeves that fit most 12–24 oz cups. Recyclable and compatible with both hot and cold drinks — keeps condensation off hands too. Full-color custom printing with your logo, brand, or artwork. Great for coffee shops, cafés, and events.',
    descEs: 'Fundas para vasos de café que se ajustan a la mayoría de vasos de 12-24 oz.',
    tags: ['Coffee Shop', 'Recyclable', 'Sleeves'],
    features: ['Fits 12–24 oz cups', 'Hot and cold drink compatible', 'Recyclable material', 'Full-color custom printing', 'Keeps condensation off hands'],
    sizes: ['One size (fits 12-24 oz)'],
    specs: [
      { label: 'Fits', value: '12–24 oz cups' },
      { label: 'Material', value: 'Recyclable cardboard' },
      { label: 'Print', value: 'Full color' },
      { label: 'Min. order', value: '250 units' },
      { label: 'Max. order', value: '10,000 units' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 2,
  },
  {
    categorySlug: 'food-beverage',
    name: 'Treat Bags',
    nameEs: 'Bolsas para Dulces',
    shortDescription: '100% food-safe paper treat bags with glassine lining. Grease-resistant. 5.75 x 8".',
    shortDescEs: 'Bolsas de papel para dulces 100% seguras para alimentos. Resistentes a la grasa.',
    description: 'Paper treat bags that are 100% food-safe with a grease-resistant glassine lining. Fully recyclable and home-compostable. Available in classic white or kraft. Personalize with your logo, message, or fun design. Perfect for bakeries, candy shops, coffee shops, and events.',
    descEs: 'Bolsas de papel para dulces 100% seguras para alimentos con revestimiento de glasina resistente a la grasa.',
    tags: ['Bakery', 'Food Safe', 'Compostable'],
    features: ['100% food safe', 'Grease-resistant glassine lining', 'Fully recyclable and compostable', 'Classic white or kraft', 'Custom logo and design printing'],
    sizes: ['5.75 x 8"'],
    specs: [
      { label: 'Material', value: 'Paper with glassine lining' },
      { label: 'Food safe', value: 'Yes — 100%' },
      { label: 'Grease resistant', value: 'Yes' },
      { label: 'Size', value: '5.75 x 8"' },
      { label: 'Compostable', value: 'Yes — home compostable' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 3,
  },
  {
    categorySlug: 'food-beverage',
    name: 'Food Boxes',
    nameEs: 'Cajas de Comida',
    shortDescription: 'Custom food-safe boxes for takeout, delivery, and meal prep. Grease and oil resistant.',
    shortDescEs: 'Cajas de comida personalizadas para llevar, delivery y preparación de comidas.',
    description: 'Custom food-safe boxes for takeout, food delivery, and meal prep businesses. Grease- and oil-resistant construction keeps food fresh and packaging clean. Custom printing on the lid or exterior. Ideal for restaurants, food trucks, catering, and meal prep services.',
    descEs: 'Cajas de comida personalizadas para negocios de comida para llevar y delivery.',
    tags: ['Takeout', 'Food Safe', 'Restaurant'],
    features: ['Food-safe construction', 'Grease and oil resistant', 'Custom print on lid or exterior', 'Perfect for takeout and delivery', 'Multiple size options'],
    sizes: ['Small', 'Medium', 'Large'],
    specs: [
      { label: 'Material', value: 'Food-safe paperboard' },
      { label: 'Grease resistant', value: 'Yes' },
      { label: 'Print', value: 'Full color on lid or exterior' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 4,
  },

  // ═══════════════════════════════════════
  // LABELS & STICKERS
  // ═══════════════════════════════════════
  {
    categorySlug: 'labels-stickers',
    name: 'Roll Labels',
    nameEs: 'Etiquetas en Rollo',
    shortDescription: 'Custom roll labels in 18 standard sizes + custom. 6 materials including foil and holographic.',
    shortDescEs: 'Etiquetas en rollo en 18 tamaños estándar + personalizado. 6 materiales disponibles.',
    description: 'Custom roll labels with 18 standard size options plus fully custom shapes and sizes. 6 material choices: white paper, white plastic, clear plastic, silver foil, gold foil, and holographic. Supplied on 3" core rolls for easy use with label dispensers. Full-color high-resolution printing.',
    descEs: 'Etiquetas en rollo con 18 tamaños estándar y opciones de forma personalizada.',
    tags: ['Roll', 'Custom Shape', 'Dispenser'],
    features: ['18 standard sizes + custom shapes/sizes', '6 material options', 'Supplied on 3" core rolls', 'Label dispenser compatible', 'Full-color high-resolution print'],
    sizes: ['1" circle', '1.5" circle', '2" circle', '2.5" circle', '3" circle', '1x2"', '1.5x3"', '2x3"', '2x4"', '3x4"', 'Custom'],
    specs: [
      { label: 'Materials', value: 'White paper, white plastic, clear plastic, silver foil, gold foil, holographic' },
      { label: 'Roll core', value: '3"' },
      { label: 'Print', value: 'Full color, high resolution' },
      { label: 'Sizes', value: '18 standard + custom' },
      { label: 'Min. order', value: '50 labels' },
      { label: 'Turnaround', value: '7 business days' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 0,
  },
  {
    categorySlug: 'labels-stickers',
    name: 'Packaging Stickers',
    nameEs: 'Stickers de Empaque',
    shortDescription: 'Full-color stickers on rolls. Vinyl, water-resistant plastic, and foil materials.',
    shortDescEs: 'Stickers a todo color en rollos. Vinilo, plástico resistente al agua y foil.',
    description: 'Full-color packaging stickers printed on rolls in various shapes and sizes. Material options include durable vinyl, water-resistant plastic, silver foil paper, and gold foil paper. Perfect for sealing bags, branding boxes, and adding a finishing touch to any package.',
    descEs: 'Stickers de empaque a todo color en rollos. Varios materiales disponibles.',
    tags: ['Sealing', 'Branding', 'Foil'],
    features: ['Full-color printing on rolls', 'Multiple shapes and sizes', 'Vinyl, water-resistant plastic, foil options', 'Perfect for sealing and branding', 'Easy peel-and-stick application'],
    sizes: ['Various shapes and sizes'],
    specs: [
      { label: 'Materials', value: 'Vinyl, water-resistant plastic, silver/gold foil paper' },
      { label: 'Print', value: 'Full color' },
      { label: 'Format', value: 'Roll' },
      { label: 'Turnaround', value: '7 business days' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 1,
  },
  {
    categorySlug: 'labels-stickers',
    name: 'Sticker Singles',
    nameEs: 'Stickers Individuales',
    shortDescription: 'Individual die-cut stickers on sheets. Starting at 10 for $10. Multiple materials.',
    shortDescEs: 'Stickers individuales troquelados en hojas. Desde 10 por $10.',
    description: 'Individual die-cut stickers perfect for small runs, samples, giveaways, and branding. Available in the same material options as roll labels. Starting at just 10 stickers for $10 with volume discounts at 25+ units.',
    descEs: 'Stickers individuales troquelados para pequeñas cantidades, muestras y regalos.',
    tags: ['Small Run', 'Samples', 'Giveaways'],
    features: ['Individual die-cut stickers', 'Same materials as roll labels', 'Low minimum: 10 stickers', 'Volume discounts at 25+', 'Perfect for samples and giveaways'],
    sizes: ['Custom sizes'],
    specs: [
      { label: 'Materials', value: 'Paper, vinyl, foil, holographic' },
      { label: 'Print', value: 'Full color' },
      { label: 'Min. order', value: '10 stickers' },
      { label: 'Pricing', value: 'Starting at $10 for 10' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 2,
  },

  // ═══════════════════════════════════════
  // ACCESSORIES
  // ═══════════════════════════════════════
  {
    categorySlug: 'accessories',
    name: 'Water-Activated Packaging Tape',
    nameEs: 'Cinta de Empaque Activada por Agua',
    shortDescription: 'White kraft paper gummed tape. 2.9" wide, 100\' or 300\' rolls. Logo repeat options.',
    shortDescEs: 'Cinta de papel kraft blanco activada por agua. Varias opciones de repetición de logo.',
    description: 'Water-activated gummed paper tape crafted from white kraft paper with reinforced heavy-duty construction. 2.9" wide on a 3" ID core. Available in 100\' or 300\' roll lengths. Logo repeat options: 3", 4", 6", or 12". Full-color printing for professional branded sealing.',
    descEs: 'Cinta de papel kraft activada por agua con construcción reforzada.',
    tags: ['Tape', 'Sealing', 'Eco-Friendly'],
    features: ['Water-activated gummed paper', 'White kraft with reinforced construction', '2.9" wide on 3" ID core', '100\' or 300\' roll lengths', 'Logo repeat: 3", 4", 6", or 12"'],
    sizes: ['2.9" x 100\'', '2.9" x 300\''],
    specs: [
      { label: 'Material', value: 'White kraft paper — reinforced' },
      { label: 'Width', value: '2.9"' },
      { label: 'Core', value: '3" ID' },
      { label: 'Lengths', value: '100\' or 300\'' },
      { label: 'Logo repeat', value: '3", 4", 6", or 12"' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: false,
    sortOrder: 0,
  },
  {
    categorySlug: 'accessories',
    name: 'Self-Adhesive Packaging Tape',
    nameEs: 'Cinta de Empaque Autoadhesiva',
    shortDescription: 'White or clear plastic self-adhesive tape with full-bleed printing.',
    shortDescEs: 'Cinta autoadhesiva blanca o transparente con impresión a sangre completa.',
    description: 'Self-adhesive packaging tape in white or clear plastic with full-bleed custom printing. Easy to apply — no water activation needed. Perfect for sealing mailer boxes and shipping boxes with your branding.',
    descEs: 'Cinta de empaque autoadhesiva en plástico blanco o transparente con impresión personalizada.',
    tags: ['Tape', 'Self-Adhesive', 'Branding'],
    features: ['Self-adhesive — no water needed', 'White or clear plastic', 'Full-bleed custom printing', 'Easy application', 'Professional branded sealing'],
    sizes: ['Standard width'],
    specs: [
      { label: 'Material', value: 'White or clear plastic' },
      { label: 'Adhesive', value: 'Self-adhesive' },
      { label: 'Print', value: 'Full bleed' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: false,
    sortOrder: 1,
  },
  {
    categorySlug: 'accessories',
    name: 'Custom Tissue Paper',
    nameEs: 'Papel Tissue Personalizado',
    shortDescription: 'Custom printed tissue paper in 4 sizes. Standard or premium options on white paper.',
    shortDescEs: 'Papel tissue personalizado en 4 tamaños. Opciones estándar o premium.',
    description: 'Custom tissue paper to elevate your unboxing experience. Available in 4 sizes with standard or premium options on white paper. Add your logo, brand pattern, or custom design. Perfect as box filler and wrapping for product packaging and gift boxes.',
    descEs: 'Papel tissue personalizado para mejorar la experiencia de unboxing.',
    tags: ['Unboxing', 'Wrapping', 'Filler'],
    features: ['4 size options', 'Standard or premium paper', 'Custom logo and design printing', 'White paper base', 'Elevates unboxing experience'],
    sizes: ['15x20"', '18x24"', '20x30"', '24x36"'],
    specs: [
      { label: 'Material', value: 'White tissue paper' },
      { label: 'Quality', value: 'Standard or premium' },
      { label: 'Print', value: 'Custom design / logo' },
      { label: 'Sizes', value: '4 options' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: false,
    sortOrder: 2,
  },
  {
    categorySlug: 'accessories',
    name: 'Crinkle Paper',
    nameEs: 'Papel Arrugado',
    shortDescription: 'Box filler crinkle paper. Sold in 10 lb boxes. Kraft, white, or black.',
    shortDescEs: 'Papel arrugado para relleno. Cajas de 10 lbs. Kraft, blanco o negro.',
    description: 'Crinkle paper filler for product boxes and gift packaging. Sold in 10 lb boxes (24" x 16" x 12"). Available in 3 classic colors: kraft, white, and black. Adds a touch of elegance and protection to your packaging.',
    descEs: 'Papel arrugado para relleno de cajas y empaque de regalos. 3 colores disponibles.',
    tags: ['Filler', 'Unboxing', 'Protection'],
    features: ['Sold in 10 lb boxes', '24" x 16" x 12" box dimensions', '3 colors: kraft, white, black', 'Great box filler and protection', 'Adds elegance to packaging'],
    sizes: ['10 lb box (24x16x12")'],
    specs: [
      { label: 'Weight', value: '10 lbs per box' },
      { label: 'Box size', value: '24" x 16" x 12"' },
      { label: 'Colors', value: 'Kraft, white, black' },
    ],
    basePrice: 0,
    allowLogoUpload: false,
    allowCustomText: false,
    sortOrder: 3,
  },
  {
    categorySlug: 'accessories',
    name: 'Hang Tags',
    nameEs: 'Etiquetas Colgantes',
    shortDescription: 'Custom hang tags in multiple shapes and sizes. Plastic and foil finish options.',
    shortDescEs: 'Etiquetas colgantes personalizadas en varias formas y tamaños.',
    description: 'Custom hang tags that tie easily to boxes, bags, or clothing. Available in multiple shapes, sizes, and finishes including plastic and foil options. Perfect for adding product info, branding, or a personal touch to your packaging.',
    descEs: 'Etiquetas colgantes personalizadas para cajas, bolsas o ropa.',
    tags: ['Branding', 'Retail', 'Clothing'],
    features: ['Multiple shapes and sizes', 'Plastic and foil finish options', 'Easy to tie to boxes, bags, clothing', 'Custom design and branding', 'Full-color printing'],
    sizes: ['Various shapes and sizes'],
    specs: [
      { label: 'Material', value: 'Cardstock — plastic and foil options' },
      { label: 'Print', value: 'Full color' },
      { label: 'Attachment', value: 'Tie-on' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 4,
  },
  {
    categorySlug: 'accessories',
    name: 'Folded Hang Tags',
    nameEs: 'Etiquetas Colgantes Plegadas',
    shortDescription: 'Folded hang tags with extra inside space for nutrition, care instructions, or size charts.',
    shortDescEs: 'Etiquetas plegadas con espacio interior para información nutricional o instrucciones.',
    description: 'Folded hang tags with extra space on the inside for nutritional info, care instructions, size charts, or additional branding. Print on the inside, outside, or both. Perfect for food products, clothing, and retail items that need more detailed information.',
    descEs: 'Etiquetas plegadas con espacio adicional para información detallada del producto.',
    tags: ['Detailed Info', 'Nutrition', 'Care Instructions'],
    features: ['Extra inside space for detailed info', 'Print inside, outside, or both', 'Great for nutrition and care info', 'Size charts and product details', 'Multiple sizes available'],
    sizes: ['Various sizes'],
    specs: [
      { label: 'Material', value: 'Cardstock' },
      { label: 'Print', value: 'Inside, outside, or both' },
      { label: 'Use', value: 'Nutrition, care instructions, sizing' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 5,
  },
  {
    categorySlug: 'accessories',
    name: 'Packaging Inserts',
    nameEs: 'Insertos de Empaque',
    shortDescription: 'Custom insert cards for thank-you notes, review requests, discount codes, and more.',
    shortDescEs: 'Tarjetas de inserto para notas de agradecimiento, solicitudes de reseña y códigos de descuento.',
    description: 'Custom packaging insert cards that turn every shipment into a customer engagement opportunity. Use them to say thank you, ask for a review, offer a discount on future purchases, share social media handles, or tell your brand story. Tuck them into product shipments, mailer boxes, or shopping bags.',
    descEs: 'Tarjetas de inserto personalizadas para mejorar la interacción con el cliente en cada envío.',
    tags: ['Thank You', 'Discount', 'Review Request'],
    features: ['Custom full-color printing', 'Thank-you notes and review requests', 'Discount codes and promotions', 'Social media and brand storytelling', 'Tucks into boxes, mailers, and bags'],
    sizes: ['3.5x2" (business card)', '4x6" (postcard)', '5x7"'],
    specs: [
      { label: 'Material', value: 'Premium cardstock' },
      { label: 'Print', value: 'Full color — front and back' },
      { label: 'Sizes', value: '3 standard options' },
    ],
    basePrice: 0,
    allowLogoUpload: true,
    allowCustomText: true,
    sortOrder: 6,
  },
];

// ═══════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════

async function seedPackaging() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const now = new Date();

  // Check for existing categories with same slugs to avoid duplicates
  const existingSlugs = await db
    .collection('categories')
    .find({ slug: { $in: CATEGORIES.map((c) => c.slug) } })
    .toArray();

  if (existingSlugs.length > 0) {
    console.log(`Found ${existingSlugs.length} existing categories with matching slugs:`);
    existingSlugs.forEach((c) => console.log(`  - ${c.name} (${c.slug})`));
    console.log('Skipping category creation for those. Delete them first if you want to re-seed.');

    // Remove matching slugs from CATEGORIES
    const existingSlugSet = new Set(existingSlugs.map((c) => c.slug));
    const newCategories = CATEGORIES.filter((c) => !existingSlugSet.has(c.slug));

    if (newCategories.length === 0) {
      console.log('No new categories to create.');
    } else {
      console.log(`Creating ${newCategories.length} new categories...`);
      const categoryDocs = newCategories.map((c) => ({
        _id: new ObjectId(),
        ...c,
        isVisible: true,
        createdAt: now,
        updatedAt: now,
      }));
      await db.collection('categories').insertMany(categoryDocs);
      console.log(`  ✓ ${categoryDocs.length} categories created`);
    }
  } else {
    console.log('Creating all packaging categories...');
    const categoryDocs = CATEGORIES.map((c) => ({
      _id: new ObjectId(),
      ...c,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    }));
    await db.collection('categories').insertMany(categoryDocs);
    console.log(`  ✓ ${categoryDocs.length} categories created`);
  }

  // Build slug → categoryId map from DB (includes both existing and new)
  const allCategories = await db
    .collection('categories')
    .find({ slug: { $in: CATEGORIES.map((c) => c.slug) } })
    .toArray();

  const slugToCategoryId: Record<string, string> = {};
  for (const c of allCategories) {
    slugToCategoryId[c.slug] = c._id.toString();
  }

  // Create products
  console.log('Creating packaging products...');
  let created = 0;
  let skipped = 0;

  for (const p of PRODUCTS) {
    const categoryId = slugToCategoryId[p.categorySlug];
    if (!categoryId) {
      console.log(`  ⚠ Skipping "${p.name}" — category "${p.categorySlug}" not found`);
      skipped++;
      continue;
    }

    // Check if product already exists in this category
    const existing = await db
      .collection('products')
      .findOne({ name: p.name, categoryId });

    if (existing) {
      console.log(`  ⚠ Skipping "${p.name}" — already exists`);
      skipped++;
      continue;
    }

    await db.collection('products').insertOne({
      _id: new ObjectId(),
      categoryId,
      name: p.name,
      nameEs: p.nameEs,
      shortDescription: p.shortDescription,
      shortDescEs: p.shortDescEs,
      description: p.description,
      descEs: p.descEs,
      tags: p.tags,
      features: p.features,
      sizes: p.sizes,
      specs: p.specs,
      basePrice: p.basePrice,
      images: [],
      pricingTiers: [],
      sortOrder: p.sortOrder,
      isActive: true,
      isFeatured: false,
      allowLogoUpload: p.allowLogoUpload,
      allowCustomText: p.allowCustomText,
      createdAt: now,
      updatedAt: now,
    });
    created++;
  }

  console.log(`  ✓ ${created} products created`);
  if (skipped > 0) console.log(`  ⚠ ${skipped} products skipped (already exist)`);

  console.log('\nPackaging seed complete!');
  await client.close();
}

seedPackaging().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

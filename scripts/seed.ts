import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DATABASE!;

// ── Categories ──

const CATEGORIES = [
  { name: 'Cups',             nameEs: 'Vasos',              slug: 'cups',             description: 'Custom printed hot & cold beverage cups',     descriptionEs: 'Vasos personalizados para bebidas',   iconName: 'Coffee',           sortOrder: 0 },
  { name: 'Bags',             nameEs: 'Bolsas',             slug: 'bags',             description: 'Branded paper bags for retail & takeout',     descriptionEs: 'Bolsas de papel con tu marca',        iconName: 'ShoppingBag',      sortOrder: 1 },
  { name: 'Boxes',            nameEs: 'Cajas',              slug: 'boxes',            description: 'Custom printed boxes for food & e-commerce',  descriptionEs: 'Cajas personalizadas para tu negocio', iconName: 'Box',              sortOrder: 2 },
  { name: 'Food Containers',  nameEs: 'Envases de Comida',  slug: 'food-containers',  description: 'Eco-friendly branded food containers',        descriptionEs: 'Envases ecológicos con tu logo',      iconName: 'UtensilsCrossed',  sortOrder: 3 },
  { name: 'Labels & Stickers', nameEs: 'Etiquetas',         slug: 'labels',           description: 'Waterproof vinyl labels & die-cut stickers',  descriptionEs: 'Etiquetas y stickers personalizados', iconName: 'Sticker',          sortOrder: 4 },
];

const PRODUCTS = [
  {
    categorySlug: 'cups',
    name: 'Custom Printed Coffee Cups',
    shortDescription: 'Hot beverage cups with full-color print of your logo. Available in 8oz, 12oz, and 16oz sizes.',
    description: 'Make every sip a brand moment. Our hot beverage cups feature full-color printing of your logo, brand colors, and custom artwork directly on food-grade paperboard. Designed for coffee shops, restaurants, catering companies, and food trucks — these cups keep drinks hot and your brand visible. Compatible with standard lids and sleeves, and available in a matte or gloss finish to match your brand aesthetic.',
    tags: ['Hot Drinks', 'Custom Print'],
    features: ['Full-color logo & branding print', 'Available in 8oz, 12oz, and 16oz', 'Food-grade, heat-resistant paperboard', 'Compatible with standard lids & sleeves', 'Matte or gloss finish options'],
    sizes: ['8oz', '12oz', '16oz'],
    specs: [{ label: 'Material', value: 'Food-grade paperboard' }, { label: 'Print type', value: 'Full-color digital' }, { label: 'Min. order', value: '250 units' }, { label: 'Turnaround', value: '10–14 business days' }, { label: 'Finish', value: 'Matte or gloss' }],
    basePrice: 2.50,
  },
  {
    categorySlug: 'cups',
    name: 'Cold Beverage Cups',
    shortDescription: 'Clear plastic cups with your branding for cold drinks, smoothies, and bubble tea. Lid options available.',
    description: 'Crystal-clear PET plastic cups that put your branding front and center. Ideal for smoothies, iced coffees, bubble tea, lemonades, and all cold drinks. The transparent wall lets the product shine while your brand wraps around the cup in full color. Available in multiple sizes with flat, dome, or straw-slot lids. BPA-free and stackable for easy kitchen storage.',
    tags: ['Cold Drinks', 'Clear Plastic'],
    features: ['Crystal-clear BPA-free PET plastic', 'Full-color wrap-around print', 'Flat, dome, or straw-slot lid options', 'Stackable for easy storage', 'Food-safe, FDA-compliant materials'],
    sizes: ['12oz', '16oz', '24oz', '32oz'],
    specs: [{ label: 'Material', value: 'BPA-free PET plastic' }, { label: 'Print type', value: 'Full-color wrap print' }, { label: 'Min. order', value: '500 units' }, { label: 'Turnaround', value: '10–14 business days' }, { label: 'Lid options', value: 'Flat, dome, straw-slot' }],
    basePrice: 1.90,
  },
  {
    categorySlug: 'bags',
    name: 'Kraft Paper Bags',
    shortDescription: 'Premium kraft paper shopping bags with rope handles and your logo. Perfect for retail and takeout.',
    description: 'Premium natural kraft paper shopping bags that make your brand impossible to miss. Sturdy twisted-rope or flat-ribbon handles, a flat bottom for stability, and full-color logo printing make these perfect for retail boutiques, bakeries, restaurants, and takeout. Eco-friendly and 100% recyclable — a great way to show your commitment to sustainability while keeping your brand visible long after the sale.',
    tags: ['Retail', 'Eco-Friendly'],
    features: ['Premium natural kraft paper', 'Twisted rope or flat-ribbon handles', 'Full-color logo print', 'Eco-friendly & 100% recyclable', 'Flat bottom for stability'],
    sizes: ['Small', 'Medium', 'Large', 'XL'],
    specs: [{ label: 'Material', value: '100% kraft paper' }, { label: 'Handle', value: 'Rope or flat ribbon' }, { label: 'Min. order', value: '250 units' }, { label: 'Turnaround', value: '12–16 business days' }, { label: 'Recyclable', value: 'Yes' }],
    basePrice: 2.00,
  },
  {
    categorySlug: 'bags',
    name: 'Flat Bottom Paper Bags',
    shortDescription: 'Sturdy flat-bottom paper bags ideal for bakeries, boutiques, and food service.',
    description: 'Self-standing flat-bottom paper bags that hold their shape and look great on any counter or display. Perfect for bakeries, coffee shops, boutiques, and food service operations. Available in natural brown or white kraft with single or full-color custom print. Optional grease-resistant liner makes them ideal for direct food contact. These bags are as functional as they are good-looking.',
    tags: ['Bakery', 'Food Service'],
    features: ['Self-standing flat bottom design', 'Brown or white kraft options', 'Full-color or single-color print', 'Optional grease-resistant liner', 'Folded top or open-top styles'],
    sizes: ['Small', 'Medium', 'Large'],
    specs: [{ label: 'Material', value: 'Kraft paper' }, { label: 'Colors', value: 'Brown or white' }, { label: 'Min. order', value: '500 units' }, { label: 'Turnaround', value: '12–16 business days' }, { label: 'Liner', value: 'Optional grease-resistant' }],
    basePrice: 1.40,
  },
  {
    categorySlug: 'boxes',
    name: 'Custom Pizza Boxes',
    shortDescription: 'Corrugated pizza boxes with full-color print. Available in 10", 12", 14", and 16" sizes.',
    description: 'Turn every pizza delivery into a brand opportunity. Our corrugated pizza boxes feature vibrant full-color exterior printing that makes your logo pop from kitchen to doorstep. Built-in ventilation holes keep the crust crispy, and the sturdy double-wall corrugated construction protects every slice. Easy auto-lock assembly speeds up kitchen workflow. Available in four sizes to fit your entire menu.',
    tags: ['Food Delivery', 'Corrugated'],
    features: ['Full-color exterior branding print', 'Corrugated construction for insulation', 'Built-in ventilation holes', 'Food-safe interior coating', 'Easy auto-lock assembly'],
    sizes: ['10"', '12"', '14"', '16"'],
    specs: [{ label: 'Material', value: 'Corrugated cardboard' }, { label: 'Print', value: 'Full-color exterior' }, { label: 'Min. order', value: '250 units' }, { label: 'Turnaround', value: '12–16 business days' }, { label: 'Interior', value: 'Food-safe white coating' }],
    basePrice: 3.50,
  },
  {
    categorySlug: 'boxes',
    name: 'Mailer & Gift Boxes',
    shortDescription: 'Rigid mailer boxes with magnetic closure and custom insert options. Ideal for subscription boxes.',
    description: "Deliver an unforgettable unboxing experience with our rigid mailer and gift boxes. Magnetic closure, premium board construction, and full-color printing inside and out make these ideal for e-commerce brands, subscription boxes, and premium retail. Add custom foam or tissue inserts to complete the luxury feel. These boxes don't just protect your product — they tell your brand story the moment they're opened.",
    tags: ['E-commerce', 'Gift'],
    features: ['Rigid chipboard construction for premium feel', 'Magnetic or tuck-in closure options', 'Full-color exterior & interior print', 'Custom foam or tissue inserts available', 'Perfect for subscription & gift products'],
    sizes: ['Small', 'Medium', 'Large', 'Custom'],
    specs: [{ label: 'Material', value: 'Rigid chipboard' }, { label: 'Closure', value: 'Magnetic or tuck-in' }, { label: 'Min. order', value: '100 units' }, { label: 'Turnaround', value: '14–18 business days' }, { label: 'Inserts', value: 'Optional foam/tissue' }],
    basePrice: 5.80,
  },
  {
    categorySlug: 'food-containers',
    name: 'Custom Food Bowls',
    shortDescription: 'Eco-friendly fiber bowls with your logo. Microwave safe and ideal for rice bowls, salads, and more.',
    description: 'Eco-friendly sugarcane fiber bowls that carry your brand and your commitment to sustainability. Microwave and freezer safe with a leak-resistant coating, these bowls are perfect for açaí bowls, rice dishes, grain salads, soups, and more. Custom print on the lid or body keeps your brand visible on every order. ASTM-certified compostable — a choice your customers will appreciate as much as your food.',
    tags: ['Eco-Friendly', 'Microwave Safe'],
    features: ['Sugarcane fiber (bagasse) material', 'Microwave & freezer safe', 'Leak-resistant coating', 'ASTM-certified compostable', 'Custom print on lid or body'],
    sizes: ['12oz', '16oz', '24oz', '32oz'],
    specs: [{ label: 'Material', value: 'Sugarcane fiber (bagasse)' }, { label: 'Microwave safe', value: 'Yes' }, { label: 'Min. order', value: '500 units' }, { label: 'Turnaround', value: '12–16 business days' }, { label: 'Compostable', value: 'Yes — ASTM certified' }],
    basePrice: 1.85,
  },
  {
    categorySlug: 'food-containers',
    name: 'Takeout Containers',
    shortDescription: 'Clamshell and hinged containers with printed branding. Leak-proof and grease-resistant.',
    description: 'Branded clamshell and hinged takeout containers that keep food fresh and your brand visible from kitchen to customer. Grease-proof and leak-resistant construction makes them ideal for restaurants, food trucks, and catering operations. Vented lids release steam to keep food at the right texture. Available in kraft paper or eco-friendly bagasse, stackable for efficient kitchen storage.',
    tags: ['Takeout', 'Leak-Proof'],
    features: ['Clamshell or hinged lid styles', 'Grease-proof & leak-resistant', 'Custom print on lid or exterior', 'Vented lid for steam release', 'Stackable for kitchen efficiency'],
    sizes: ['Small', 'Medium', 'Large', 'XL'],
    specs: [{ label: 'Material', value: 'Kraft paper or bagasse' }, { label: 'Lid style', value: 'Clamshell or separate' }, { label: 'Min. order', value: '500 units' }, { label: 'Turnaround', value: '10–14 business days' }, { label: 'Grease-proof', value: 'Yes' }],
    basePrice: 1.50,
  },
  {
    categorySlug: 'labels',
    name: 'Custom Product Labels',
    shortDescription: 'High-quality vinyl labels for bottles, jars, and packaging. Waterproof and dishwasher safe.',
    description: 'High-quality vinyl labels that stick to any surface and make your products stand out on the shelf. Waterproof, UV-resistant, and dishwasher safe — built to last through every environment your product encounters. Available in white or clear vinyl with matte, gloss, or soft-touch laminate finish. Die-cut to any shape: round, square, oval, or fully custom. High-resolution print ensures every detail of your branding looks sharp.',
    tags: ['Waterproof', 'Vinyl'],
    features: ['Premium white or clear vinyl material', 'Waterproof & UV-resistant', 'Dishwasher safe', 'High-resolution full-color print', 'Any shape: round, square, custom die-cut'],
    sizes: ['Custom sizes available'],
    specs: [{ label: 'Material', value: 'White or clear vinyl' }, { label: 'Finish', value: 'Matte, gloss, or soft-touch' }, { label: 'Min. order', value: '100 units' }, { label: 'Turnaround', value: '7–10 business days' }, { label: 'Waterproof', value: 'Yes' }],
    basePrice: 0.65,
  },
  {
    categorySlug: 'labels',
    name: 'Roll Stickers',
    shortDescription: 'Die-cut roll stickers in any shape and size. Perfect for sealing bags, branding boxes, and more.',
    description: 'Custom die-cut roll stickers for high-volume sealing, branding, and promotional use. Supplied on a roll for fast, easy application by hand or label dispenser machine — perfect for high-volume packaging lines. Available in any shape and size, with permanent or removable adhesive. Full-color or single-color print on paper or vinyl. A cost-effective way to brand bags, boxes, envelopes, and giveaways at scale.',
    tags: ['Die-Cut', 'Custom Shape'],
    features: ['Any shape — round, oval, custom die-cut', 'Supplied on a roll for easy application', 'Compatible with label dispensers', 'Permanent or removable adhesive', 'Full-color or single-color print'],
    sizes: ['Custom sizes available'],
    specs: [{ label: 'Material', value: 'Paper or vinyl' }, { label: 'Adhesive', value: 'Permanent or removable' }, { label: 'Min. order', value: '500 units' }, { label: 'Turnaround', value: '7–10 business days' }, { label: 'Roll format', value: 'Yes — dispenser compatible' }],
    basePrice: 0.42,
  },
];

const STAFF = [
  { name: 'Rafael Diaz',    role: 'Owner',       email: 'rafael@packbrandsolutions.com',  phone: '(551) 389-3188', status: 'Active',   lastActive: new Date('2026-02-23'), ordersHandled: 0   },
  { name: 'Carmen Reyes',   role: 'Sales',       email: 'carmen@packbrandsolutions.com',  phone: '(551) 389-3189', status: 'Active',   lastActive: new Date('2026-02-23'), ordersHandled: 48  },
  { name: 'Tony Bautista',  role: 'Sales',       email: 'tony@packbrandsolutions.com',    phone: '(551) 389-3190', status: 'Active',   lastActive: new Date('2026-02-22'), ordersHandled: 35  },
  { name: 'Lena Park',      role: 'Fulfillment', email: 'lena@packbrandsolutions.com',    phone: '(551) 389-3191', status: 'Active',   lastActive: new Date('2026-02-23'), ordersHandled: 112 },
  { name: 'Marcus Webb',    role: 'Fulfillment', email: 'marcus@packbrandsolutions.com',  phone: '(551) 389-3192', status: 'Active',   lastActive: new Date('2026-02-21'), ordersHandled: 98  },
  { name: 'Isabela Rocha',  role: 'Design',      email: 'isabela@packbrandsolutions.com', phone: '(551) 389-3193', status: 'Inactive', lastActive: new Date('2026-01-15'), ordersHandled: 27  },
];

const DEFAULT_SETTINGS = {
  _id: 'global',
  storeName: 'PackBrand Solutions',
  storeEmail: 'info@packbrandsolutions.com',
  storePhone: '(551) 389-3188',
  storeAddress: '123 Main St, Hackensack, NJ 07601',
  currency: 'USD',
  timezone: 'America/New_York',
  notifications: {
    newOrders: true,
    lowStock: true,
    newUsers: true,
    inquiries: true,
  },
};

async function seed() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // Clear existing data
  console.log('Clearing existing collections...');
  const collections = ['categories', 'products', 'orders', 'staff', 'settings', 'reviews'];
  for (const name of collections) {
    try {
      await db.collection(name).drop();
    } catch {
      // Collection may not exist
    }
  }

  // Seed categories first
  console.log('Seeding categories...');
  const now = new Date();
  const categoryDocs = CATEGORIES.map((c) => ({
    _id: new ObjectId(),
    ...c,
    isVisible: true,
    createdAt: now,
    updatedAt: now,
  }));
  await db.collection('categories').insertMany(categoryDocs);
  console.log(`  ✓ ${categoryDocs.length} categories`);

  // Build slug → categoryId map
  const slugToCategoryId: Record<string, string> = {};
  const slugToCategoryName: Record<string, string> = {};
  for (const c of categoryDocs) {
    slugToCategoryId[c.slug] = c._id.toString();
    slugToCategoryName[c.slug] = c.name;
  }

  // Seed products (reference categoryId instead of category string)
  console.log('Seeding products...');
  const productDocs = PRODUCTS.map((p) => ({
    _id: new ObjectId(),
    categoryId: slugToCategoryId[p.categorySlug],
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    tags: p.tags,
    features: p.features,
    sizes: p.sizes,
    specs: p.specs,
    basePrice: p.basePrice,
    images: [],
    pricingTiers: [],
    sortOrder: 0,
    isActive: true,
    isFeatured: ['Custom Printed Coffee Cups', 'Kraft Paper Bags', 'Custom Pizza Boxes', 'Custom Product Labels'].includes(p.name),
    allowLogoUpload: true,
    allowCustomText: false,
    createdAt: now,
    updatedAt: now,
  }));
  await db.collection('products').insertMany(productDocs);
  console.log(`  ✓ ${productDocs.length} products`);

  // Seed orders (use categoryId + categoryName)
  console.log('Seeding orders...');
  const ORDERS = [
    { orderNumber: 'ORD-1021', contact: { firstName: 'Maria',  lastName: 'Lopez',    email: 'maria@gopicadera.com',    phone: '(551) 555-0142', company: 'Go Picadera' },       shippingAddress: { line1: '847 Bergenline Ave', line2: 'Suite 2B', city: 'Union City',      state: 'NJ', zip: '07087', country: 'United States' }, itemName: 'Custom Printed Coffee Cups', categorySlug: 'cups',            size: '12oz',   qty: 500,  unitPrice: 2.48, lineTotal: 1240, subtotal: 1240, shipping: 0, total: 1240, status: 'Delivered',  trackingNumber: '1Z999AA10123456784', createdAt: new Date('2026-02-20') },
    { orderNumber: 'ORD-1020', contact: { firstName: 'James',  lastName: 'Rivera',   email: 'james@kimchismoke.com',   phone: '(201) 555-0198', company: 'Kimchi Smoke' },      shippingAddress: { line1: '225 Main St',         city: 'Hackensack',     state: 'NJ', zip: '07601', country: 'United States' }, itemName: 'Kraft Paper Bags',           categorySlug: 'bags',            size: 'Medium', qty: 250,  unitPrice: 2.48, lineTotal: 620,  subtotal: 620,  shipping: 0, total: 620,  status: 'Shipped',   trackingNumber: '1Z999AA10123456799', createdAt: new Date('2026-02-18') },
    { orderNumber: 'ORD-1019', contact: { firstName: 'Sofia',  lastName: 'Perez',    email: 'sofia@lafortaleza.com',   phone: '(551) 555-0231', company: 'La Fortaleza' },      shippingAddress: { line1: '450 Broadway',         city: 'Bayonne',        state: 'NJ', zip: '07002', country: 'United States' }, itemName: 'Custom Food Bowls',          categorySlug: 'food-containers', size: '16oz',   qty: 1000, unitPrice: 1.98, lineTotal: 1980, subtotal: 1980, shipping: 0, total: 1980, status: 'Processing', notes: 'Rush order — need by end of month', createdAt: new Date('2026-02-17') },
    { orderNumber: 'ORD-1018', contact: { firstName: 'Carlos', lastName: 'Mendez',   email: 'carlos@parriyas.com',     phone: '(201) 555-0314', company: 'Parriyas' },          shippingAddress: { line1: '88 River Rd',          city: 'Edgewater',      state: 'NJ', zip: '07020', country: 'United States' }, itemName: 'Custom Pizza Boxes',         categorySlug: 'boxes',           size: '14"',    qty: 250,  unitPrice: 3.48, lineTotal: 870,  subtotal: 870,  shipping: 0, total: 870,  status: 'Delivered',  trackingNumber: '1Z999AA10123456812', createdAt: new Date('2026-02-15') },
    { orderNumber: 'ORD-1017', contact: { firstName: 'Aisha',  lastName: 'Johnson',  email: 'aisha@aishaskitchen.com', phone: '(973) 555-0455', company: "Aisha's Kitchen" },   shippingAddress: { line1: '12 MLK Blvd',          city: 'Newark',         state: 'NJ', zip: '07102', country: 'United States' }, itemName: 'Cold Beverage Cups',         categorySlug: 'cups',            size: '16oz',   qty: 500,  unitPrice: 1.90, lineTotal: 950,  subtotal: 950,  shipping: 0, total: 950,  status: 'Delivered',  trackingNumber: '1Z999AA10123456827', createdAt: new Date('2026-02-14') },
    { orderNumber: 'ORD-1016', contact: { firstName: 'Luis',   lastName: 'Torres',   email: 'luis@elsaborlatino.com',  phone: '(201) 555-0567', company: 'El Sabor Latino' },   shippingAddress: { line1: '330 Palisade Ave',     city: 'Cliffside Park', state: 'NJ', zip: '07010', country: 'United States' }, itemName: 'Takeout Containers',         categorySlug: 'food-containers', size: 'Large',  qty: 500,  unitPrice: 1.48, lineTotal: 740,  subtotal: 740,  shipping: 0, total: 740,  status: 'Shipped',   trackingNumber: '1Z999AA10123456834', createdAt: new Date('2026-02-12') },
    { orderNumber: 'ORD-1015', contact: { firstName: 'Nina',   lastName: 'Chen',     email: 'nina@bobahouse.com',      phone: '(201) 555-0678', company: 'Boba House' },        shippingAddress: { line1: '55 Bergen Turnpike',    city: 'Ridgefield Park', state: 'NJ', zip: '07660', country: 'United States' }, itemName: 'Cold Beverage Cups',         categorySlug: 'cups',            size: '24oz',   qty: 1000, unitPrice: 1.76, lineTotal: 1760, subtotal: 1760, shipping: 0, total: 1760, status: 'Delivered',  trackingNumber: '1Z999AA10123456841', createdAt: new Date('2026-02-10') },
    { orderNumber: 'ORD-1014', contact: { firstName: 'David',  lastName: 'Ortiz',    email: 'david@sliceanddice.com',  phone: '(551) 555-0789', company: 'Slice & Dice' },      shippingAddress: { line1: '140 Central Ave',       city: 'Jersey City',    state: 'NJ', zip: '07307', country: 'United States' }, itemName: 'Custom Pizza Boxes',         categorySlug: 'boxes',           size: '16"',    qty: 500,  unitPrice: 2.84, lineTotal: 1420, subtotal: 1420, shipping: 0, total: 1420, status: 'Delivered',  trackingNumber: '1Z999AA10123456858', createdAt: new Date('2026-02-08') },
    { orderNumber: 'ORD-1013', contact: { firstName: 'Elena',  lastName: 'Vargas',   email: 'elena@bloomboutique.com', phone: '(201) 555-0890', company: 'Bloom Boutique' },    shippingAddress: { line1: '22 Oak St',             city: 'Tenafly',        state: 'NJ', zip: '07670', country: 'United States' }, itemName: 'Mailer & Gift Boxes',        categorySlug: 'boxes',           size: 'Medium', qty: 100,  unitPrice: 5.80, lineTotal: 580,  subtotal: 580,  shipping: 0, total: 580,  status: 'Delivered',  trackingNumber: '1Z999AA10123456865', createdAt: new Date('2026-02-06') },
    { orderNumber: 'ORD-1012', contact: { firstName: 'Ray',    lastName: 'Nguyen',   email: 'ray@phosure.com',         phone: '(973) 555-0912', company: 'Pho Sure' },          shippingAddress: { line1: '500 Bloomfield Ave',    city: 'Montclair',      state: 'NJ', zip: '07042', country: 'United States' }, itemName: 'Custom Product Labels',      categorySlug: 'labels',          size: 'Custom', qty: 500,  unitPrice: 0.62, lineTotal: 310,  subtotal: 310,  shipping: 49.99, total: 359.99, status: 'Delivered',  trackingNumber: '1Z999AA10123456872', createdAt: new Date('2026-02-04') },
    { orderNumber: 'ORD-1011', contact: { firstName: 'Priya',  lastName: 'Sharma',   email: 'priya@spiceroute.com',    phone: '(201) 555-1034', company: 'Spice Route' },       shippingAddress: { line1: '75 Washington St',      city: 'Hoboken',        state: 'NJ', zip: '07030', country: 'United States' }, itemName: 'Flat Bottom Paper Bags',     categorySlug: 'bags',            size: 'Large',  qty: 500,  unitPrice: 1.38, lineTotal: 690,  subtotal: 690,  shipping: 0, total: 690,  status: 'Pending',   createdAt: new Date('2026-02-02') },
    { orderNumber: 'ORD-1010', contact: { firstName: 'Marco',  lastName: 'Esposito', email: 'marco@marcoscafe.com',    phone: '(551) 555-1145', company: "Marco's Café" },      shippingAddress: { line1: '88 Park Ave',            city: 'Rutherford',     state: 'NJ', zip: '07070', country: 'United States' }, itemName: 'Roll Stickers',              categorySlug: 'labels',          size: 'Custom', qty: 1000, unitPrice: 0.42, lineTotal: 420,  subtotal: 420,  shipping: 49.99, total: 469.99, status: 'Pending',   notes: 'Pantone 485 for red — see attached artwork', createdAt: new Date('2026-01-30') },
  ];

  const orderDocs = ORDERS.map((o) => {
    const matchedProduct = productDocs.find((p) => p.name === o.itemName);
    const catId = slugToCategoryId[o.categorySlug] ?? '';
    const catName = slugToCategoryName[o.categorySlug] ?? '';
    return {
      _id: new ObjectId(),
      orderNumber: o.orderNumber,
      contact: o.contact,
      shippingAddress: o.shippingAddress,
      items: [{
        productId: matchedProduct?._id.toString() || '',
        name: o.itemName,
        categoryId: catId,
        categoryName: catName,
        size: o.size,
        qty: o.qty,
        unitPrice: o.unitPrice,
        lineTotal: o.lineTotal,
      }],
      subtotal: o.subtotal,
      shipping: o.shipping,
      total: o.total,
      status: o.status,
      ...(o.trackingNumber ? { trackingNumber: o.trackingNumber } : {}),
      ...(o.notes ? { notes: o.notes } : {}),
      createdAt: o.createdAt,
      updatedAt: o.createdAt,
    };
  });
  await db.collection('orders').insertMany(orderDocs);
  console.log(`  ✓ ${orderDocs.length} orders`);

  // Seed staff
  console.log('Seeding staff...');
  const staffDocs = STAFF.map((s) => ({
    _id: new ObjectId(),
    ...s,
  }));
  await db.collection('staff').insertMany(staffDocs);
  console.log(`  ✓ ${staffDocs.length} staff members`);

  // Seed settings
  console.log('Seeding settings...');
  await db.collection('settings').insertOne(DEFAULT_SETTINGS);
  console.log('  ✓ settings');

  // Seed reviews
  console.log('Seeding reviews...');
  const REVIEWS = [
    { productName: 'Custom Printed Coffee Cups', author: 'Maria L.',  company: 'Go Picadera',      rating: 5, text: 'Amazing quality! Our customers love seeing our logo on every cup. The colors came out perfect and delivery was fast.', helpful: 8, date: new Date('2026-02-15') },
    { productName: 'Cold Beverage Cups',         author: 'Nina C.',   company: 'Boba House',        rating: 5, text: 'We ordered 1,000 cold cups and they look incredible. Great print quality and the minimum order was very reasonable.', helpful: 5, date: new Date('2026-01-28') },
    { productName: 'Cold Beverage Cups',         author: 'Aisha J.',  company: "Aisha's Kitchen",   rating: 4, text: 'Good quality cups. Would have liked more size options but overall very happy with the branding.', helpful: 3, date: new Date('2026-01-10') },
    { productName: 'Kraft Paper Bags',           author: 'James R.',  company: 'Kimchi Smoke',      rating: 5, text: 'Perfect bags for our takeout orders. Sturdy kraft paper and the logo print is sharp. Customers always comment on how nice they look.', helpful: 6, date: new Date('2026-02-10') },
    { productName: 'Flat Bottom Paper Bags',     author: 'Priya S.',  company: 'Spice Route',       rating: 4, text: 'Great quality bags at a fair price. The bilingual support made ordering so easy for our Spanish-speaking team.', helpful: 4, date: new Date('2026-01-20') },
    { productName: 'Custom Pizza Boxes',         author: 'Carlos M.', company: 'Parriyas',          rating: 5, text: 'Best pizza boxes we have used. Strong enough for delivery and our branding looks professional.', helpful: 7, date: new Date('2026-02-01') },
    { productName: 'Mailer & Gift Boxes',        author: 'David O.',  company: 'Slice & Dice',      rating: 5, text: 'Excellent quality and the custom sizes were perfect for our menu. Will definitely reorder.', helpful: 4, date: new Date('2026-01-15') },
    { productName: 'Custom Food Bowls',          author: 'Sofia P.',  company: 'La Fortaleza',      rating: 5, text: 'These food bowls are perfect for our rice and grain bowls. The branding makes our delivery orders look premium.', helpful: 5, date: new Date('2026-02-05') },
    { productName: 'Takeout Containers',         author: 'Luis T.',   company: 'El Sabor Latino',   rating: 4, text: 'Good containers, great price. The lids fit perfectly and nothing leaks. Our customers appreciate the branded packaging.', helpful: 3, date: new Date('2026-01-18') },
    { productName: 'Custom Product Labels',      author: 'Ray N.',    company: 'Pho Sure',          rating: 5, text: 'These labels transformed our product packaging. The adhesive is strong and the print quality is excellent.', helpful: 6, date: new Date('2026-01-25') },
    { productName: 'Roll Stickers',              author: 'Marco E.',  company: "Marco's Cafe",      rating: 5, text: 'Great roll stickers! Easy to apply and the colors match our brand perfectly. Pantone matching was spot on.', helpful: 4, date: new Date('2026-01-12') },
  ];

  const reviewDocs = REVIEWS.map((r) => {
    const matchedProduct = productDocs.find((p) => p.name === r.productName);
    return {
      _id: new ObjectId(),
      productId: matchedProduct?._id.toString() || '',
      author: r.author,
      company: r.company,
      rating: r.rating,
      text: r.text,
      helpful: r.helpful,
      status: 'approved' as const,
      createdAt: r.date,
      updatedAt: r.date,
    };
  });
  await db.collection('reviews').insertMany(reviewDocs);
  console.log(`  ✓ ${reviewDocs.length} reviews`);

  // Create indexes
  console.log('Creating indexes...');
  await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
  await db.collection('categories').createIndex({ sortOrder: 1 });
  await db.collection('products').createIndex({ categoryId: 1 });
  await db.collection('products').createIndex({ categoryId: 1, sortOrder: 1 });
  await db.collection('products').createIndex({ isActive: 1 });
  await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
  await db.collection('orders').createIndex({ customerId: 1 });
  await db.collection('orders').createIndex({ status: 1 });
  await db.collection('addresses').createIndex({ userId: 1 });
  await db.collection('reviews').createIndex({ productId: 1, status: 1 });
  await db.collection('reviews').createIndex({ createdAt: -1 });
  await db.collection('inquiries').createIndex({ type: 1 });
  await db.collection('inquiries').createIndex({ createdAt: -1 });
  console.log('  ✓ indexes');

  console.log('\nSeed complete!');
  await client.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

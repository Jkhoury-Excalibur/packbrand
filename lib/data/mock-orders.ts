export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  company: string;
  product: string;
  category: string;
  size: string;
  qty: number;
  unitPrice: number;
  date: string;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
};

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1021', customer: 'Maria Lopez',    email: 'maria@gopicadera.com',    phone: '(551) 555-0142', company: 'Go Picadera',       product: 'Custom Printed Coffee Cups', category: 'cups',             size: '12oz',     qty: 500,  unitPrice: 2.48, date: '2026-02-20', total: 1240, status: 'Delivered',  trackingNumber: '1Z999AA10123456784', shippingAddress: { line1: '847 Bergenline Ave', line2: 'Suite 2B', city: 'Union City', state: 'NJ', zip: '07087', country: 'United States' } },
  { id: 'ORD-1020', customer: 'James Rivera',   email: 'james@kimchismoke.com',   phone: '(201) 555-0198', company: 'Kimchi Smoke',      product: 'Kraft Paper Bags',           category: 'bags',             size: 'Medium',   qty: 250,  unitPrice: 2.48, date: '2026-02-18', total: 620,  status: 'Shipped',   trackingNumber: '1Z999AA10123456799', shippingAddress: { line1: '225 Main St', city: 'Hackensack', state: 'NJ', zip: '07601', country: 'United States' } },
  { id: 'ORD-1019', customer: 'Sofia Perez',    email: 'sofia@lafortaleza.com',   phone: '(551) 555-0231', company: 'La Fortaleza',      product: 'Custom Food Bowls',          category: 'food-containers',  size: '16oz',     qty: 1000, unitPrice: 1.98, date: '2026-02-17', total: 1980, status: 'Processing', shippingAddress: { line1: '450 Broadway', city: 'Bayonne', state: 'NJ', zip: '07002', country: 'United States' }, notes: 'Rush order — need by end of month' },
  { id: 'ORD-1018', customer: 'Carlos Mendez',  email: 'carlos@parriyas.com',     phone: '(201) 555-0314', company: 'Parriyas',          product: 'Custom Pizza Boxes',         category: 'boxes',            size: '14"',      qty: 250,  unitPrice: 3.48, date: '2026-02-15', total: 870,  status: 'Delivered',  trackingNumber: '1Z999AA10123456812', shippingAddress: { line1: '88 River Rd', city: 'Edgewater', state: 'NJ', zip: '07020', country: 'United States' } },
  { id: 'ORD-1017', customer: 'Aisha Johnson',  email: 'aisha@aishaskitchen.com', phone: '(973) 555-0455', company: 'Aisha\'s Kitchen',  product: 'Cold Beverage Cups',         category: 'cups',             size: '16oz',     qty: 500,  unitPrice: 1.90, date: '2026-02-14', total: 950,  status: 'Delivered',  trackingNumber: '1Z999AA10123456827', shippingAddress: { line1: '12 MLK Blvd', city: 'Newark', state: 'NJ', zip: '07102', country: 'United States' } },
  { id: 'ORD-1016', customer: 'Luis Torres',    email: 'luis@elsaborlatino.com',  phone: '(201) 555-0567', company: 'El Sabor Latino',   product: 'Takeout Containers',         category: 'food-containers',  size: 'Large',    qty: 500,  unitPrice: 1.48, date: '2026-02-12', total: 740,  status: 'Shipped',   trackingNumber: '1Z999AA10123456834', shippingAddress: { line1: '330 Palisade Ave', city: 'Cliffside Park', state: 'NJ', zip: '07010', country: 'United States' } },
  { id: 'ORD-1015', customer: 'Nina Chen',      email: 'nina@bobahouse.com',      phone: '(201) 555-0678', company: 'Boba House',        product: 'Cold Beverage Cups',         category: 'cups',             size: '24oz',     qty: 1000, unitPrice: 1.76, date: '2026-02-10', total: 1760, status: 'Delivered',  trackingNumber: '1Z999AA10123456841', shippingAddress: { line1: '55 Bergen Turnpike', city: 'Ridgefield Park', state: 'NJ', zip: '07660', country: 'United States' } },
  { id: 'ORD-1014', customer: 'David Ortiz',    email: 'david@sliceanddice.com',  phone: '(551) 555-0789', company: 'Slice & Dice',      product: 'Custom Pizza Boxes',         category: 'boxes',            size: '16"',      qty: 500,  unitPrice: 2.84, date: '2026-02-08', total: 1420, status: 'Delivered',  trackingNumber: '1Z999AA10123456858', shippingAddress: { line1: '140 Central Ave', city: 'Jersey City', state: 'NJ', zip: '07307', country: 'United States' } },
  { id: 'ORD-1013', customer: 'Elena Vargas',   email: 'elena@bloomboutique.com', phone: '(201) 555-0890', company: 'Bloom Boutique',    product: 'Mailer & Gift Boxes',        category: 'boxes',            size: 'Medium',   qty: 100,  unitPrice: 5.80, date: '2026-02-06', total: 580,  status: 'Delivered',  trackingNumber: '1Z999AA10123456865', shippingAddress: { line1: '22 Oak St', city: 'Tenafly', state: 'NJ', zip: '07670', country: 'United States' } },
  { id: 'ORD-1012', customer: 'Ray Nguyen',     email: 'ray@phosure.com',         phone: '(973) 555-0912', company: 'Pho Sure',          product: 'Custom Product Labels',      category: 'labels',           size: 'Custom',   qty: 500,  unitPrice: 0.62, date: '2026-02-04', total: 310,  status: 'Delivered',  trackingNumber: '1Z999AA10123456872', shippingAddress: { line1: '500 Bloomfield Ave', city: 'Montclair', state: 'NJ', zip: '07042', country: 'United States' } },
  { id: 'ORD-1011', customer: 'Priya Sharma',   email: 'priya@spiceroute.com',    phone: '(201) 555-1034', company: 'Spice Route',       product: 'Flat Bottom Paper Bags',     category: 'bags',             size: 'Large',    qty: 500,  unitPrice: 1.38, date: '2026-02-02', total: 690,  status: 'Pending',   shippingAddress: { line1: '75 Washington St', city: 'Hoboken', state: 'NJ', zip: '07030', country: 'United States' } },
  { id: 'ORD-1010', customer: 'Marco Esposito', email: 'marco@marcoscafe.com',    phone: '(551) 555-1145', company: 'Marco\'s Café',     product: 'Roll Stickers',              category: 'labels',           size: 'Custom',   qty: 1000, unitPrice: 0.42, date: '2026-01-30', total: 420,  status: 'Pending',   shippingAddress: { line1: '88 Park Ave', city: 'Rutherford', state: 'NJ', zip: '07070', country: 'United States' }, notes: 'Pantone 485 for red — see attached artwork' },
];

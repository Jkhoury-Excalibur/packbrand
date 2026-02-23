export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  customer: string;
  company: string;
  product: string;
  category: string;
  qty: number;
  date: string;
  total: number;
  status: OrderStatus;
};

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1021', customer: 'Maria Lopez',    company: 'Go Picadera',       product: 'Custom Printed Coffee Cups', category: 'cups',             qty: 500,  date: '2026-02-20', total: 1240, status: 'Delivered'  },
  { id: 'ORD-1020', customer: 'James Rivera',   company: 'Kimchi Smoke',      product: 'Kraft Paper Bags',           category: 'bags',             qty: 250,  date: '2026-02-18', total: 620,  status: 'Shipped'    },
  { id: 'ORD-1019', customer: 'Sofia Perez',    company: 'La Fortaleza',      product: 'Custom Food Bowls',          category: 'food-containers',  qty: 1000, date: '2026-02-17', total: 1980, status: 'Processing' },
  { id: 'ORD-1018', customer: 'Carlos Mendez',  company: 'Parriyas',          product: 'Custom Pizza Boxes',         category: 'boxes',            qty: 250,  date: '2026-02-15', total: 870,  status: 'Delivered'  },
  { id: 'ORD-1017', customer: 'Aisha Johnson',  company: 'Aisha\'s Kitchen',  product: 'Cold Beverage Cups',         category: 'cups',             qty: 500,  date: '2026-02-14', total: 950,  status: 'Delivered'  },
  { id: 'ORD-1016', customer: 'Luis Torres',    company: 'El Sabor Latino',   product: 'Takeout Containers',         category: 'food-containers',  qty: 500,  date: '2026-02-12', total: 740,  status: 'Shipped'    },
  { id: 'ORD-1015', customer: 'Nina Chen',      company: 'Boba House',        product: 'Cold Beverage Cups',         category: 'cups',             qty: 1000, date: '2026-02-10', total: 1760, status: 'Delivered'  },
  { id: 'ORD-1014', customer: 'David Ortiz',    company: 'Slice & Dice',      product: 'Custom Pizza Boxes',         category: 'boxes',            qty: 500,  date: '2026-02-08', total: 1420, status: 'Delivered'  },
  { id: 'ORD-1013', customer: 'Elena Vargas',   company: 'Bloom Boutique',    product: 'Mailer & Gift Boxes',        category: 'boxes',            qty: 100,  date: '2026-02-06', total: 580,  status: 'Delivered'  },
  { id: 'ORD-1012', customer: 'Ray Nguyen',     company: 'Pho Sure',          product: 'Custom Product Labels',      category: 'labels',           qty: 500,  date: '2026-02-04', total: 310,  status: 'Delivered'  },
  { id: 'ORD-1011', customer: 'Priya Sharma',   company: 'Spice Route',       product: 'Flat Bottom Paper Bags',     category: 'bags',             qty: 500,  date: '2026-02-02', total: 690,  status: 'Pending'    },
  { id: 'ORD-1010', customer: 'Marco Esposito', company: 'Marco\'s Café',     product: 'Roll Stickers',              category: 'labels',           qty: 1000, date: '2026-01-30', total: 420,  status: 'Pending'    },
];

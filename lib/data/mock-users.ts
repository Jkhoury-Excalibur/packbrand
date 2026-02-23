export type UserStatus = 'Active' | 'Inactive';

export type MockUser = {
  id: string;
  name: string;
  email: string;
  company: string;
  totalOrders: number;
  totalSpend: number;
  lastOrder: string;
  status: UserStatus;
};

export const MOCK_USERS: MockUser[] = [
  { id: 'USR-001', name: 'Maria Lopez',    email: 'maria@gopicadera.com',     company: 'Go Picadera',      totalOrders: 8,  totalSpend: 7840,  lastOrder: '2026-02-20', status: 'Active'   },
  { id: 'USR-002', name: 'James Rivera',   email: 'james@kimchismoke.com',    company: 'Kimchi Smoke',     totalOrders: 5,  totalSpend: 3210,  lastOrder: '2026-02-18', status: 'Active'   },
  { id: 'USR-003', name: 'Sofia Perez',    email: 'sofia@lafortaleza.com',    company: 'La Fortaleza',     totalOrders: 12, totalSpend: 14500, lastOrder: '2026-02-17', status: 'Active'   },
  { id: 'USR-004', name: 'Carlos Mendez',  email: 'carlos@parriyas.com',      company: 'Parriyas',         totalOrders: 6,  totalSpend: 4890,  lastOrder: '2026-02-15', status: 'Active'   },
  { id: 'USR-005', name: 'Aisha Johnson',  email: 'aisha@kitchen.com',        company: 'Aisha\'s Kitchen', totalOrders: 3,  totalSpend: 2100,  lastOrder: '2026-02-14', status: 'Active'   },
  { id: 'USR-006', name: 'Luis Torres',    email: 'luis@elsaborlatino.com',   company: 'El Sabor Latino',  totalOrders: 4,  totalSpend: 2960,  lastOrder: '2026-02-12', status: 'Active'   },
  { id: 'USR-007', name: 'Nina Chen',      email: 'nina@bobahouse.com',       company: 'Boba House',       totalOrders: 7,  totalSpend: 9200,  lastOrder: '2026-02-10', status: 'Active'   },
  { id: 'USR-008', name: 'David Ortiz',    email: 'david@slicedice.com',      company: 'Slice & Dice',     totalOrders: 9,  totalSpend: 11340, lastOrder: '2026-02-08', status: 'Active'   },
  { id: 'USR-009', name: 'Elena Vargas',   email: 'elena@bloomboutique.com',  company: 'Bloom Boutique',   totalOrders: 2,  totalSpend: 1160,  lastOrder: '2026-02-06', status: 'Inactive' },
  { id: 'USR-010', name: 'Ray Nguyen',     email: 'ray@phosure.com',          company: 'Pho Sure',         totalOrders: 1,  totalSpend: 310,   lastOrder: '2026-02-04', status: 'Active'   },
];

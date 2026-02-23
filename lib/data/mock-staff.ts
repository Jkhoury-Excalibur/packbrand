export type StaffRole = 'Owner' | 'Sales' | 'Fulfillment' | 'Design';
export type StaffStatus = 'Active' | 'Inactive';

export type StaffMember = {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  status: StaffStatus;
  lastActive: string;
  ordersHandled: number;
};

export const MOCK_STAFF: StaffMember[] = [
  { id: 'STF-001', name: 'Rafael Diaz',    role: 'Owner',       email: 'rafael@packbrandsolutions.com',  phone: '(551) 389-3188', status: 'Active',   lastActive: '2026-02-23', ordersHandled: 0   },
  { id: 'STF-002', name: 'Carmen Reyes',   role: 'Sales',       email: 'carmen@packbrandsolutions.com',  phone: '(551) 389-3189', status: 'Active',   lastActive: '2026-02-23', ordersHandled: 48  },
  { id: 'STF-003', name: 'Tony Bautista',  role: 'Sales',       email: 'tony@packbrandsolutions.com',    phone: '(551) 389-3190', status: 'Active',   lastActive: '2026-02-22', ordersHandled: 35  },
  { id: 'STF-004', name: 'Lena Park',      role: 'Fulfillment', email: 'lena@packbrandsolutions.com',    phone: '(551) 389-3191', status: 'Active',   lastActive: '2026-02-23', ordersHandled: 112 },
  { id: 'STF-005', name: 'Marcus Webb',    role: 'Fulfillment', email: 'marcus@packbrandsolutions.com',  phone: '(551) 389-3192', status: 'Active',   lastActive: '2026-02-21', ordersHandled: 98  },
  { id: 'STF-006', name: 'Isabela Rocha',  role: 'Design',      email: 'isabela@packbrandsolutions.com', phone: '(551) 389-3193', status: 'Inactive', lastActive: '2026-01-15', ordersHandled: 27  },
];



export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountStatus: 'Active' | 'Suspend';
  joinDate: string;
};

export type Board = {
  id: number;
  title: string;
  boardType: string;
  createdBy: string;
  createdDate: string;
  participantsCount: number;
  totalGifts: string;
};

export type Wish = {
  id: number;
  wishId: string;
  boardId: string;
  user: string;
  messagePreview: string;
  mediaFiles: number;
  giftAmount: string;
  date: string;
  accountStatus: 'Active' | 'Reported';
};

export type Gift = {
  id: number;
  giftId: string;
  boardId: string;
  sender: string;
  receiver: string;
  amount: string;
  date: string;
  status: 'Paid' | 'Pending';
};

export type ReportedContent = {
  id: number;
  reportId: string;
  reportedBy: string;
  contentType: string;
  reason: string;
  timestamp: string;
  status: 'Resolved' | 'Pending' | 'Under Review';
};

export type SupportTicket = {
  id: number;
  ticketId: string;
  user: string;
  messagePreview: string;
  category: string;
  date: string;
  status: 'Resolved' | 'Open';
};

export const mockUsers: User[] = [
  { id: 1, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 2, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Suspend', joinDate: 'May 25, 2025' },
  { id: 3, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 4, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Suspend', joinDate: 'May 25, 2025' },
  { id: 5, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 6, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Suspend', joinDate: 'May 25, 2025' },
  { id: 7, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 8, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 9, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Suspend', joinDate: 'May 25, 2025' },
  { id: 10, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 11, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Suspend', joinDate: 'May 25, 2025' },
  { id: 12, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
  { id: 13, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Suspend', joinDate: 'May 25, 2025' },
  { id: 14, name: 'John Allen', email: 'hansen@gmail.com', phone: '+1-123-456789', accountStatus: 'Active', joinDate: 'May 25, 2025' },
];

export const mockBoards: Board[] = [
  { id: 1, title: 'New Year Celebration', boardType: 'New Year', createdBy: 'Emily Johnson', createdDate: 'Dec 1, 2025', participantsCount: 87, totalGifts: '$450.00' },
  { id: 2, title: 'Retirement Party', boardType: 'General', createdBy: 'Michael Chen', createdDate: 'Nov 15, 2025', participantsCount: 63, totalGifts: '$820.00' },
  { id: 3, title: "Sarah's Birthday", boardType: 'Birthday', createdBy: 'Lisa Anderson', createdDate: 'Dec 10, 2025', participantsCount: 25, totalGifts: '$330.00' },
  { id: 4, title: 'Christmas Party 2025', boardType: 'Christmas', createdBy: 'Rachel Green', createdDate: 'Nov 28, 2025', participantsCount: 39, totalGifts: '$625.00' },
  { id: 5, title: "Alex's Birthday", boardType: 'General', createdBy: 'John Smith', createdDate: 'Dec 8, 2025', participantsCount: 42, totalGifts: '$275.00' },
];

export const mockWishes: Wish[] = [
  {
    id: 1,
    wishId: 'W001',
    boardId: 'B122',
    user: 'Emily Johnson',
    messagePreview: 'Happy birthday! Wishing you all the best on your special day',
    mediaFiles: 2,
    giftAmount: '$50.00',
    date: 'Dec 10, 2025, 02:30 PM',
    accountStatus: 'Active'
  },
  {
    id: 2,
    wishId: 'W002',
    boardId: 'B123',
    user: 'Michael Chen',
    messagePreview: 'Congratulations on your achievement! You deserve all the suc...',
    mediaFiles: 0,
    giftAmount: '$25.00',
    date: 'Dec 10, 2025, 02:30 PM',
    accountStatus: 'Reported'
  },
  {
    id: 3,
    wishId: 'W003',
    boardId: 'B124',
    user: 'Lisa Anderson',
    messagePreview: 'This message contains inappropriate content that has been fl...',
    mediaFiles: 1,
    giftAmount: '$80.00',
    date: 'Dec 10, 2025, 02:30 PM',
    accountStatus: 'Active'
  },
  {
    id: 4,
    wishId: 'W004',
    boardId: 'B125',
    user: 'Rachel Green',
    messagePreview: 'Best wishes for your new journey! Excited to see what the fu...',
    mediaFiles: 0,
    giftAmount: '$75.00',
    date: 'Dec 10, 2025, 02:30 PM',
    accountStatus: 'Reported'
  },
  {
    id: 5,
    wishId: 'W005',
    boardId: 'B126',
    user: 'John Smith',
    messagePreview: 'Thank you for being such an amazing friend! Here\'s to many m...',
    mediaFiles: 3,
    giftAmount: '$30.00',
    date: 'Dec 10, 2025, 02:30 PM',
    accountStatus: 'Active'
  },
];

export const mockGifts: Gift[] = [
  {
    id: 1,
    giftId: 'W001',
    boardId: 'Board-121',
    sender: 'Emily Johnson',
    receiver: 'Emily Johnson',
    amount: '$50.00',
    date: 'Dec 10, 2025',
    status: 'Paid'
  },
  {
    id: 2,
    giftId: 'W002',
    boardId: 'Board-122',
    sender: 'Michael Chen',
    receiver: 'Rachel Green',
    amount: '$25.00',
    date: 'Dec 10, 2025',
    status: 'Pending'
  },
  {
    id: 3,
    giftId: 'W003',
    boardId: 'Board-123',
    sender: 'Lisa Anderson',
    receiver: 'Lisa Anderson',
    amount: '$80.00',
    date: 'Dec 10, 2025',
    status: 'Paid'
  },
  {
    id: 4,
    giftId: 'W004',
    boardId: 'Board-124',
    sender: 'Rachel Green',
    receiver: 'Michael Chen',
    amount: '$75.00',
    date: 'Dec 10, 2025',
    status: 'Pending'
  },
  {
    id: 5,
    giftId: 'W005',
    boardId: 'Board-125',
    sender: 'John Smith',
    receiver: 'Emily Johnson',
    amount: '$30.00',
    date: 'Dec 10, 2025',
    status: 'Paid'
  },
  {
    id: 6,
    giftId: 'W006',
    boardId: 'Board-126',
    sender: 'David Park',
    receiver: 'Nina Patel',
    amount: '$120.00',
    date: 'Dec 11, 2025',
    status: 'Pending'
  },
  {
    id: 7,
    giftId: 'W007',
    boardId: 'Board-127',
    sender: 'Sophie Turner',
    receiver: 'Chris Lee',
    amount: '$45.50',
    date: 'Dec 11, 2025',
    status: 'Paid'
  },
  {
    id: 8,
    giftId: 'W008',
    boardId: 'Board-128',
    sender: 'Marcus Webb',
    receiver: 'Anna Kowalski',
    amount: '$200.00',
    date: 'Dec 12, 2025',
    status: 'Paid'
  },
  {
    id: 9,
    giftId: 'W009',
    boardId: 'Board-129',
    sender: 'Priya Sharma',
    receiver: "James O'Neill",
    amount: '$15.00',
    date: 'Dec 12, 2025',
    status: 'Pending'
  },
  {
    id: 10,
    giftId: 'W010',
    boardId: 'Board-130',
    sender: 'Tom Rivera',
    receiver: 'Tom Rivera',
    amount: '$60.00',
    date: 'Dec 13, 2025',
    status: 'Paid'
  },
  {
    id: 11,
    giftId: 'W011',
    boardId: 'Board-131',
    sender: 'Olivia Brown',
    receiver: 'Ethan Wright',
    amount: '$95.00',
    date: 'Dec 13, 2025',
    status: 'Pending'
  },
  {
    id: 12,
    giftId: 'W012',
    boardId: 'Board-132',
    sender: 'Kevin Ng',
    receiver: 'Maria Santos',
    amount: '$42.25',
    date: 'Dec 14, 2025',
    status: 'Paid'
  },
  {
    id: 13,
    giftId: 'W013',
    boardId: 'Board-133',
    sender: 'Hannah Kim',
    receiver: 'Daniel Foster',
    amount: '$175.00',
    date: 'Dec 14, 2025',
    status: 'Paid'
  },
  {
    id: 14,
    giftId: 'W014',
    boardId: 'Board-134',
    sender: 'Ryan Cooper',
    receiver: 'Julia Martin',
    amount: '$33.00',
    date: 'Dec 15, 2025',
    status: 'Pending'
  },
  {
    id: 15,
    giftId: 'W015',
    boardId: 'Board-135',
    sender: 'Isabella Ruiz',
    receiver: 'Noah Bennett',
    amount: '$88.75',
    date: 'Dec 15, 2025',
    status: 'Paid'
  },
  {
    id: 16,
    giftId: 'W016',
    boardId: 'Board-136',
    sender: 'Alex Murphy',
    receiver: 'Sam Taylor',
    amount: '$22.00',
    date: 'Dec 16, 2025',
    status: 'Pending'
  },
  {
    id: 17,
    giftId: 'W017',
    boardId: 'Board-137',
    sender: 'Grace Liu',
    receiver: 'Ben Carter',
    amount: '$310.00',
    date: 'Dec 16, 2025',
    status: 'Paid'
  },
  {
    id: 18,
    giftId: 'W018',
    boardId: 'Board-138',
    sender: "Liam O'Connor",
    receiver: 'Zoe Mitchell',
    amount: '$54.99',
    date: 'Dec 17, 2025',
    status: 'Paid'
  },
  {
    id: 19,
    giftId: 'W019',
    boardId: 'Board-139',
    sender: 'Chloe Davis',
    receiver: 'Owen Hughes',
    amount: '$67.00',
    date: 'Dec 17, 2025',
    status: 'Pending'
  },
  {
    id: 20,
    giftId: 'W020',
    boardId: 'Board-140',
    sender: 'Victor Hayes',
    receiver: 'Maya Singh',
    amount: '$125.50',
    date: 'Dec 18, 2025',
    status: 'Paid'
  },
  {
    id: 21,
    giftId: 'W021',
    boardId: 'Board-141',
    sender: 'Elena Rossi',
    receiver: 'Felix Braun',
    amount: '$39.00',
    date: 'Dec 18, 2025',
    status: 'Pending'
  },
  {
    id: 22,
    giftId: 'W022',
    boardId: 'Board-142',
    sender: 'Jordan Blake',
    receiver: 'Casey Jordan',
    amount: '$500.00',
    date: 'Dec 19, 2025',
    status: 'Paid'
  },
  {
    id: 23,
    giftId: 'W023',
    boardId: 'Board-143',
    sender: 'Aisha Moore',
    receiver: 'Derek Stone',
    amount: '$18.50',
    date: 'Dec 19, 2025',
    status: 'Pending'
  },
  {
    id: 24,
    giftId: 'W024',
    boardId: 'Board-144',
    sender: 'Peter Walsh',
    receiver: 'Laura Chen',
    amount: '$72.00',
    date: 'Dec 20, 2025',
    status: 'Paid'
  },
  {
    id: 25,
    giftId: 'W025',
    boardId: 'Board-145',
    sender: 'Natalie Fox',
    receiver: 'Greg Powell',
    amount: '$99.99',
    date: 'Dec 20, 2025',
    status: 'Pending'
  },
  {
    id: 26,
    giftId: 'W026',
    boardId: 'Board-146',
    sender: 'Henry Scott',
    receiver: 'Beth Young',
    amount: '$44.00',
    date: 'Dec 21, 2025',
    status: 'Paid'
  },
  {
    id: 27,
    giftId: 'W027',
    boardId: 'Board-147',
    sender: 'Yuki Tanaka',
    receiver: 'Rob Vega',
    amount: '$156.25',
    date: 'Dec 21, 2025',
    status: 'Paid'
  },
  {
    id: 28,
    giftId: 'W028',
    boardId: 'Board-148',
    sender: 'Camila Ortiz',
    receiver: 'Steve Reid',
    amount: '$28.75',
    date: 'Dec 22, 2025',
    status: 'Pending'
  },
  {
    id: 29,
    giftId: 'W029',
    boardId: 'Board-149',
    sender: 'Frank Dubois',
    receiver: 'Irene Novak',
    amount: '$210.00',
    date: 'Dec 22, 2025',
    status: 'Paid'
  },
  {
    id: 30,
    giftId: 'W030',
    boardId: 'Board-150',
    sender: 'Sara Lind',
    receiver: 'Matt Brooks',
    amount: '$11.00',
    date: 'Dec 23, 2025',
    status: 'Pending'
  },
  {
    id: 31,
    giftId: 'W031',
    boardId: 'Board-151',
    sender: 'Diego Alvarez',
    receiver: 'Whitney Cole',
    amount: '$340.00',
    date: 'Dec 23, 2025',
    status: 'Paid'
  },
  {
    id: 32,
    giftId: 'W032',
    boardId: 'Board-152',
    sender: 'Mei Lin',
    receiver: 'Paul Graham',
    amount: '$62.40',
    date: 'Dec 24, 2025',
    status: 'Pending'
  },
  {
    id: 33,
    giftId: 'W033',
    boardId: 'Board-153',
    sender: 'Russell Kane',
    receiver: 'Dana Price',
    amount: '$77.00',
    date: 'Dec 24, 2025',
    status: 'Paid'
  },
  {
    id: 34,
    giftId: 'W034',
    boardId: 'Board-154',
    sender: 'Tessa Ford',
    receiver: 'Nick Archer',
    amount: '$145.00',
    date: 'Dec 25, 2025',
    status: 'Paid'
  },
  {
    id: 35,
    giftId: 'W035',
    boardId: 'Board-155',
    sender: 'Quinn Ellis',
    receiver: 'Riley Shaw',
    amount: '$55.55',
    date: 'Dec 25, 2025',
    status: 'Pending'
  },
];

export const mockReportedContent: ReportedContent[] = [
  {
    id: 1,
    reportId: 'RPT-001',
    reportedBy: 'Emily Johnson',
    contentType: 'Comment',
    reason: 'Spam',
    timestamp: '2025-12-12 09:15 AM',
    status: 'Resolved'
  },
  {
    id: 2,
    reportId: 'RPT-002',
    reportedBy: 'Rachel Green',
    contentType: 'Post',
    reason: 'Inappropriate content',
    timestamp: '2025-12-12 08:42 AM',
    status: 'Pending'
  },
  {
    id: 3,
    reportId: 'RPT-003',
    reportedBy: 'Lisa Anderson',
    contentType: 'Profile',
    reason: 'Impersonation',
    timestamp: '2025-12-12 07:30 AM',
    status: 'Under Review'
  },
  {
    id: 4,
    reportId: 'RPT-004',
    reportedBy: 'Michael Chen',
    contentType: 'Message',
    reason: 'Harassment',
    timestamp: '2025-12-11 11:20 PM',
    status: 'Resolved'
  },
  {
    id: 5,
    reportId: 'RPT-005',
    reportedBy: 'Emily Johnson',
    contentType: 'Comment',
    reason: 'Violence',
    timestamp: '2025-12-10 09:15 AM',
    status: 'Pending'
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 1,
    ticketId: 'TKT-1001',
    user: 'Emily Johnson',
    messagePreview: 'Unable to access my account after password reset...',
    category: 'Account',
    date: '2025-12-12 09:15 AM',
    status: 'Resolved'
  },
  {
    id: 2,
    ticketId: 'TKT-1002',
    user: 'Rachel Green',
    messagePreview: 'Payment failed but amount was deducted from my card...',
    category: 'Billing',
    date: '2025-12-12 08:42 AM',
    status: 'Open'
  },
  {
    id: 3,
    ticketId: 'TKT-1003',
    user: 'Lisa Anderson',
    messagePreview: 'How do I export my data?',
    category: 'Feature Request',
    date: '2025-12-12 07:30 AM',
    status: 'Resolved'
  },
  {
    id: 4,
    ticketId: 'TKT-1004',
    user: 'Michael Chen',
    messagePreview: 'App crashes when uploading large files...',
    category: 'Technical',
    date: '2025-12-11 11:20 PM',
    status: 'Open'
  },
  {
    id: 5,
    ticketId: 'TKT-1005',
    user: 'Emily Johnson',
    messagePreview: 'Feature request: Dark mode support...',
    category: 'Support',
    date: '2025-12-10 09:15 AM',
    status: 'Resolved'
  },
];


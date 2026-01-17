// Admin Tables Mock Data

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

// Mock Data Arrays

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


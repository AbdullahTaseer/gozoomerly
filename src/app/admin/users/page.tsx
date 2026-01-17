'use client';

import React, { useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  accountStatus: 'Active' | 'Suspend';
  joinDate: string;
};

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const users: User[] = [
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

  return (
    <div>
      <div className="max-[500px]:grid grid-cols-2 flex justify-end gap-4 my-6">
        <MoreFilters
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        <div className="w-[180px] bg-white relative">
          <GlobalInput
            id="search"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            width="100%"
            height="42px"
            className="relative"
            inputClassName="pr-10"
          />
          <div className="absolute right-3 top-[13px] pointer-events-none">
            <Search size={18} className="text-gray-900" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-auto h-[calc(100vh-190px)]">
        <table className="w-full overflow-auto">
          <thead>
            <tr className="bg-black text-white whitespace-nowrap sticky top-0">
              <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Account Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Join Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index === users.length - 1 ? '' : 'border-b'
                  }`}
              >
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.accountStatus === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {user.accountStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.joinDate}</td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>
                        {user.accountStatus === 'Active' ? 'Suspend' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
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
import { mockSupportTickets } from '@/lib/TablesMockData';

const AdminSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const supportTickets = mockSupportTickets;

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      'Resolved': { bg: 'bg-green-100', text: 'text-green-800' },
      'Open': { bg: 'bg-orange-100', text: 'text-orange-800' },
    };
    return colorMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  return (
    <div>
      <div className="max-[500px]:grid grid-cols-2 flex justify-end gap-4 my-6">
        <MoreFilters
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        <div className="max-[500px]:w-full w-[180px] bg-white relative">
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

      <div className="w-full h-[calc(100vh-190px)] max-h-[100vh]">
        <div className="relative rounded-[10px] w-full border border-[#DBDADE] bg-white overflow-hidden">
          <div className="h-[calc(100vh-170px)] md:h-[calc(100vh-190px)] max-h-[100vh] w-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-black text-white border-b border-[#E9E9E9] text-lg sticky top-[0px] z-30">
                <tr>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Ticket ID</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">User</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Message Preview</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Category</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {supportTickets.map((ticket, index) => {
                  const statusColors = getStatusColor(ticket.status);
                  return (
                    <tr
                      key={ticket.id}
                      className={`border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{ticket.ticketId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ticket.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 min-w-[200px]">{ticket.messagePreview}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ticket.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{ticket.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                              <MoreVertical size={18} className="text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Reply to Ticket</DropdownMenuItem>
                            <DropdownMenuItem>
                              {ticket.status === 'Open' ? 'Mark as Resolved' : 'Reopen Ticket'}
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">Delete Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
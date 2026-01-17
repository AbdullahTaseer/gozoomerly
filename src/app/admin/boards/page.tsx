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
import { mockBoards } from '@/lib/TablesMockData';

const AdminBoards = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const boards = mockBoards;

  const getBoardTypeColor = (type: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      'New Year': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'General': { bg: 'bg-green-100', text: 'text-green-800' },
      'Birthday': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Christmas': { bg: 'bg-pink-100', text: 'text-pink-800' },
    };
    return colorMap[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
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
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Board Title</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Board Type</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Created By</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Created Date</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Participants Count</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Total Gifts</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {boards.map((board) => {
                  const typeColors = getBoardTypeColor(board.boardType);
                  return (
                    <tr
                      key={board.id}
                      className="border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{board.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}
                        >
                          {board.boardType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{board.createdBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{board.createdDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{board.participantsCount}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{board.totalGifts}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                              <MoreVertical size={18} className="text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Board</DropdownMenuItem>
                            <DropdownMenuItem>Suspend Board</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
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

export default AdminBoards;
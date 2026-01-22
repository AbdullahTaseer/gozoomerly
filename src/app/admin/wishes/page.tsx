'use client';

import {  useState  } from 'react';
import { Search, MoreVertical, Paperclip } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockWishes } from '@/lib/TablesMockData';

const AdminWishes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const wishes = mockWishes;

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
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Wish ID</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Board ID</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">User</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Message preview</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Gift Amount</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Account Status</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {wishes.map((wish) => (
                  <tr
                    key={wish.id}
                    className="border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{wish.wishId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{wish.boardId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{wish.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-900">{wish.messagePreview}</p>
                        {wish.mediaFiles > 0 && (
                          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs">
                            <Paperclip size={12} />
                            <span>{wish.mediaFiles} media files</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{wish.giftAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{wish.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          wish.accountStatus === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {wish.accountStatus}
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
                          <DropdownMenuItem>Edit Wish</DropdownMenuItem>
                          <DropdownMenuItem>
                            {wish.accountStatus === 'Active' ? 'Report' : 'Approve'}
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
      </div>
    </div>
  );
};

export default AdminWishes;
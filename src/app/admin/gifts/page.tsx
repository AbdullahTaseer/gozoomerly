'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import { mockGifts } from '@/lib/TablesMockData';
import { ADMIN_LIST_LIMIT, adminListOffset } from '@/lib/supabase/adminListPagination';

const AdminGifts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'payout'>('overview');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = mockGifts;
    if (activeTab === 'payout') {
      list = list.filter((g) => g.status === 'Pending');
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((g) =>
      [g.giftId, g.boardId, g.sender, g.receiver, g.amount, g.date, g.status]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [activeTab, searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    setPage((p) => {
      const lastPage = Math.max(0, Math.ceil(filtered.length / ADMIN_LIST_LIMIT) - 1);
      return Math.min(p, lastPage);
    });
  }, [filtered.length]);

  const pageRows = useMemo(() => {
    const start = adminListOffset(page);
    return filtered.slice(start, start + ADMIN_LIST_LIMIT);
  }, [filtered, page]);

  const canGoPrev = page > 0;
  const canGoNext = adminListOffset(page) + ADMIN_LIST_LIMIT < filtered.length;

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      'Paid': { bg: 'bg-green-100', text: 'text-green-800' },
      'Pending': { bg: 'bg-pink-100', text: 'text-pink-800' },
    };
    return colorMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  return (
    <div>
      <div className="flex max-sm:flex-col items-center my-6 gap-4">
        <div className='flex gap-4'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-lg font-semibold transition-all border-b-2 ${activeTab === 'overview'
                ? 'text-pink-500 border-pink-500'
                : 'text-gray-600 border-transparent'
              }`}
          >
            Gift Overview
          </button>
          <button
            onClick={() => setActiveTab('payout')}
            className={`pb-2 text-lg font-semibold transition-all border-b-2 ${activeTab === 'payout'
                ? 'text-pink-500 border-pink-500'
                : 'text-gray-600 border-transparent'
              }`}
          >
            Payout Queue
          </button>
        </div>
        <div className="flex-1 flex justify-end gap-4">
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
      </div>

      <div className="w-full h-[calc(100vh-190px)] max-h-[100vh]">
        <div className="relative rounded-[10px] w-full border border-[#DBDADE] bg-white overflow-hidden">
          <div className="h-[calc(100vh-230px)] md:h-[calc(100vh-250px)] max-h-[100vh] w-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-black text-white border-b border-[#E9E9E9] text-lg sticky top-[0px] z-30">
                <tr>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Gift ID</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Board ID</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Sender</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Receiver / Honoree</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Amount</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No gifts match your search or filters.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((gift, index) => {
                    const statusColors = getStatusColor(gift.status);
                    const rowIndex = adminListOffset(page) + index;
                    return (
                      <tr
                        key={gift.id}
                        className={`border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{gift.giftId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{gift.boardId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{gift.sender}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{gift.receiver}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap font-medium">{gift.amount}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{gift.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                          >
                            {gift.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-3 border-t border-[#E9E9E9] bg-white">
            <span className="text-sm text-gray-500">
              Showing {filtered.length === 0 ? 0 : adminListOffset(page) + 1}–
              {adminListOffset(page) + pageRows.length} results
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-[#DBDADE] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-[#DBDADE] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGifts;
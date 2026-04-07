'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import { adminSelectItemClassName } from '@/components/adminComponents/adminSelectClasses';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  buildAdminListBoardsParams,
  fetchAdminListBoards,
  type AdminBoardRow,
  type AdminListBoardsSort,
} from '@/lib/supabase/adminBoards';
import { ADMIN_LIST_LIMIT, adminListOffset } from '@/lib/supabase/adminListPagination';

const BOARD_FILTER_OPTIONS = [
  { value: 'spotlight_yes', label: 'Spotlight: Yes' },
  { value: 'spotlight_no', label: 'Spotlight: No' },
  { value: 'include_deleted', label: 'Include deleted' },
] as const;

const FILTER_ALL = '__all__';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: FILTER_ALL, label: 'All statuses' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' },
  { value: 'past', label: 'Past' },
];

const PRIVACY_OPTIONS: { value: string; label: string }[] = [
  { value: FILTER_ALL, label: 'All privacy' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

const SORT_OPTIONS: { value: AdminListBoardsSort; label: string }[] = [
  { value: 'created_at_desc', label: 'Newest first' },
  { value: 'total_raised_desc', label: 'Highest raised' },
  { value: 'name_asc', label: 'Title (A–Z)' },
];

/** Control fills its column; columns are fixed-width inside the horizontal scroller */
const controlClass =
  '!h-[43px] w-full rounded-[5px] border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors border-gray-900 focus:ring-0';

const labelClass = 'text-xs font-medium text-gray-700 whitespace-nowrap';

const scrollField = 'flex shrink-0 flex-col gap-1.5';

const AdminBoards = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [goalType, setGoalType] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [boardTypeId, setBoardTypeId] = useState('');
  const [spotlightStatus, setSpotlightStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [sort, setSort] = useState<AdminListBoardsSort>('created_at_desc');
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AdminBoardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  useLayoutEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const resetPage = () => setPage(0);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const rpcParams = buildAdminListBoardsParams({
      search: debouncedSearch,
      selectedFilterTags: selectedFilters,
      status,
      privacy,
      goalType,
      creatorId,
      boardTypeId,
      spotlightStatus,
      currency,
      createdAfter,
      createdBefore,
      sort,
      limit: ADMIN_LIST_LIMIT,
      offset: adminListOffset(page),
    });
    const { rows: next, error } = await fetchAdminListBoards(rpcParams);
    if (error) {
      setLoadError(error.message);
      setRows([]);
    } else {
      setRows(next);
    }
    setLoading(false);
  }, [
    debouncedSearch,
    selectedFilters,
    status,
    privacy,
    goalType,
    creatorId,
    boardTypeId,
    spotlightStatus,
    currency,
    createdAfter,
    createdBefore,
    sort,
    page,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const getBoardTypeColor = (type: string) => {
    const key = type.trim();
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      'New Year': { bg: 'bg-orange-100', text: 'text-orange-800' },
      General: { bg: 'bg-green-100', text: 'text-green-800' },
      Birthday: { bg: 'bg-blue-100', text: 'text-blue-800' },
      Christmas: { bg: 'bg-pink-100', text: 'text-pink-800' },
      Live: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
      Completed: { bg: 'bg-slate-100', text: 'text-slate-800' },
      Draft: { bg: 'bg-amber-100', text: 'text-amber-800' },
    };
    return colorMap[key] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const canGoPrev = page > 0;
  const canGoNext = rows.length === ADMIN_LIST_LIMIT;

  return (
    <div>
      <div className="my-6 space-y-4">
        <div className="rounded-lg border border-[#DBDADE] bg-white p-3 shadow-sm sm:p-4">
          <div
            className="-mx-1 overflow-x-auto scrollbar-hide overflow-y-visible pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"
            role="region"
            aria-label="Board filters"
          >
            <div className="flex w-max max-w-none flex-nowrap items-end gap-3 px-1">
              <div className="shrink-0">
                <MoreFilters
                  options={[...BOARD_FILTER_OPTIONS]}
                  selectedFilters={selectedFilters}
                  onFiltersChange={(filters) => {
                    setSelectedFilters(filters);
                    resetPage();
                  }}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-boards-sort" className={labelClass}>
                  Sort
                </label>
                <Select
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v as AdminListBoardsSort);
                    resetPage();
                  }}
                >
                  <SelectTrigger id="admin-boards-sort" className={`${controlClass} shadow-none`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value} className={adminSelectItemClassName}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`${scrollField} w-[9.5rem]`}>
                <label htmlFor="admin-boards-status" className={labelClass}>
                  Status
                </label>
                <Select
                  value={status === '' ? FILTER_ALL : status}
                  onValueChange={(v) => {
                    setStatus(v === FILTER_ALL ? '' : v);
                    resetPage();
                  }}
                >
                  <SelectTrigger id="admin-boards-status" className={`${controlClass} shadow-none`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value} className={adminSelectItemClassName}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`${scrollField} w-[9.5rem]`}>
                <label htmlFor="admin-boards-privacy" className={labelClass}>
                  Privacy
                </label>
                <Select
                  value={privacy === '' ? FILTER_ALL : privacy}
                  onValueChange={(v) => {
                    setPrivacy(v === FILTER_ALL ? '' : v);
                    resetPage();
                  }}
                >
                  <SelectTrigger id="admin-boards-privacy" className={`${controlClass} shadow-none`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIVACY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value} className={adminSelectItemClassName}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-boards-after" className={labelClass}>
                  Created after
                </label>
                <input
                  id="admin-boards-after"
                  type="date"
                  value={createdAfter}
                  onChange={(e) => {
                    setCreatedAfter(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-boards-before" className={labelClass}>
                  Created before
                </label>
                <input
                  id="admin-boards-before"
                  type="date"
                  value={createdBefore}
                  onChange={(e) => {
                    setCreatedBefore(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[10rem]`}>
                <label htmlFor="admin-boards-goal" className={labelClass}>
                  Goal type
                </label>
                <input
                  id="admin-boards-goal"
                  type="text"
                  placeholder="e.g. birthday"
                  value={goalType}
                  onChange={(e) => {
                    setGoalType(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[13rem]`}>
                <label htmlFor="admin-boards-creator" className={labelClass}>
                  Creator ID
                </label>
                <input
                  id="admin-boards-creator"
                  type="text"
                  placeholder="User UUID"
                  value={creatorId}
                  onChange={(e) => {
                    setCreatorId(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[13rem]`}>
                <label htmlFor="admin-boards-type-id" className={labelClass}>
                  Board type ID
                </label>
                <input
                  id="admin-boards-type-id"
                  type="text"
                  placeholder="Type UUID"
                  value={boardTypeId}
                  onChange={(e) => {
                    setBoardTypeId(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[6.5rem]`}>
                <label htmlFor="admin-boards-currency" className={labelClass}>
                  Currency
                </label>
                <input
                  id="admin-boards-currency"
                  type="text"
                  placeholder="USD"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-boards-spotlight-st" className={labelClass}>
                  Spotlight status
                </label>
                <input
                  id="admin-boards-spotlight-st"
                  type="text"
                  placeholder="Optional"
                  value={spotlightStatus}
                  onChange={(e) => {
                    setSpotlightStatus(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[18rem]`}>
                <label htmlFor="admin-boards-search" className={labelClass}>
                  Search boards
                </label>
                <div className="relative w-full">
                  <input
                    id="admin-boards-search"
                    type="search"
                    autoComplete="off"
                    placeholder="Title, etc."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${controlClass} pr-10`}
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <Search size={18} className="text-gray-600" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            Scroll sideways to reach every filter. More filters sets spotlight and include deleted.
          </p>
        </div>

        {loadError && (
          <p className="text-sm text-red-600" role="alert">
            Could not load boards: {loadError}
          </p>
        )}
      </div>

      <div className="w-full h-[calc(100vh-190px)] max-h-[100vh]">
        <div className="relative rounded-[10px] w-full border border-[#DBDADE] bg-white overflow-hidden">
          <div className="h-[calc(100vh-170px)] md:h-[calc(100vh-190px)] max-h-[100vh] w-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-black text-white border-b border-[#E9E9E9] text-lg sticky top-[0px] z-30">
                <tr>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Board Title
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Board Type
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Created By
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Participants Count
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Total Gifts
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading &&
                  rows.map((board, index) => {
                    const typeColors = getBoardTypeColor(board.boardType);
                    return (
                      <tr
                        key={board.id}
                        className={`border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {board.title}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}
                          >
                            {board.boardType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{board.createdBy}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {board.createdDateDisplay}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{board.participantsCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {board.totalGiftsDisplay}
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                              >
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
                {!loading && rows.length === 0 && !loadError && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No boards match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-gray-700">
          <span>
            Page {page + 1}
            {rows.length > 0 ? ` · ${rows.length} shown` : ''}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!canGoPrev || loading}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 rounded-[5px] border border-gray-900 bg-white text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!canGoNext || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-[5px] border border-gray-900 bg-white text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBoards;

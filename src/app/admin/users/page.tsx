'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminSelect from '@/components/adminComponents/AdminSelect';
import {
  buildAdminListProfilesParams,
  fetchAdminListProfiles,
  type AdminListProfilesSort,
  type AdminProfileRow,
} from '@/lib/supabase/adminProfiles';
import { ADMIN_LIST_LIMIT, adminListOffset } from '@/lib/supabase/adminListPagination';

const USER_FILTER_OPTIONS = [
  { value: 'account_active', label: 'Account: Active' },
  { value: 'account_suspended', label: 'Account: Suspended' },
  { value: 'phone_verified', label: 'Phone verified' },
  { value: 'phone_unverified', label: 'Phone not verified' },
  { value: 'profile_verified', label: 'Verified profile' },
  { value: 'profile_unverified', label: 'Unverified profile' },
  { value: 'public_profile', label: 'Public profile' },
  { value: 'private_profile', label: 'Private profile' },
  { value: 'include_deleted', label: 'Include deleted' },
] as const;

const SORT_OPTIONS: { value: AdminListProfilesSort; label: string }[] = [
  { value: 'created_at_desc', label: 'Newest first' },
  { value: 'created_at_asc', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name (A–Z)' },
];

const controlClass =
  '!h-[43px] w-full rounded-[5px] border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-colors border-gray-900 focus:ring-0';

const labelClass = 'text-xs font-medium text-gray-700 whitespace-nowrap';

const scrollField = 'flex shrink-0 flex-col gap-1.5';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [sort, setSort] = useState<AdminListProfilesSort>('created_at_desc');
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AdminProfileRow[]>([]);
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
    const rpcParams = buildAdminListProfilesParams({
      search: debouncedSearch,
      selectedFilterTags: selectedFilters,
      country,
      createdAfter,
      createdBefore,
      sort,
      limit: ADMIN_LIST_LIMIT,
      offset: adminListOffset(page),
    });
    const { rows: next, error } = await fetchAdminListProfiles(rpcParams);
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
    country,
    createdAfter,
    createdBefore,
    sort,
    page,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const canGoPrev = page > 0;
  const canGoNext = rows.length === ADMIN_LIST_LIMIT;

  return (
    <div>
      <div className="my-6 space-y-4">
        <div className="rounded-lg border border-[#DBDADE] bg-white p-3 shadow-sm sm:p-4">
          <div
            className="-mx-1 overflow-x-auto scrollbar-hide overflow-y-visible pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"
            role="region"
            aria-label="User filters"
          >
            <div className="flex w-max max-w-none flex-nowrap items-end gap-3 px-1">
              <div className="shrink-0">
                <MoreFilters
                  options={[...USER_FILTER_OPTIONS]}
                  selectedFilters={selectedFilters}
                  onFiltersChange={(filters) => {
                    setSelectedFilters(filters);
                    resetPage();
                  }}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-users-sort" className={labelClass}>
                  Sort
                </label>
                <AdminSelect
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v as AdminListProfilesSort);
                    resetPage();
                  }}
                >
                  <AdminSelect.Trigger id="admin-users-sort" className={`${controlClass} shadow-none`}>
                    <AdminSelect.Value />
                  </AdminSelect.Trigger>
                  <AdminSelect.Content>
                    {SORT_OPTIONS.map((o) => (
                      <AdminSelect.Item key={o.value} value={o.value}>
                        {o.label}
                      </AdminSelect.Item>
                    ))}
                  </AdminSelect.Content>
                </AdminSelect>
              </div>
              <div className={`${scrollField} w-[13rem]`}>
                <label htmlFor="admin-users-country" className={labelClass}>
                  Country
                </label>
                <input
                  id="admin-users-country"
                  type="text"
                  placeholder="Filter by country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-users-after" className={labelClass}>
                  Joined after
                </label>
                <input
                  id="admin-users-after"
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
                <label htmlFor="admin-users-before" className={labelClass}>
                  Joined before
                </label>
                <input
                  id="admin-users-before"
                  type="date"
                  value={createdBefore}
                  onChange={(e) => {
                    setCreatedBefore(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[14rem]`}>
                <label htmlFor="admin-users-search" className={labelClass}>
                  Search users
                </label>
                <div className="relative w-full">
                  <input
                    id="admin-users-search"
                    type="search"
                    autoComplete="off"
                    placeholder="Name or email"
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
            Scroll sideways for all filters. More filters sets account, phone, profile, and deleted.
          </p>
        </div>
        {loadError && (
          <p className="text-sm text-red-600" role="alert">
            Could not load users: {loadError}
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
                    Name
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Phone
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Account Status
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Join Date
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading &&
                  rows.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {user.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {user.phone || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.accountStatusKey === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.accountStatusKey === 'suspended'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {user.accountStatusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {user.joinDateDisplay}
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
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.accountStatusKey === 'suspended' ? 'Activate' : 'Suspend'}
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                {!loading && rows.length === 0 && !loadError && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No users match your filters.
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

export default AdminUsers;

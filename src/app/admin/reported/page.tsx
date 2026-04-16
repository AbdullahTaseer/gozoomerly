'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminSelect from '@/components/adminComponents/AdminSelect';
import {
  buildAdminListModerationReportsParams,
  fetchAdminListModerationReports,
  type AdminListModerationReportsSort,
  type AdminModerationReportRow,
} from '@/lib/supabase/adminModerationReports';
import { ADMIN_LIST_LIMIT, adminListOffset } from '@/lib/supabase/adminListPagination';

const controlClass =
  '!h-[43px] w-full rounded-[5px] border border-gray-900 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-0';

const labelClass = 'text-xs font-medium text-gray-700 whitespace-nowrap';

const scrollField = 'flex shrink-0 flex-col gap-1.5';

const STATUS_ALL = '__all__';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: STATUS_ALL, label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
];

const SORT_OPTIONS: { value: AdminListModerationReportsSort; label: string }[] = [
  { value: 'created_at_desc', label: 'Newest first' },
  { value: 'created_at_asc', label: 'Oldest first' },
];

const AdminReported = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [contentType, setContentType] = useState('');
  const [reason, setReason] = useState('');
  const [reporterId, setReporterId] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [resolvedAfter, setResolvedAfter] = useState('');
  const [resolvedBefore, setResolvedBefore] = useState('');
  const [sort, setSort] = useState<AdminListModerationReportsSort>('created_at_desc');
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AdminModerationReportRow[]>([]);
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
    const rpcParams = buildAdminListModerationReportsParams({
      search: debouncedSearch,
      status,
      contentType,
      reason,
      reporterId,
      createdAfter,
      createdBefore,
      resolvedAfter,
      resolvedBefore,
      sort,
      limit: ADMIN_LIST_LIMIT,
      offset: adminListOffset(page),
    });
    const { rows: next, error } = await fetchAdminListModerationReports(rpcParams);
    if (error) {
      setLoadError(error.message);
      setRows([]);
    } else {
      setRows(next);
    }
    setLoading(false);
  }, [
    debouncedSearch,
    status,
    contentType,
    reason,
    reporterId,
    createdAfter,
    createdBefore,
    resolvedAfter,
    resolvedBefore,
    sort,
    page,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  const getStatusColor = (row: AdminModerationReportRow) => {
    if (row.statusKey === 'resolved') return { bg: 'bg-green-100', text: 'text-green-800' };
    if (row.statusKey === 'pending') return { bg: 'bg-pink-100', text: 'text-pink-800' };
    return { bg: 'bg-orange-100', text: 'text-orange-800' };
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
            aria-label="Moderation report filters"
          >
            <div className="flex w-max max-w-none flex-nowrap items-end gap-3 px-1">
              <div className={`${scrollField} w-[10.5rem]`}>
                <label htmlFor="admin-reported-sort" className={labelClass}>
                  Sort
                </label>
                <AdminSelect
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v as AdminListModerationReportsSort);
                    resetPage();
                  }}
                >
                  <AdminSelect.Trigger id="admin-reported-sort" className={`${controlClass} shadow-none`}>
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
              <div className={`${scrollField} w-[10rem]`}>
                <label htmlFor="admin-reported-status" className={labelClass}>
                  Status
                </label>
                <AdminSelect
                  value={status === '' ? STATUS_ALL : status}
                  onValueChange={(v) => {
                    setStatus(v === STATUS_ALL ? '' : v);
                    resetPage();
                  }}
                >
                  <AdminSelect.Trigger id="admin-reported-status" className={`${controlClass} shadow-none`}>
                    <AdminSelect.Value />
                  </AdminSelect.Trigger>
                  <AdminSelect.Content>
                    {STATUS_OPTIONS.map((o) => (
                      <AdminSelect.Item key={o.value} value={o.value}>
                        {o.label}
                      </AdminSelect.Item>
                    ))}
                  </AdminSelect.Content>
                </AdminSelect>
              </div>
              <div className={`${scrollField} w-[10rem]`}>
                <label htmlFor="admin-reported-content-type" className={labelClass}>
                  Content type
                </label>
                <input
                  id="admin-reported-content-type"
                  type="text"
                  placeholder="e.g. board"
                  value={contentType}
                  onChange={(e) => {
                    setContentType(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-reported-reason" className={labelClass}>
                  Reason
                </label>
                <input
                  id="admin-reported-reason"
                  type="text"
                  placeholder="Filter by reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[12rem]`}>
                <label htmlFor="admin-reported-reporter" className={labelClass}>
                  Reporter ID
                </label>
                <input
                  id="admin-reported-reporter"
                  type="text"
                  placeholder="User UUID"
                  value={reporterId}
                  onChange={(e) => {
                    setReporterId(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-reported-created-after" className={labelClass}>
                  Created after
                </label>
                <input
                  id="admin-reported-created-after"
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
                <label htmlFor="admin-reported-created-before" className={labelClass}>
                  Created before
                </label>
                <input
                  id="admin-reported-created-before"
                  type="date"
                  value={createdBefore}
                  onChange={(e) => {
                    setCreatedBefore(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-reported-resolved-after" className={labelClass}>
                  Resolved after
                </label>
                <input
                  id="admin-reported-resolved-after"
                  type="date"
                  value={resolvedAfter}
                  onChange={(e) => {
                    setResolvedAfter(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[11rem]`}>
                <label htmlFor="admin-reported-resolved-before" className={labelClass}>
                  Resolved before
                </label>
                <input
                  id="admin-reported-resolved-before"
                  type="date"
                  value={resolvedBefore}
                  onChange={(e) => {
                    setResolvedBefore(e.target.value);
                    resetPage();
                  }}
                  className={controlClass}
                />
              </div>
              <div className={`${scrollField} w-[18rem]`}>
                <label htmlFor="admin-reported-search" className={labelClass}>
                  Search
                </label>
                <div className="relative w-full">
                  <input
                    id="admin-reported-search"
                    type="search"
                    autoComplete="off"
                    placeholder="Search reports"
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
            Scroll sideways for all filters. Search maps to the API text search parameter.
          </p>
        </div>

        {loadError && (
          <p className="text-sm text-red-600" role="alert">
            Could not load reports: {loadError}
          </p>
        )}
      </div>

      <div className="w-full">
        <div className="relative rounded-[10px] w-full border border-[#DBDADE] bg-white overflow-hidden">
          <div className="h-[calc(100vh-320px)] md:h-[calc(100vh-340px)] w-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-black text-white border-b border-[#E9E9E9] text-lg sticky top-[0px] z-30">
                <tr>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Report ID
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Reported By
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Content Type
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Reason
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium">
                    Status
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
                  rows.map((report, index) => {
                    const statusColors = getStatusColor(report);
                    return (
                      <tr
                        key={report.id}
                        className={`border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {report.reportId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{report.reportedBy || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{report.contentType || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{report.reason || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {report.timestampDisplay}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                          >
                            {report.statusLabel}
                          </span>
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
                              <DropdownMenuItem>Review Report</DropdownMenuItem>
                              <DropdownMenuItem>
                                {report.statusKey === 'resolved' ? 'Reopen' : 'Mark as Resolved'}
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive">Delete Report</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                {!loading && rows.length === 0 && !loadError && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      No reports match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-3 border-t border-[#E9E9E9] bg-white">
            <span className="text-sm text-gray-500">
              Showing {adminListOffset(page) + 1}–{adminListOffset(page) + rows.length} results
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canGoPrev || loading}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-[#DBDADE] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!canGoNext || loading}
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

export default AdminReported;

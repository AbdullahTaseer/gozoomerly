'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  adminListSupportTickets,
  adminUpdateSupportTicketStatus,
  SUPPORT_TICKET_STATUSES,
  type SupportTicketRow,
  type SupportTicketStatus,
} from '@/lib/supabase/support';

const PAGE_SIZE = 20;

function field(row: SupportTicketRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== null && v !== undefined && v !== '') return String(v);
  }
  return '';
}

const AdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);

  const patchTicketStatus = useCallback((ticketId: string, newStatus: SupportTicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        const id = field(t, 'ticket_id', 'ticketId', 'id');
        if (id !== ticketId) return t;
        return { ...t, status: newStatus, ticket_status: newStatus };
      })
    );
  }, []);

  const handleUpdateTicketStatus = useCallback(
    async (ticketId: string, newStatus: SupportTicketStatus) => {
      if (!ticketId) return;
      setUpdatingTicketId(ticketId);
      const { error: updateError } = await adminUpdateSupportTicketStatus({
        p_ticket_id: ticketId,
        p_status: newStatus,
      });
      setUpdatingTicketId(null);
      if (updateError) {
        toast.error(updateError.message);
        return;
      }
      toast.success(`Ticket status updated to ${newStatus}`);
      patchTicketStatus(ticketId, newStatus);
    },
    [patchTicketStatus]
  );

  const fetchTickets = useCallback(
    async (newOffset: number, status?: string) => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await adminListSupportTickets({
        p_status: status ?? statusFilter,
        p_limit: PAGE_SIZE,
        p_offset: newOffset,
      });

      setLoading(false);

      if (fetchError) {
        setError(fetchError.message);
        setTickets([]);
        return;
      }

      const rows = data ?? [];
      setTickets(rows);
      setHasMore(rows.length >= PAGE_SIZE);
      setOffset(newOffset);
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchTickets(0);
  }, [fetchTickets]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    fetchTickets(0, status);
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) => {
      const searchable = [
        field(t, 'ticket_id', 'ticketId', 'id'),
        field(t, 'user_name', 'userName', 'user', 'full_name', 'fullName', 'name', 'user_email', 'email'),
        field(t, 'message_preview', 'messagePreview', 'message', 'subject', 'title', 'description', 'content', 'body', 'text'),
        field(t, 'category', 'type'),
      ].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  }, [tickets, searchQuery]);

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    const colorMap: Record<string, { bg: string; text: string }> = {
      resolved: { bg: 'bg-green-100', text: 'text-green-800' },
      open: { bg: 'bg-orange-100', text: 'text-orange-800' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-900' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-600' },
    };
    return colorMap[normalized] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {error && (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          Could not load support tickets: {error}
        </div>
      )}

      <div className="max-[500px]:grid grid-cols-2 flex justify-end gap-4 my-6">
        <div className="flex items-center gap-2">
          {['', 'open', 'pending', 'resolved', 'closed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-[#DBDADE] hover:bg-gray-50'
              }`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
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
          <div className="h-[calc(100vh-230px)] md:h-[calc(100vh-250px)] max-h-[100vh] w-full overflow-x-auto overflow-y-auto">
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      {error
                        ? 'Fix the error above, then refresh the page.'
                        : 'No support tickets found.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((ticket, index) => {
                    const ticketId = field(ticket, 'ticket_id', 'ticketId', 'id');
                    const userName = field(ticket, 'user_name', 'userName', 'user', 'full_name', 'fullName', 'name', 'user_email', 'email');
                    const message = field(ticket, 'message_preview', 'messagePreview', 'message', 'subject', 'title', 'description', 'content', 'body', 'text');
                    const category = field(ticket, 'category', 'type');
                    const date = field(ticket, 'created_at', 'createdAt', 'date', 'updated_at');
                    const status = field(ticket, 'status', 'ticket_status');
                    const statusColors = getStatusColor(status);
                    return (
                      <tr
                        key={ticketId || index}
                        className={`border-t text-center border-[#E9E9E9] hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {ticketId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 min-w-[200px]">
                          {message}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {formatDate(date)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                          >
                            {status}
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
                              <DropdownMenuSeparator />
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                  disabled={!ticketId || updatingTicketId === ticketId}
                                >
                                  Update status
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {SUPPORT_TICKET_STATUSES.map((s) => {
                                    const current = status.toLowerCase() === s;
                                    return (
                                      <DropdownMenuItem
                                        key={s}
                                        disabled={
                                          !ticketId ||
                                          updatingTicketId === ticketId ||
                                          current
                                        }
                                        onClick={() =>
                                          handleUpdateTicketStatus(ticketId, s)
                                        }
                                      >
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                        {current ? ' (current)' : ''}
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                Delete Ticket
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              Showing {offset + 1}–{offset + filtered.length} results
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={offset === 0 || loading}
                onClick={() => fetchTickets(Math.max(0, offset - PAGE_SIZE))}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-[#DBDADE] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!hasMore || loading}
                onClick={() => fetchTickets(offset + PAGE_SIZE)}
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

export default AdminSupport;

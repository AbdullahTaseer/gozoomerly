'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Users,
  Layers,
  Gift,
  Clock,
  AlertCircle,
  UserPlus,
  DollarSign,
} from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import {
  fetchAdminDashboardStats,
  type AdminDashboardStats,
} from '@/lib/supabase/adminDashboard';

function formatCount(value: number | null, loading: boolean): string {
  if (loading) return '…';
  if (value == null) return '—';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function formatCurrency(value: number | null, loading: boolean): string {
  if (loading) return '…';
  if (value == null) return '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
}

const AdminHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      const { stats: next, error } = await fetchAdminDashboardStats();
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
        setStats(null);
      } else {
        setStats(next);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dashboardCards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: formatCount(stats?.totalUsers ?? null, loading),
        icon: Users,
      },
      {
        title: 'Total Boards',
        value: formatCount(stats?.totalBoards ?? null, loading),
        icon: Layers,
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(stats?.totalRevenue ?? null, loading),
        icon: DollarSign,
      },
      {
        title: 'Total Gifts',
        value: formatCurrency(stats?.totalGiftAmount ?? null, loading),
        subText: 'All-time gift amount',
        icon: Gift,
      },
      {
        title: 'New Users',
        value: formatCount(stats?.newUsers24h ?? null, loading),
        subText: 'Last 24 hours',
        icon: UserPlus,
      },
      {
        title: 'New Boards',
        value: formatCount(stats?.newBoards24h ?? null, loading),
        subText: 'Last 24 hours',
        icon: Layers,
      },
      {
        title: 'Gifts Pending Payout',
        value: formatCount(stats?.giftsPendingPayout ?? null, loading),
        icon: Clock,
      },
      {
        title: 'Reported Content',
        value: formatCount(stats?.reportedOpen ?? null, loading),
        subText: 'Open cases',
        icon: AlertCircle,
      },
    ],
    [stats, loading],
  );

  return (
    <main className="flex-1 rounded-tl-lg overflow-y-auto">
      <div>
        <div className="max-[500px]:grid grid-cols-2 flex justify-end gap-4 my-6">
          <MoreFilters
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
          />
          <div className="max-[500px]:w-full w-[180px] relative bg-white">
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

        {loadError && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            Could not load dashboard stats: {loadError}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-md font-medium text-black">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  </div>
                  <div className="bg-[#EFF3F8] p-2 sm:p-3 rounded-md">
                    <Icon color="black" className="h-4 w-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
                {card.subText && (
                  <p className="text-xs text-gray-500">{card.subText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminHome;

import React, { useState, useMemo, useEffect } from 'react';
import { Account, AccountStatus, FriendSuggestionStatus, FilterState } from './types';
import { Toolbar } from './components/Toolbar';
import { AccountTable } from './components/AccountTable';
import { EditModal } from './components/EditModal';
import { TwoFAPopup, CookiesPopup } from './components/Modals';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const generateMockAccounts = (count: number): Account[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `acc-${i + 1}`,
    username: `user_${i + 1}`,
    email: `user_${i + 1}@example.com`,
    fbUid: `1000${Math.floor(Math.random() * 900000000)}`,
    password: `Pass${Math.random().toString(36).substring(7)}`,
    twoFASecret: 'JBSWY3DPEHPK3PXP',
    cookies: `[{"domain": ".facebook.com", "name": "c_user", "value": "1000${i}"}, {"domain": ".facebook.com", "name": "xs", "value": "34%3AkeepTest"}]`,
    status: Object.values(AccountStatus)[Math.floor(Math.random() * 4)],
    friendCount: Math.floor(Math.random() * 5000),
    hasFriendSuggestions: Math.random() > 0.5,
    createdDate: new Date(2022 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
    notes: i % 5 === 0 ? "Flagged for review due to login patterns." : ""
  }));
};

const ITEMS_PER_PAGE = 50;

function App() {
  // State
  const [accounts, setAccounts] = useState<Account[]>(() => generateMockAccounts(2300));
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    status: 'All',
    friendSuggestion: FriendSuggestionStatus.All,
    creationYear: 'All',
    sortBy: 'friendsDesc'
  });
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal States
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [twoFAAccount, setTwoFAAccount] = useState<Account | null>(null);
  const [cookiesAccount, setCookiesAccount] = useState<Account | null>(null);

  // Filtering Logic
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      // Search
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        acc.username.toLowerCase().includes(query) || 
        acc.fbUid.includes(query) || 
        (acc.notes && acc.notes.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Status
      if (filters.status !== 'All' && acc.status !== filters.status) return false;

      // Suggestions
      if (filters.friendSuggestion !== FriendSuggestionStatus.All) {
         const hasSugg = filters.friendSuggestion === FriendSuggestionStatus.Yes;
         if (acc.hasFriendSuggestions !== hasSugg) return false;
      }

      // Year
      const year = new Date(acc.createdDate).getFullYear();
      if (filters.creationYear === '<2024' && year >= 2024) return false;
      if (filters.creationYear === '>2024' && year <= 2024) return false;
      if (filters.creationYear === '2023-2024' && (year < 2023 || year > 2024)) return false;

      return true;
    }).sort((a, b) => {
      // Sort
      if (filters.sortBy === 'friendsDesc') return b.friendCount - a.friendCount;
      if (filters.sortBy === 'createdDesc') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (filters.sortBy === 'lastUpdateAsc') return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
      return 0;
    });
  }, [accounts, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAccounts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAccounts, currentPage]);

  // Handlers
  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedAccounts.length && paginatedAccounts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAccounts.map(a => a.id)));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} accounts?`)) {
       setAccounts(prev => prev.filter(a => !selectedIds.has(a.id)));
       setSelectedIds(new Set());
    }
  };

  const handleBulkUpdateStatus = (status: AccountStatus) => {
      setAccounts(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, status } : a));
      setSelectedIds(new Set());
  };

  const handleDeleteOne = (id: string) => {
    if (window.confirm("Delete this account?")) {
        setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSaveAccount = (updated: Account) => {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
    setIsEditOpen(false);
    setEditingAccount(null);
  };

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [filters]);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
        <div>
           <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-mono text-sm shadow">AC</div>
             Account Command Center
           </h1>
           <p className="text-xs text-slate-500 mt-1">Operational Overview & Management</p>
        </div>
        <div className="text-right">
           <div className="text-sm font-semibold text-slate-800">{accounts.length.toLocaleString()} Accounts</div>
           <div className="text-xs text-green-600 font-medium">{accounts.filter(a => a.status === AccountStatus.Active).length.toLocaleString()} Active</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Toolbar 
          filters={filters} 
          setFilters={setFilters} 
          selectedCount={selectedIds.size}
          onBulkDelete={handleBulkDelete}
          onBulkUpdateStatus={handleBulkUpdateStatus}
        />
        
        <AccountTable 
          accounts={paginatedAccounts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onView2FA={(acc) => setTwoFAAccount(acc)}
          onViewCookies={(acc) => setCookiesAccount(acc)}
          onEdit={(acc) => { setEditingAccount(acc); setIsEditOpen(true); }}
          onDelete={handleDeleteOne}
        />
        
        {/* Pagination Footer */}
        <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
           <div className="text-sm text-slate-500">
             Showing <span className="font-medium text-slate-900">{filteredAccounts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAccounts.length)}</span> of <span className="font-medium text-slate-900">{filteredAccounts.length}</span> results
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                 {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    // Logic to show generic page window around current page
                    let p = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                       p = currentPage - 2 + i;
                       if (p > totalPages) p = totalPages - (4 - i);
                    }
                    return (
                        <button 
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-8 h-8 text-xs font-medium rounded-md transition-colors ${currentPage === p ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {p}
                        </button>
                    );
                 })}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </main>

      {/* Modals */}
      <EditModal 
        isOpen={isEditOpen} 
        account={editingAccount} 
        onClose={() => setIsEditOpen(false)} 
        onSave={handleSaveAccount}
      />
      
      <TwoFAPopup 
        isOpen={!!twoFAAccount} 
        onClose={() => setTwoFAAccount(null)} 
        secret={twoFAAccount?.twoFASecret || ''}
      />

      <CookiesPopup 
         isOpen={!!cookiesAccount}
         onClose={() => setCookiesAccount(null)}
         cookies={cookiesAccount?.cookies || ''}
      />
    </div>
  );
}

export default App;

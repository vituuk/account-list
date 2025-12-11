import React from 'react';
import { FilterState, AccountStatus, FriendSuggestionStatus } from '../types';
import { Search, Filter, ArrowUpDown, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';

interface ToolbarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkUpdateStatus: (status: AccountStatus) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  filters, 
  setFilters, 
  selectedCount,
  onBulkDelete,
  onBulkUpdateStatus
}) => {
  
  const handleInputChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border-b border-slate-200 p-4 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search Username, UID, or Notes..."
            value={filters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
          />
        </div>

        {/* Bulk Actions (Conditional) */}
        {selectedCount > 0 && (
           <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 animate-fade-in">
             <span className="text-sm font-semibold text-blue-800">{selectedCount} Selected</span>
             <div className="h-4 w-px bg-blue-200 mx-1"></div>
             <button 
                onClick={onBulkDelete}
                className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" title="Delete Selected">
               <Trash2 className="w-4 h-4" />
             </button>
             <div className="relative group">
                <button className="text-slate-600 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors" title="Update Status">
                  <ShieldCheck className="w-4 h-4" />
                </button>
                {/* Simple dropdown for bulk status */}
                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded shadow-lg hidden group-hover:block z-50">
                   {Object.values(AccountStatus).map(s => (
                     <button key={s} onClick={() => onBulkUpdateStatus(s)} className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-700">{s}</button>
                   ))}
                </div>
             </div>
           </div>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filters:</span>
        </div>

        {/* Status Filter */}
        <select 
          className="form-select block pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
          value={filters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="All">Status: All</option>
          {Object.values(AccountStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Friend Suggestion */}
        <select 
          className="form-select block pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
          value={filters.friendSuggestion}
          onChange={(e) => handleInputChange('friendSuggestion', e.target.value)}
        >
          <option value={FriendSuggestionStatus.All}>Suggestions: All</option>
          <option value={FriendSuggestionStatus.Yes}>With Suggestions</option>
          <option value={FriendSuggestionStatus.No}>No Suggestions</option>
        </select>

        {/* Year */}
        <select 
          className="form-select block pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm"
          value={filters.creationYear}
          onChange={(e) => handleInputChange('creationYear', e.target.value)}
        >
          <option value="All">Created: Any Time</option>
          <option value="<2024">Before 2024</option>
          <option value="2023-2024">2023 - 2024</option>
          <option value=">2024">After 2024</option>
        </select>

        <div className="flex-grow"></div>

        {/* Sort */}
        <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <select 
              className="form-select block pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md shadow-sm font-medium text-slate-700"
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
            >
              <option value="friendsDesc">Sort: Friends (High-Low)</option>
              <option value="lastUpdateAsc">Sort: Last Update (Oldest)</option>
              <option value="createdDesc">Sort: Created (Newest)</option>
            </select>
        </div>
      </div>
    </div>
  );
};

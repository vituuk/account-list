import React, { useState } from 'react';
import { Account, AccountStatus } from '../types';
import { StatusBadge, SuggestionBadge } from './Badge';
import { Eye, EyeOff, MoreHorizontal, KeyRound, Cookie, Pencil, Trash2, ExternalLink } from 'lucide-react';

interface AccountTableProps {
  accounts: Account[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onView2FA: (account: Account) => void;
  onViewCookies: (account: Account) => void;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView2FA,
  onViewCookies,
  onEdit,
  onDelete
}) => {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const togglePassword = (id: string) => {
    const newSet = new Set(visiblePasswords);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisiblePasswords(newSet);
  };

  const handleMenuClick = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const isAllSelected = accounts.length > 0 && selectedIds.size === accounts.length;

  return (
    <div className="overflow-x-auto min-h-0 flex-1">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status / Info
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Credentials
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Data Points
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Updated
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {accounts.map((account) => (
            <tr key={account.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                  checked={selectedIds.has(account.id)}
                  onChange={() => onToggleSelect(account.id)}
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                  <StatusBadge status={account.status} />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{account.username}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">UID: {account.fbUid}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-24 overflow-hidden text-ellipsis">
                      {visiblePasswords.has(account.id) ? account.password : '••••••••'}
                    </span>
                    <button onClick={() => togglePassword(account.id)} className="text-slate-400 hover:text-slate-600">
                      {visiblePasswords.has(account.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => onView2FA(account)}
                        className="flex items-center gap-1 text-xs text-slate-600 hover:text-primary bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-slate-200"
                        title="Get 2FA Code"
                     >
                        <KeyRound className="w-3 h-3" />
                        2FA
                     </button>
                     <button 
                         onClick={() => onViewCookies(account)}
                         className="flex items-center gap-1 text-xs text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-2 py-1 rounded transition-colors border border-slate-200"
                         title="View Cookies"
                     >
                        <Cookie className="w-3 h-3" />
                        Cookies
                     </button>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1.5">
                   <div className="text-sm text-slate-700">
                     <span className="font-semibold">{account.friendCount.toLocaleString()}</span> <span className="text-slate-500 text-xs">Friends</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-500">Suggested:</span>
                     <SuggestionBadge hasSuggestion={account.hasFriendSuggestions} />
                   </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                <div className="flex flex-col">
                    <span>{new Date(account.lastUpdated).toLocaleDateString()}</span>
                    <span className="text-xs text-slate-400">Created: {new Date(account.createdDate).getFullYear()}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                    <button 
                        onClick={() => handleMenuClick(account.id)}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === account.id && (
                        <>
                        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setOpenMenuId(null)}></div>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-30 py-1 flex flex-col">
                            <button 
                                onClick={() => { onEdit(account); setOpenMenuId(null); }}
                                className="text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2"
                            >
                                <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button 
                                onClick={() => { onDelete(account.id); setOpenMenuId(null); }}
                                className="text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                        </>
                    )}
                </div>
              </td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                No accounts found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

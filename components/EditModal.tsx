import React, { useState, useEffect } from 'react';
import { Account, AccountStatus } from '../types';
import { X, Save, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { analyzeAccountHealth } from '../services/geminiService';

interface EditModalProps {
  isOpen: boolean;
  account: Account | null;
  onClose: () => void;
  onSave: (updatedAccount: Account) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, account, onClose, onSave }) => {
  const [formData, setFormData] = useState<Account | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  useEffect(() => {
    if (account) {
      setFormData({ ...account });
      setAiAnalysis(''); // Reset analysis when opening a new account
    }
  }, [account, isOpen]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof Account, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  const handleAIAnalysis = async () => {
    if (!formData) return;
    setIsAnalyzing(true);
    setAiAnalysis('');
    try {
      const result = await analyzeAccountHealth(formData);
      setAiAnalysis(result);
    } catch (e) {
      setAiAnalysis("Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Edit Account: <span className="text-primary">{formData.username}</span></h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Core Data */}
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
                    <input type="text" disabled value={formData.username} className="w-full bg-slate-100 border border-slate-300 text-slate-500 rounded px-3 py-2 text-sm focus:outline-none cursor-not-allowed" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      {Object.values(AccountStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
                    <input 
                      type="text" 
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-mono" 
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">2FA Secret Key</label>
                    <input 
                      type="text" 
                      value={formData.twoFASecret}
                      onChange={(e) => handleChange('twoFASecret', e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-xs" 
                    />
                 </div>
              </div>

              {/* Right Column: Stats & Dates */}
              <div className="space-y-4">
                 <div className="flex gap-4">
                   <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Friend Count</label>
                      <input 
                        type="number" 
                        value={formData.friendCount}
                        onChange={(e) => handleChange('friendCount', parseInt(e.target.value))}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                   </div>
                   <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Created Date</label>
                      <input 
                        type="date" 
                        value={formData.createdDate.split('T')[0]}
                        onChange={(e) => handleChange('createdDate', new Date(e.target.value).toISOString())}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" 
                      />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Friend Suggestions?</label>
                   <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={formData.hasFriendSuggestions} onChange={() => handleChange('hasFriendSuggestions', true)} className="text-primary focus:ring-primary" />
                        <span className="text-sm text-slate-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={!formData.hasFriendSuggestions} onChange={() => handleChange('hasFriendSuggestions', false)} className="text-primary focus:ring-primary" />
                        <span className="text-sm text-slate-700">No</span>
                      </label>
                   </div>
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cookies (JSON)</label>
                    <textarea 
                      rows={3}
                      value={formData.cookies}
                      onChange={(e) => handleChange('cookies', e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    ></textarea>
                 </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Internal Notes</label>
              <textarea 
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Log significant events here..."
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>

            {/* Gemini Analysis Section */}
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-indigo-600" />
                   <h3 className="text-sm font-bold text-indigo-900">AI Health Audit</h3>
                 </div>
                 <button 
                   type="button" 
                   onClick={handleAIAnalysis}
                   disabled={isAnalyzing}
                   className="text-xs flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded transition-colors font-medium disabled:opacity-50"
                 >
                   {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                   {isAnalyzing ? 'Analyzing...' : 'Analyze Account'}
                 </button>
               </div>
               
               {aiAnalysis ? (
                 <div className="text-sm text-indigo-800 leading-relaxed animate-fade-in bg-white/50 p-3 rounded border border-indigo-100">
                   {aiAnalysis}
                 </div>
               ) : (
                 <p className="text-xs text-indigo-400 italic">Click analyze to get insights from Gemini about this account's health.</p>
               )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-form"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded shadow-sm hover:shadow transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

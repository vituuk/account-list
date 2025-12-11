import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
       <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
             <h3 className="font-semibold text-slate-800">{title}</h3>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-4">
             {children}
          </div>
       </div>
    </div>
  );
};

export const TwoFAPopup: React.FC<{ isOpen: boolean; onClose: () => void; secret: string }> = ({ isOpen, onClose, secret }) => {
  // Simulate code generation based on time
  const [code, setCode] = useState('000 000');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (isOpen) {
       // Mock logic to "generate" a code
       const mockCode = Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1 $2');
       setCode(mockCode);
       setTimeLeft(30);
       const timer = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 1) {
                const newCode = Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1 $2');
                setCode(newCode);
                return 30;
            }
            return prev - 1;
         });
       }, 1000);
       return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title="2FA Authentication">
       <div className="flex flex-col items-center justify-center py-4">
          <div className="text-4xl font-mono font-bold text-slate-800 tracking-wider mb-2">{code}</div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
             <div className="bg-blue-500 h-full transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 text-center">
            This code will expire in {timeLeft} seconds.
          </p>
       </div>
    </SimpleModal>
  );
};

export const CookiesPopup: React.FC<{ isOpen: boolean; onClose: () => void; cookies: string }> = ({ isOpen, onClose, cookies }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(cookies);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SimpleModal isOpen={isOpen} onClose={onClose} title="Account Cookies">
            <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono text-slate-600 break-all max-h-48 overflow-y-auto">
                    {cookies}
                </div>
                <button 
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied to Clipboard' : 'Copy JSON'}
                </button>
            </div>
        </SimpleModal>
    );
}

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

interface AdminAuthModalProps {
  onSuccess?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onSuccess }) => {
  const { loginAdmin } = useCMS();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(password);
    if (ok) {
      setError(false);
      if (onSuccess) onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 liquid-glass bg-[#171614] border border-[#D1C7BB]/30 p-8 rounded-sm text-center space-y-6 shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-[#201C18] border border-[#D1C7BB]/40 flex items-center justify-center mx-auto text-[#D1C7BB]">
        <Lock className="w-6 h-6" />
      </div>

      <div>
        <h2 className="text-2xl font-editorial-heading font-black text-[#F2EDE4]">
          Admin CMS Portal
        </h2>
        <p className="text-xs text-[#A99E92] mt-1">
          Enter password to access Tayyabs.Designs management dashboard.
        </p>
      </div>

      {error && (
        <p className="text-xs text-[#F2EDE4] bg-[#201C18] p-2 border border-[#F2EDE4]/30 rounded">
          Invalid Admin Password. Try <code className="text-[#D1C7BB]">admin123</code>
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Passcode (e.g. admin123)"
          className="w-full bg-[#101010] border border-[#D1C7BB]/20 focus:border-[#D1C7BB] text-[#F2EDE4] text-sm p-3 rounded text-center focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-[#D1C7BB] text-[#101010] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#F2EDE4] transition-colors flex items-center justify-center gap-2"
        >
          Access Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};


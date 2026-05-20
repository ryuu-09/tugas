import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatRupiah, formatTime, generateVANumber } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/Toast';

interface PaymentVAProps {
  order: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

type BankType = 'bca' | 'mandiri' | 'bni' | 'bri' | 'dana';

const bankInfo: Record<BankType, { name: string; color: string; textColor: string }> = {
  bca: { name: 'BCA', color: 'bg-blue-600', textColor: 'text-white' },
  mandiri: { name: 'Mandiri', color: 'bg-yellow-500', textColor: 'text-gray-800' },
  bni: { name: 'BNI', color: 'bg-orange-600', textColor: 'text-white' },
  bri: { name: 'BRI', color: 'bg-blue-800', textColor: 'text-white' },
  dana: { name: 'DANA', color: 'bg-blue-400', textColor: 'text-white' },
};

export const PaymentVA = ({ order, onSuccess, onCancel }: PaymentVAProps) => {
  const [selectedBank, setSelectedBank] = useState<BankType>('bca');
  const [vaNumber, setVaNumber] = useState(generateVANumber());
  const [timeLeft, setTimeLeft] = useState(86400000); // 24 hours
  const [status, setStatus] = useState<'waiting' | 'verified'>('waiting');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Auto-verify after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('verified');
      setTimeout(() => onSuccess(), 1000);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s/g, ''));
    showToast('Nomor VA disalin!', 'success');
  };

  const banks: BankType[] = ['bca', 'mandiri', 'bni', 'bri', 'dana'];

  const instructions: Record<string, string[]> = {
    mobile: [
      '1. Buka aplikasi mobile banking Anda',
      '2. Pilih menu Transfer atau Pembayaran',
      '3. Masukkan nomor VA dan jumlah sesuai',
    ],
    internet: [
      '1. Login ke internet banking',
      '2. Pilih Transfer Antar Bank',
      '3. Masukkan nomor VA dan konfirmasi',
    ],
    atm: [
      '1. Masukkan kartu ATM Anda',
      '2. Pilih Transfer dan Antar Bank',
      '3. Masukkan nomor VA dan jumlah',
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-2xl w-full my-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🏦 Virtual Account</h2>

        {/* Bank Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {banks.map(bank => (
            <button
              key={bank}
              onClick={() => {
                setSelectedBank(bank);
                setVaNumber(generateVANumber());
              }}
              className={`
                px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all duration-250
                ${
                  selectedBank === bank
                    ? `${bankInfo[bank].color} ${bankInfo[bank].textColor} shadow-lg`
                    : 'bg-white/50 text-gray-700 hover:bg-white/75'
                }
              `}
            >
              {bankInfo[bank].name}
            </button>
          ))}
        </div>

        {/* Bank Header */}
        <div className={`${bankInfo[selectedBank].color} ${bankInfo[selectedBank].textColor} p-6 rounded-lg mb-6`}>
          <p className="text-sm opacity-90 mb-1">Bank</p>
          <p className="text-2xl font-bold">{bankInfo[selectedBank].name}</p>
        </div>

        {/* VA Number */}
        <div className="bg-white/50 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">Nomor Virtual Account</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-gray-800 font-mono">{vaNumber}</p>
            <Button
              onClick={handleCopyVA}
              size="sm"
              className="bg-pink text-white"
            >
              📋 Salin
            </Button>
          </div>
        </div>

        {/* Amount & Timer */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Jumlah</p>
            <p className="font-bold text-pink">{formatRupiah(order.total)}</p>
          </div>
          <div className="bg-white/50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Waktu Tersisa</p>
            <p className="font-bold text-purple">{formatTime(timeLeft)}</p>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          {status === 'waiting' && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="text-gray-700 font-semibold">⏳ Menunggu Verifikasi...</p>
            </div>
          )}
          {status === 'verified' && (
            <div className="flex items-center justify-center gap-2">
              <p className="text-green-600 font-bold text-lg">✅ Pembayaran Terverifikasi!</p>
            </div>
          )}
        </div>

        {/* Instructions Accordion */}
        <div className="space-y-2 mb-6">
          {[
            { key: 'mobile', label: '📱 Mobile Banking', steps: instructions.mobile },
            { key: 'internet', label: '💻 Internet Banking', steps: instructions.internet },
            { key: 'atm', label: '🏧 ATM', steps: instructions.atm },
          ].map(item => (
            <div key={item.key} className="border border-pink/25 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedStep(expandedStep === item.key ? null : item.key)}
                className="w-full px-4 py-3 bg-white/50 hover:bg-white/75 font-semibold text-left flex items-center justify-between"
              >
                {item.label}
                <span className={`transition-transform ${expandedStep === item.key ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedStep === item.key && (
                <div className="px-4 py-3 bg-white/30 space-y-2">
                  {item.steps.map((step, i) => (
                    <p key={i} className="text-sm text-gray-700">{step}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={status === 'verified'}
          >
            ❌ Batal
          </Button>
          <Button
            disabled
            className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
          >
            ⏳ Menunggu Pembayaran...
          </Button>
        </div>
      </div>
    </div>
  );
};

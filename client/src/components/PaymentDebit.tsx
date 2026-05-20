import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatRupiah } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentDebitProps {
  order: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentDebit = ({ order, onSuccess, onCancel }: PaymentDebitProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [status, setStatus] = useState<'input' | 'processing' | 'success'>('input');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('success');
            setTimeout(() => onSuccess(), 1500);
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [status, onSuccess]);

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(cleaned);
  };

  const handleExpiryMonthChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 2);
    setExpiryMonth(cleaned);
  };

  const handleExpiryYearChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 2);
    setExpiryYear(cleaned);
  };

  const handleCVVChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 3);
    setCvv(cleaned);
  };

  const isFormValid =
    cardNumber.length === 16 &&
    cardName.trim() &&
    expiryMonth &&
    expiryYear &&
    cvv.length === 3;

  const handleProcess = () => {
    if (isFormValid) {
      setStatus('processing');
    }
  };

  const formattedCardNumber = cardNumber
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[130] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-md w-full my-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">💳 Kartu Debit</h2>

        {status === 'input' && (
          <>
            {/* Card Illustration */}
            <div className="bg-gradient-to-br from-purple to-pink p-8 rounded-lg mb-6 text-white">
              <div className="mb-8">
                <p className="text-xs opacity-75 mb-4">CARD NUMBER</p>
                <p className="text-xl font-mono tracking-widest">
                  {formattedCardNumber || '•••• •••• •••• ••••'}
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-75 mb-1">CARDHOLDER</p>
                  <p className="font-semibold">{cardName.toUpperCase() || 'YOUR NAME'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">VALID THRU</p>
                  <p className="font-mono">
                    {expiryMonth || 'MM'}/{expiryYear || 'YY'}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-white/50 p-4 rounded-lg mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-pink">{formatRupiah(order.total)}</p>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold mb-1">Nomor Kartu</label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={formattedCardNumber}
                onChange={e => handleCardNumberChange(e.target.value)}
                className="w-full font-mono"
                aria-label="Nomor kartu debit"
              />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Nama Pemegang</label>
                <Input
                  placeholder="NAMA LENGKAP"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="w-full uppercase"
                  aria-label="Nama pemegang kartu"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Bulan</label>
                  <Input
                    placeholder="MM"
                    value={expiryMonth}
                    onChange={e => handleExpiryMonthChange(e.target.value)}
                    className="w-full text-center"
                    aria-label="Bulan kadaluarsa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Tahun</label>
                  <Input
                    placeholder="YY"
                    value={expiryYear}
                    onChange={e => handleExpiryYearChange(e.target.value)}
                    className="w-full text-center"
                    aria-label="Tahun kadaluarsa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">CVV</label>
                  <Input
                    placeholder="•••"
                    type="password"
                    value={cvv}
                    onChange={e => handleCVVChange(e.target.value)}
                    className="w-full text-center"
                    aria-label="Kode CVV"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                ❌ Batal
              </Button>
              <Button
                onClick={handleProcess}
                disabled={!isFormValid}
                className={`flex-1 text-white font-bold ${
                  isFormValid
                    ? 'gradient-button'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                💳 Proses
              </Button>
            </div>
          </>
        )}

        {status === 'processing' && (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue to-purple rounded-full flex items-center justify-center animate-spin">
                <div className="w-12 h-12 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-800 mb-4">🔄 Memproses...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue to-purple h-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <p className="text-xl font-bold text-green-600">Pembayaran Berhasil!</p>
            <p className="text-sm text-gray-600 mt-2">{formatRupiah(order.total)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

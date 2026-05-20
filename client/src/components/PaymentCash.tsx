import { useState } from 'react';
import { Order } from '@/types';
import { formatRupiah } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentCashProps {
  order: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentCash = ({ order, onSuccess, onCancel }: PaymentCashProps) => {
  const [cashReceived, setCashReceived] = useState(0);

  const quickAmounts = [5000, 10000, 20000, 50000, 100000, 50000, 100000, 200000];

  const handleQuickAmount = (amount: number) => {
    setCashReceived(prev => prev + amount);
  };

  const handleReset = () => {
    setCashReceived(0);
  };

  const difference = cashReceived - order.total;
  const isExact = difference === 0;
  const isInsufficient = difference < 0;
  const isExcess = difference > 0;

  const handleConfirm = () => {
    if (cashReceived >= order.total) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-md w-full my-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">💵 Pembayaran Cash</h2>

        {/* Total Tagihan */}
        <div className="bg-gradient-to-r from-pink/20 to-purple/20 p-6 rounded-lg mb-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Total Tagihan</p>
          <p className="text-4xl font-bold text-pink">{formatRupiah(order.total)}</p>
        </div>

        {/* Cash Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Uang Diterima</label>
          <Input
            type="number"
            value={cashReceived}
            onChange={e => setCashReceived(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="0"
            className="w-full text-2xl text-center font-bold"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickAmounts.map((amount, i) => (
            <button
              key={i}
              onClick={() => handleQuickAmount(amount)}
              className="bg-white/50 hover:bg-white/75 px-2 py-2 rounded-lg font-bold text-xs transition-all duration-250"
            >
              +{formatRupiah(amount)}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <div className="mb-6">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            🔄 Reset
          </Button>
        </div>

        {/* Change Calculation */}
        <div className="mb-6">
          {isInsufficient && (
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <p className="text-red-700 font-bold text-lg">
                Kurang: {formatRupiah(Math.abs(difference))}
              </p>
            </div>
          )}
          {isExact && (
            <div className="bg-mint/20 p-4 rounded-lg text-center animate-pulse">
              <p className="text-mint font-bold text-lg">✨ Uang Pas!</p>
            </div>
          )}
          {isExcess && (
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="text-gray-700 font-semibold mb-1">Kembalian</p>
              <p className="text-green-600 font-bold text-3xl">
                {formatRupiah(difference)}
              </p>
            </div>
          )}
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
            onClick={handleConfirm}
            disabled={isInsufficient}
            className={`flex-1 text-white font-bold ${
              isInsufficient
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-green-500 hover:shadow-lg'
            }`}
          >
            ✅ Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  );
};

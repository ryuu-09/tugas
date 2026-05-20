import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatRupiah } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { PaymentQRIS } from '@/components/PaymentQRIS';
import { PaymentVA } from '@/components/PaymentVA';
import { PaymentCash } from '@/components/PaymentCash';
import { PaymentDebit } from '@/components/PaymentDebit';

interface PaymentScreenProps {
  order: Order;
  onPaymentSuccess: (method: string) => void;
  onCancel: () => void;
}

export const PaymentScreen = ({ order, onPaymentSuccess, onCancel }: PaymentScreenProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'qris', label: '📱 QRIS', icon: '📱' },
    { id: 'va', label: '🏦 Virtual Account', icon: '🏦' },
    { id: 'cash', label: '💵 Cash', icon: '💵' },
    { id: 'debit', label: '💳 Kartu Debit', icon: '💳' },
  ];

  if (selectedMethod === 'qris') {
    return (
      <PaymentQRIS
        order={order}
        onSuccess={() => onPaymentSuccess('qris')}
        onCancel={() => setSelectedMethod(null)}
      />
    );
  }

  if (selectedMethod === 'va') {
    return (
      <PaymentVA
        order={order}
        onSuccess={() => onPaymentSuccess('va')}
        onCancel={() => setSelectedMethod(null)}
      />
    );
  }

  if (selectedMethod === 'cash') {
    return (
      <PaymentCash
        order={order}
        onSuccess={() => onPaymentSuccess('cash')}
        onCancel={() => setSelectedMethod(null)}
      />
    );
  }

  if (selectedMethod === 'debit') {
    return (
      <PaymentDebit
        order={order}
        onSuccess={() => onPaymentSuccess('debit')}
        onCancel={() => setSelectedMethod(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-2xl w-full my-auto">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Pilih Metode Pembayaran</h2>
        <p className="text-center text-2xl font-bold text-pink mb-8">
          {formatRupiah(order.total)}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className="glass-card p-6 rounded-[20px] hover:shadow-xl transition-all duration-250 transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-3 text-center">{method.icon}</div>
              <p className="font-bold text-center text-gray-800">{method.label}</p>
            </button>
          ))}
        </div>

        <Button onClick={onCancel} variant="outline" className="w-full">
          Batal
        </Button>
      </div>
    </div>
  );
};

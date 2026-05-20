import { Order } from '@/types';
import { formatRupiah } from '@/utils/formatting';
import { Button } from '@/components/ui/button';

interface ReceiptProps {
  order: Order;
  onClose: () => void;
  onPrint?: () => void;
}

export const Receipt = ({ order, onClose, onPrint }: ReceiptProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[140] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-md w-full my-auto">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-green-600">Pembayaran Berhasil!</h2>
        </div>

        {/* Receipt Content */}
        <div className="bg-white/50 p-6 rounded-lg mb-6 font-mono text-sm space-y-3">
          {/* Header */}
          <div className="text-center border-b border-gray-300 pb-3">
            <p className="font-bold text-lg">Dreamy Scoops</p>
            <p className="text-xs text-gray-600">Ice Cream & Fruity Bar</p>
          </div>

          {/* Order Info */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>No. Pesanan:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipe:</span>
              <span>
                {order.orderType === 'takeaway' && '🛍️ Takeaway'}
                {order.orderType === 'dine-in' && '🪑 Dine In'}
                {order.orderType === 'vip' && '👑 VIP'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Metode:</span>
              <span>
                {order.paymentMethod === 'qris' && '📱 QRIS'}
                {order.paymentMethod === 'va' && '🏦 VA'}
                {order.paymentMethod === 'cash' && '💵 Cash'}
                {order.paymentMethod === 'debit' && '💳 Debit'}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-b border-gray-300 py-3 space-y-1 text-xs">
            {order.items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>{formatRupiah(item.menuItem.price * item.quantity)}</span>
                </div>
                {item.toppings.length > 0 && (
                  <div className="text-gray-600 ml-2">
                    + {item.toppings.map(t => t.name).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            {order.vipSurcharge > 0 && (
              <div className="flex justify-between text-yellow-600">
                <span>VIP Surcharge:</span>
                <span>+{formatRupiah(order.vipSurcharge)}</span>
              </div>
            )}
            {order.promoDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Promo Diskon:</span>
                <span>-{formatRupiah(order.promoDiscount)}</span>
              </div>
            )}
            {order.pointsDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Poin Diskon:</span>
                <span>-{formatRupiah(order.pointsDiscount)}</span>
              </div>
            )}
            {order.ppnAmount > 0 && (
              <div className="flex justify-between">
                <span>PPN 11%:</span>
                <span>{formatRupiah(order.ppnAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2">
              <span>TOTAL:</span>
              <span className="text-pink">{formatRupiah(order.total)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-gray-300 pt-3 text-xs text-gray-600">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Semoga menikmati ☁️</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {onPrint && (
            <Button
              onClick={onPrint}
              variant="outline"
              className="flex-1"
            >
              🖨️ Cetak
            </Button>
          )}
          <Button
            onClick={onClose}
            className="flex-1 gradient-button text-white"
          >
            ✅ Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};

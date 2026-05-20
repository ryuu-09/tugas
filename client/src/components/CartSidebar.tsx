import { useState } from 'react';
import { CartItem, Order } from '@/types';
import { formatRupiah, applyPromoCode } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/Toast';

interface CartSidebarProps {
  order: Order | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyPromo: (code: string) => void;
  onRedeemPoints: (amount: number) => void;
  onCheckout: () => void;
  loyaltyPhone?: string;
  loyaltyPoints?: number;
}

export const CartSidebar = ({
  order,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
  onRedeemPoints,
  onCheckout,
  loyaltyPhone,
  loyaltyPoints = 0,
}: CartSidebarProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  if (!order) return null;

  const isEmpty = order.items.length === 0;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      onApplyPromo(promoCode);
      setPromoCode('');
    }
  };

  const handleRedeemPoints = () => {
    if (pointsToRedeem > 0 && pointsToRedeem <= loyaltyPoints) {
      onRedeemPoints(pointsToRedeem);
      setPointsToRedeem(0);
      showToast('Poin berhasil ditukar!', 'success');
    }
  };

  const maxPointsRedeemable = Math.floor(order.subtotal * 0.5 / 1000);

  return (
    <div className="w-full md:w-[370px] glass-card p-4 md:p-6 rounded-[24px] h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-pink/25">
        <h2 className="text-xl font-bold text-gray-800 mb-2">🛒 Keranjang</h2>
        {order.orderType && (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-pink/20 text-pink px-2 py-1 rounded-full font-semibold">
              {order.orderType === 'takeaway' && '🛍️ Takeaway'}
              {order.orderType === 'dine-in' && '🪑 Dine In'}
              {order.orderType === 'vip' && '👑 VIP'}
            </span>
            {order.customerName && (
              <span className="text-xs text-gray-600">{order.customerName}</span>
            )}
          </div>
        )}
      </div>

      {/* Items or Empty State */}
      <div className="flex-1 overflow-y-auto mb-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-3">🍭</div>
            <p className="text-gray-600">Keranjang masih kosong ✨</p>
          </div>
        ) : (
          <div className="space-y-4">
            {order.items.map(item => (
              <div
                key={item.id}
                className="bg-white/50 p-4 rounded-lg border border-pink/25"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.menuItem.emoji}</span>
                      <span className="font-bold text-purple">{item.menuItem.name}</span>
                    </div>
                    {item.toppings.length > 0 && (
                      <p className="text-xs text-pink mt-1">
                        Toppings: {item.toppings.map(t => t.name).join(', ')}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-gray-500 italic mt-1">"{item.notes}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-white/75 hover:bg-white rounded font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-white/75 hover:bg-white rounded font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-gray-800">
                    {formatRupiah(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Section */}
      {!isEmpty && (
        <div className="mb-6 pb-6 border-b border-pink/25">
          <label className="block text-xs font-semibold mb-2">Kode Promo</label>
          <div className="flex gap-2">
            <Input
              placeholder="DREAMY10"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleApplyPromo}
              size="sm"
              className="bg-pink text-white"
            >
              Terapkan
            </Button>
          </div>
          {order.promoCode && (
            <p className="text-xs text-green-600 mt-2">✓ Kode {order.promoCode} diterapkan</p>
          )}
        </div>
      )}

      {/* Loyalty Section */}
      {!isEmpty && loyaltyPhone && (
        <div className="mb-6 pb-6 border-b border-pink/25">
          <div className="bg-yellow/10 p-3 rounded-lg mb-3">
            <p className="text-xs text-gray-700">
              <strong>⭐ {loyaltyPoints} Dreamypoints</strong> tersedia
            </p>
          </div>
          <label className="block text-xs font-semibold mb-2">Tukar Poin untuk Diskon</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Jumlah poin"
              value={pointsToRedeem}
              onChange={e => setPointsToRedeem(Math.min(loyaltyPoints, parseInt(e.target.value) || 0))}
              max={Math.min(loyaltyPoints, maxPointsRedeemable)}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleRedeemPoints}
              disabled={pointsToRedeem === 0}
              size="sm"
              className="bg-yellow text-gray-800"
            >
              Tukar
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">100 poin = Rp 1.000 (max 50% total)</p>
        </div>
      )}

      {/* Summary */}
      {!isEmpty && (
        <div className="space-y-2 mb-6 pb-6 border-b border-pink/25">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-bold">{formatRupiah(order.subtotal)}</span>
          </div>
          {order.vipSurcharge > 0 && (
            <div className="flex justify-between text-sm">
              <span>VIP Surcharge</span>
              <span className="font-bold text-yellow">+{formatRupiah(order.vipSurcharge)}</span>
            </div>
          )}
          {order.promoDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Promo Diskon</span>
              <span className="font-bold text-green-600">-{formatRupiah(order.promoDiscount)}</span>
            </div>
          )}
          {order.pointsDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Poin Diskon</span>
              <span className="font-bold text-green-600">-{formatRupiah(order.pointsDiscount)}</span>
            </div>
          )}
          {order.ppnAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>PPN 11%</span>
              <span className="font-bold">{formatRupiah(order.ppnAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-pink pt-2">
            <span>TOTAL</span>
            <span>{formatRupiah(order.total)}</span>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        disabled={isEmpty}
        className={`w-full py-3 font-bold text-white rounded-full ${
          isEmpty
            ? 'bg-gray-300 cursor-not-allowed'
            : 'gradient-button'
        }`}
      >
        💳 Pilih Pembayaran
      </Button>
    </div>
  );
};

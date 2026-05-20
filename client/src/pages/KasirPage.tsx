import { useState, useEffect } from 'react';
import { Order, CartItem, MenuItem, Table, VIPRoom } from '@/types';
import { OrderTypeSelect } from '@/components/OrderTypeSelect';
import { MenuPanel } from '@/components/MenuPanel';
import { CartSidebar } from '@/components/CartSidebar';
import { ToppingModal } from '@/components/ToppingModal';
import { formatRupiah, applyPromoCode } from '@/utils/formatting';
import { showToast } from '@/components/Toast';
import { vipRoomDefaults } from '@/data/menuData';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface KasirPageProps {
  currentOrder: Order | null;
  onCreateOrder: (orderType: string, customerName: string, customerPhone?: string) => void;
  onSelectTable: (tableId: string, guests: number, customerName: string) => void;
  onSelectVIPRoom: (roomId: string, guests: number, customerName: string) => void;
  onAddToCart: (item: CartItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onUpdateOrder: (updates: Partial<Order>) => void;
  loyaltyProfiles: Record<string, any>;
  settings: any;
}

export const KasirPage = ({
  currentOrder,
  onCreateOrder,
  onSelectTable,
  onSelectVIPRoom,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onUpdateOrder,
  loyaltyProfiles,
  settings,
}: KasirPageProps) => {
  const [showOrderTypeSelect, setShowOrderTypeSelect] = useState(!currentOrder);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [tables, setTables] = useState<Table[]>([]);
  const [vipRooms, setVipRooms] = useState<VIPRoom[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize tables and VIP rooms
  useEffect(() => {
    const newTables: Table[] = Array.from({ length: settings.regularTableCount }, (_, i) => ({
      id: `table-${i}`,
      number: i + 1,
      status: 'available',
    }));
    setTables(newTables);

    const newVipRooms: VIPRoom[] = settings.vipRoomNames.map((name: string, i: number) => ({
      id: `vip-${i}`,
      name: name,
      emoji: vipRoomDefaults[i]?.emoji || '🌸',
      capacity: vipRoomDefaults[i]?.capacity || { min: 2, max: 6 },
      status: 'available',
      amenities: ['✓ AC Pribadi', '✓ Sofa Premium', '✓ Prioritas Pesanan', '✓ Layanan Eksklusif'],
    }));
    setVipRooms(newVipRooms);
  }, [settings]);

  const handleCreateOrder = (customerName: string, phone?: string) => {
    const orderType = 'takeaway';
    onCreateOrder(orderType, customerName, phone);
    setShowOrderTypeSelect(false);
    setCustomerName(customerName);
  };

  const handleSelectTable = (tableId: string, guests: number, customerName: string) => {
    onSelectTable(tableId, guests, customerName);
    setShowOrderTypeSelect(false);
    setCustomerName(customerName);
    // Mark table as occupied
    setTables(prev =>
      prev.map(t =>
        t.id === tableId
          ? { ...t, status: 'occupied', customerName: customerName, occupiedSince: Date.now(), guests }
          : t
      )
    );
  };

  const handleSelectVIPRoom = (roomId: string, guests: number, customerName: string) => {
    onSelectVIPRoom(roomId, guests, customerName);
    setShowOrderTypeSelect(false);
    setCustomerName(customerName);
    // Mark VIP room as occupied
    setVipRooms(prev =>
      prev.map(r =>
        r.id === roomId
          ? { ...r, status: 'occupied', customerName: customerName, occupiedSince: Date.now(), guests }
          : r
      )
    );
  };

  const handleMenuItemSelect = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setShowToppingModal(true);
  };

  const handleToppingConfirm = (toppings: any, iceLevel: any, sweetnessLevel: any, allergens: any, notes: string) => {
    if (!currentOrder || !selectedMenuItem) return;

    const cartItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      menuItem: selectedMenuItem,
      quantity: 1,
      toppings,
      iceLevel,
      sweetnessLevel,
      allergens,
      notes,
    };

    onAddToCart(cartItem);
    setShowToppingModal(false);
    setSelectedMenuItem(null);
    showToast('Item ditambahkan ke keranjang!', 'success');

    // Recalculate order totals
    if (currentOrder) {
      const newItems = [...currentOrder.items, cartItem];
      const subtotal = newItems.reduce(
        (sum, item) =>
          sum + (item.menuItem.price + item.toppings.reduce((s, t) => s + t.price, 0)) * item.quantity,
        0
      );

      const vipSurcharge = currentOrder.orderType === 'vip' ? settings.vipSurcharge : 0;
      const ppnAmount = settings.ppnEnabled ? Math.floor(subtotal * (settings.ppnPercentage / 100)) : 0;
      const total = subtotal + vipSurcharge + ppnAmount - currentOrder.promoDiscount - currentOrder.pointsDiscount;

      onUpdateOrder({
        items: newItems,
        subtotal,
        vipSurcharge,
        ppnAmount,
        total,
      });
    }
  };

  const handleApplyPromo = (code: string) => {
    if (!currentOrder) return;

    const { discount } = applyPromoCode(currentOrder.subtotal, code, currentOrder.items);

    if (discount > 0) {
      const newTotal = currentOrder.subtotal + currentOrder.vipSurcharge + currentOrder.ppnAmount - discount - currentOrder.pointsDiscount;
      onUpdateOrder({
        promoCode: code,
        promoDiscount: discount,
        total: newTotal,
      });
      showToast(`Kode promo ${code} diterapkan!`, 'success');
    } else {
      showToast('Kode promo tidak valid', 'error');
    }
  };

  const handleRedeemPoints = (points: number) => {
    if (!currentOrder) return;

    const pointsDiscount = Math.floor(points * 10); // 100 points = Rp 1.000
    const newTotal = currentOrder.subtotal + currentOrder.vipSurcharge + currentOrder.ppnAmount - currentOrder.promoDiscount - pointsDiscount;

    const updatedOrder = {
      pointsRedeemed: points,
      pointsDiscount,
      total: newTotal,
    };

    onUpdateOrder(updatedOrder);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      onRemoveItem(itemId);
      return;
    }

    onUpdateQuantity(itemId, quantity);

    if (currentOrder) {
      const newItems = currentOrder.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );

      const subtotal = newItems.reduce(
        (sum, item) =>
          sum + (item.menuItem.price + item.toppings.reduce((s, t) => s + t.price, 0)) * item.quantity,
        0
      );

      const vipSurcharge = currentOrder.orderType === 'vip' ? settings.vipSurcharge : 0;
      const ppnAmount = settings.ppnEnabled ? Math.floor(subtotal * (settings.ppnPercentage / 100)) : 0;
      const total = subtotal + vipSurcharge + ppnAmount - currentOrder.promoDiscount - currentOrder.pointsDiscount;

      onUpdateOrder({
        items: newItems,
        subtotal,
        vipSurcharge,
        ppnAmount,
        total,
      });
    }
  };

  if (showOrderTypeSelect) {
    return (
      <OrderTypeSelect
        tables={tables}
        vipRooms={vipRooms}
        onSelectTakeaway={handleCreateOrder}
        onSelectDineIn={handleSelectTable}
        onSelectVIP={handleSelectVIPRoom}
        onCancel={() => {}}
      />
    );
  }

  const cartContent = currentOrder && (
    <CartSidebar
      order={currentOrder}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={onRemoveItem}
      onApplyPromo={handleApplyPromo}
      onRedeemPoints={handleRedeemPoints}
      onCheckout={onCheckout}
      loyaltyPhone={currentOrder.loyaltyPhone || ''}
      loyaltyPoints={currentOrder.loyaltyPhone && loyaltyProfiles[currentOrder.loyaltyPhone] ? loyaltyProfiles[currentOrder.loyaltyPhone].points : 0}
    />
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      {/* Mobile Header with Cart Trigger */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-sm border-b border-white/20">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowOrderTypeSelect(true)}
          className="text-gray-600"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Ganti Tipe
        </Button>
        
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button className="gradient-button text-white rounded-full px-5 relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Keranjang
              {currentOrder && currentOrder.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {currentOrder.items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-full sm:max-w-md border-none">
            <div className="h-full bg-gradient-to-b from-pink-50 to-purple-50">
              {cartContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 overflow-hidden p-4 lg:p-6 gap-6">
        {/* Main Menu Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {currentOrder ? (
            <MenuPanel
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              onMenuItemSelect={handleMenuItemSelect}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">Pilih tipe pesanan untuk memulai</p>
            </div>
          )}
        </div>

        {/* Desktop Cart Sidebar */}
        <div className="hidden lg:block w-[400px] flex-shrink-0">
          {cartContent}
        </div>
      </div>

      {/* Topping Modal */}
      {showToppingModal && selectedMenuItem && (
        <ToppingModal
          item={selectedMenuItem}
          onConfirm={handleToppingConfirm}
          onCancel={() => {
            setShowToppingModal(false);
            setSelectedMenuItem(null);
          }}
        />
      )}
    </div>
  );
};

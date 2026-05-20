import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Header } from '@/components/Header';
import { CloudBackground } from '@/components/CloudBackground';
import { Toast } from '@/components/Toast';
import { KasirPage } from '@/pages/KasirPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { KitchenPage } from '@/pages/KitchenPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PaymentScreen } from '@/components/PaymentScreen';
import { Receipt } from '@/components/Receipt';
import { useOrders } from '@/hooks/useOrders';
import { CartItem, Order } from '@/types';

function App() {
  const [currentTab, setCurrentTab] = useState('kasir');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const {
    orders,
    completedOrders,
    settings,
    loyaltyProfiles,
    createOrder,
    updateOrder,
    completeOrder,
    cancelOrder,
    updateSettings,
    getLoyaltyProfile,
    updateLoyaltyProfile,
  } = useOrders();

  // Handle order creation
  const handleCreateOrder = (orderType: string, customerName: string, customerPhone?: string) => {
    const newOrder = createOrder(orderType, customerName, customerPhone);
    setCurrentOrder(newOrder);
  };

  // Handle table selection
  const handleSelectTable = (tableId: string, guests: number, customerName: string) => {
    const newOrder = createOrder('dine-in', customerName);
    updateOrder(newOrder.id, {
      tableId,
      guests,
    });
    setCurrentOrder({ ...newOrder, tableId, guests });
  };

  // Handle VIP room selection
  const handleSelectVIPRoom = (roomId: string, guests: number, customerName: string) => {
    const newOrder = createOrder('vip', customerName);
    updateOrder(newOrder.id, {
      vipRoomId: roomId,
      guests,
      vipSurcharge: settings.vipSurcharge,
    });
    setCurrentOrder({ ...newOrder, vipRoomId: roomId, guests, vipSurcharge: settings.vipSurcharge });
  };

  // Handle add to cart
  const handleAddToCart = (item: CartItem) => {
    if (!currentOrder) return;

    const newItems = [...currentOrder.items, item];
    const subtotal = newItems.reduce(
      (sum, i) =>
        sum + (i.menuItem.price + i.toppings.reduce((s, t) => s + t.price, 0)) * i.quantity,
      0
    );

    const vipSurcharge = currentOrder.orderType === 'vip' ? settings.vipSurcharge : 0;
    const ppnAmount = settings.ppnEnabled ? Math.floor(subtotal * (settings.ppnPercentage / 100)) : 0;
    const total = subtotal + vipSurcharge + ppnAmount - currentOrder.promoDiscount - currentOrder.pointsDiscount;

    const updatedOrder = {
      ...currentOrder,
      items: newItems,
      subtotal,
      vipSurcharge,
      ppnAmount,
      total,
    };

    setCurrentOrder(updatedOrder);
    updateOrder(currentOrder.id, updatedOrder);
  };

  // Handle update quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (!currentOrder) return;

    const newItems = currentOrder.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    const subtotal = newItems.reduce(
      (sum, i) =>
        sum + (i.menuItem.price + i.toppings.reduce((s, t) => s + t.price, 0)) * i.quantity,
      0
    );

    const vipSurcharge = currentOrder.orderType === 'vip' ? settings.vipSurcharge : 0;
    const ppnAmount = settings.ppnEnabled ? Math.floor(subtotal * (settings.ppnPercentage / 100)) : 0;
    const total = subtotal + vipSurcharge + ppnAmount - currentOrder.promoDiscount - currentOrder.pointsDiscount;

    const updatedOrder = {
      ...currentOrder,
      items: newItems,
      subtotal,
      vipSurcharge,
      ppnAmount,
      total,
    };

    setCurrentOrder(updatedOrder);
    updateOrder(currentOrder.id, updatedOrder);
  };

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    if (!currentOrder) return;

    const newItems = currentOrder.items.filter(item => item.id !== itemId);
    const subtotal = newItems.reduce(
      (sum, i) =>
        sum + (i.menuItem.price + i.toppings.reduce((s, t) => s + t.price, 0)) * i.quantity,
      0
    );

    const vipSurcharge = currentOrder.orderType === 'vip' ? settings.vipSurcharge : 0;
    const ppnAmount = settings.ppnEnabled ? Math.floor(subtotal * (settings.ppnPercentage / 100)) : 0;
    const total = subtotal + vipSurcharge + ppnAmount - currentOrder.promoDiscount - currentOrder.pointsDiscount;

    const updatedOrder = {
      ...currentOrder,
      items: newItems,
      subtotal,
      vipSurcharge,
      ppnAmount,
      total,
    };

    setCurrentOrder(updatedOrder);
    updateOrder(currentOrder.id, updatedOrder);
  };

  // Handle checkout
  const handleCheckout = () => {
    setShowPayment(true);
  };

  // Handle payment success
  const handlePaymentSuccess = (method: string) => {
    if (!currentOrder) return;

    setShowPayment(false);
    setShowReceipt(true);

    const completedOrder = {
      ...currentOrder,
      paymentMethod: method as any,
      status: 'completed' as const,
      completedAt: Date.now(),
    };

    setLastCompletedOrder(completedOrder);
    completeOrder(currentOrder.id, method);
  };

  // Handle receipt close
  const handleReceiptClose = () => {
    setShowReceipt(false);
    setCurrentOrder(null);
    setCurrentTab('kasir');
  };

  // Handle mark ready (kitchen)
  const handleMarkReady = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const completedOrder = {
        ...order,
        status: 'completed' as const,
        completedAt: Date.now(),
        paymentMethod: 'cash' as const,
      };
      completeOrder(orderId, 'cash');
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Toast />
          <CloudBackground enabled={settings.cloudAnimations} />

          <div className="min-h-screen bg-gradient-to-br from-pink/5 via-purple/5 to-mint/5">
            <Header
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              currentOrderNumber={currentOrder?.orderNumber}
            />

            <main className="min-h-[calc(100vh-200px)]">
              {currentTab === 'kasir' && (
                <KasirPage
                  currentOrder={currentOrder}
                  onCreateOrder={handleCreateOrder}
                  onSelectTable={handleSelectTable}
                  onSelectVIPRoom={handleSelectVIPRoom}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                  onUpdateOrder={(updates) => updateOrder(currentOrder?.id || '', updates)}
                  loyaltyProfiles={loyaltyProfiles}
                  settings={settings}
                />
              )}

              {currentTab === 'dashboard' && (
                <DashboardPage completedOrders={completedOrders} />
              )}

              {currentTab === 'kitchen' && (
                <KitchenPage
                  orders={orders}
                  completedOrders={completedOrders}
                  onMarkReady={handleMarkReady}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsPage
                  settings={settings}
                  onUpdateSettings={updateSettings}
                />
              )}
            </main>

            {/* Payment Screen */}
            {showPayment && currentOrder && (
              <PaymentScreen
                order={currentOrder}
                onPaymentSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
              />
            )}

            {/* Receipt */}
            {showReceipt && lastCompletedOrder && (
              <Receipt
                order={lastCompletedOrder}
                onClose={handleReceiptClose}
              />
            )}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

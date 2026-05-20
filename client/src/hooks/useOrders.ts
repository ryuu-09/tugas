import { useState, useCallback, useEffect } from 'react';
import { Order, CartItem, Settings, CompletedOrder, LoyaltyProfile } from '@/types';
import { generateOrderNumber } from '@/utils/formatting';

const DEFAULT_SETTINGS: Settings = {
  storeName: 'Dreamy Scoops',
  storeTagline: 'Ice Cream & Fruity Bar ☁️',
  storeAddress: 'Jl. Impian No. 123',
  storePhone: '0812-3456-7890',
  cashierName: 'Staff 01',
  shift: 'siang',
  ppnEnabled: true,
  ppnPercentage: 11,
  vipSurcharge: 25000,
  loyaltyPointsEnabled: true,
  regularTableCount: 10,
  vipRoomNames: ['Sakura Room', 'Cloud Room', 'Galaxy Room', 'Cotton Room'],
  darkMode: false,
  cloudAnimations: true,
  receiptWidth: '58mm',
  showQRRating: true,
  autoPrint: false,
};

// Seed data for dashboard
const seedCompletedOrders: CompletedOrder[] = [
  {
    id: '1',
    orderNumber: 'T-001',
    orderType: 'takeaway',
    customerName: 'Budi',
    items: [],
    subtotal: 50000,
    vipSurcharge: 0,
    promoDiscount: 0,
    pointsRedeemed: 0,
    pointsDiscount: 0,
    ppnPercentage: 11,
    ppnAmount: 5500,
    total: 55500,
    status: 'completed',
    createdAt: Date.now() - 3600000,
    completedAt: Date.now() - 3500000,
    paymentMethod: 'cash',
  },
  {
    id: '2',
    orderNumber: 'D-001',
    orderType: 'dine-in',
    customerName: 'Siti',
    tableId: 'T01',
    guests: 2,
    items: [],
    subtotal: 75000,
    vipSurcharge: 0,
    promoDiscount: 0,
    pointsRedeemed: 0,
    pointsDiscount: 0,
    ppnPercentage: 11,
    ppnAmount: 8250,
    total: 83250,
    status: 'completed',
    createdAt: Date.now() - 7200000,
    completedAt: Date.now() - 7100000,
    paymentMethod: 'qris',
  },
  {
    id: '3',
    orderNumber: 'V-001',
    orderType: 'vip',
    customerName: 'Ahmad',
    vipRoomId: 'vip1',
    guests: 4,
    items: [],
    subtotal: 120000,
    vipSurcharge: 25000,
    promoDiscount: 0,
    pointsRedeemed: 0,
    pointsDiscount: 0,
    ppnPercentage: 11,
    ppnAmount: 15950,
    total: 160950,
    status: 'completed',
    createdAt: Date.now() - 10800000,
    completedAt: Date.now() - 10700000,
    paymentMethod: 'va',
  },
  {
    id: '4',
    orderNumber: 'T-002',
    orderType: 'takeaway',
    customerName: 'Rina',
    items: [],
    subtotal: 45000,
    vipSurcharge: 0,
    promoDiscount: 4500,
    pointsRedeemed: 0,
    pointsDiscount: 0,
    ppnPercentage: 11,
    ppnAmount: 4455,
    total: 44955,
    status: 'completed',
    createdAt: Date.now() - 14400000,
    completedAt: Date.now() - 14300000,
    paymentMethod: 'cash',
  },
  {
    id: '5',
    orderNumber: 'D-002',
    orderType: 'dine-in',
    customerName: 'Hendra',
    tableId: 'T05',
    guests: 3,
    items: [],
    subtotal: 95000,
    vipSurcharge: 0,
    promoDiscount: 0,
    pointsRedeemed: 5000,
    pointsDiscount: 5000,
    ppnPercentage: 11,
    ppnAmount: 9900,
    total: 94900,
    status: 'completed',
    createdAt: Date.now() - 18000000,
    completedAt: Date.now() - 17900000,
    paymentMethod: 'debit',
  },
];

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>(seedCompletedOrders);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loyaltyProfiles, setLoyaltyProfiles] = useState<Record<string, LoyaltyProfile>>({});
  const [currentOrderNumber, setCurrentOrderNumber] = useState(0);

  // Create new order
  const createOrder = useCallback(
    (orderType: string, customerName: string, customerPhone?: string) => {
      const orderNumber = generateOrderNumber(orderType, currentOrderNumber);
      setCurrentOrderNumber(prev => prev + 1);

      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber,
        orderType: orderType as any,
        customerName,
        customerPhone,
        items: [],
        subtotal: 0,
        vipSurcharge: 0,
        promoDiscount: 0,
        pointsRedeemed: 0,
        pointsDiscount: 0,
        ppnPercentage: settings.ppnPercentage,
        ppnAmount: 0,
        total: 0,
        status: 'pending',
        createdAt: Date.now(),
      };

      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    },
    [currentOrderNumber, settings.ppnPercentage]
  );

  // Update order
  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  }, []);

  // Complete order
  const completeOrder = useCallback((orderId: string, paymentMethod: string) => {
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order) {
        const completed: CompletedOrder = {
          ...order,
          paymentMethod: paymentMethod as any,
          status: 'completed',
          completedAt: Date.now(),
        };
        setCompletedOrders(prevCompleted => [...prevCompleted, completed]);
      }
      return prev.filter(o => o.id !== orderId);
    });
  }, []);

  // Cancel order
  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Get or create loyalty profile
  const getLoyaltyProfile = useCallback((phone: string): LoyaltyProfile => {
    if (!loyaltyProfiles[phone]) {
      const newProfile: LoyaltyProfile = {
        phone,
        points: 0,
        tier: 'dreamer',
        totalSpent: 0,
        ordersCount: 0,
      };
      setLoyaltyProfiles(prev => ({ ...prev, [phone]: newProfile }));
      return newProfile;
    }
    return loyaltyProfiles[phone];
  }, [loyaltyProfiles]);

  // Update loyalty profile
  const updateLoyaltyProfile = useCallback((phone: string, updates: Partial<LoyaltyProfile>) => {
    setLoyaltyProfiles(prev => ({
      ...prev,
      [phone]: { ...prev[phone], ...updates },
    }));
  }, []);

  return {
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
  };
};

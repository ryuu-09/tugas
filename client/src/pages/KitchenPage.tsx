import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatElapsedTime } from '@/utils/formatting';

interface KitchenPageProps {
  orders: Order[];
  completedOrders: any[];
  onMarkReady: (orderId: string) => void;
}

export const KitchenPage = ({ orders, completedOrders, onMarkReady }: KitchenPageProps) => {
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const times: Record<string, string> = {};
      orders.forEach(order => {
        times[order.id] = formatElapsedTime(order.createdAt);
      });
      setElapsedTimes(times);
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const readyOrders = completedOrders.filter((o: any) => o.status === 'completed').slice(-5);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-[20px]">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🍳 Pesanan Menunggu</h2>

            {pendingOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-2">✨</p>
                <p className="text-gray-600">Tidak ada pesanan yang menunggu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white/50 p-6 rounded-lg border-2 border-pink/50 hover:border-pink transition-all duration-250"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-pink">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {order.orderType === 'takeaway' && '🛍️ Takeaway'}
                          {order.orderType === 'dine-in' && `🪑 Meja ${order.tableId?.split('-')[1]}`}
                          {order.orderType === 'vip' && '👑 VIP'}
                        </p>
                        <p className="text-lg font-bold text-purple pulse-ready">
                          {elapsedTimes[order.id] || '0s'}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white/30 p-4 rounded-lg mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-start mb-2 last:mb-0">
                          <div>
                            <p className="font-bold text-gray-800">
                              {item.quantity}x {item.menuItem.emoji} {item.menuItem.name}
                            </p>
                            {item.toppings.length > 0 && (
                              <p className="text-xs text-pink">
                                + {item.toppings.map(t => t.name).join(', ')}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-xs text-gray-600 italic">"{item.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mark Ready Button */}
                    <button
                      onClick={() => onMarkReady(order.id)}
                      className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-250 hover:scale-105"
                    >
                      ✅ Pesanan Siap
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ready Orders */}
        <div>
          <div className="glass-card p-6 rounded-[20px] h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">✅ Siap Diambil</h2>

            {readyOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">📦</p>
                <p className="text-sm text-gray-600">Belum ada pesanan siap</p>
              </div>
            ) : (
              <div className="space-y-3">
                {readyOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-green-50 p-4 rounded-lg border-2 border-green-300 pulse-ready"
                  >
                    <p className="font-bold text-green-700 text-lg">{order.orderNumber}</p>
                    <p className="text-sm text-gray-700">{order.customerName}</p>
                    <p className="text-xs text-green-600 mt-2">
                      {order.orderType === 'takeaway' && '🛍️ Ambil di Kasir'}
                      {order.orderType === 'dine-in' && '🪑 Antar ke Meja'}
                      {order.orderType === 'vip' && '👑 Antar ke Ruangan'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Menunggu Diproses</p>
          <p className="text-4xl font-bold text-pink">{pendingOrders.length}</p>
        </div>

        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Siap Diambil</p>
          <p className="text-4xl font-bold text-green-500">{readyOrders.length}</p>
        </div>

        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Rata-rata Waktu</p>
          <p className="text-4xl font-bold text-purple">
            {pendingOrders.length > 0
              ? Math.round(
                  pendingOrders.reduce((sum, o) => sum + (Date.now() - o.createdAt), 0) /
                    pendingOrders.length /
                    1000
                )
              : 0}
            s
          </p>
        </div>
      </div>
    </div>
  );
};

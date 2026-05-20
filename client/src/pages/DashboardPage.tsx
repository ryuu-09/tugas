import { useMemo } from 'react';
import { CompletedOrder } from '@/types';
import { formatRupiah } from '@/utils/formatting';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardPageProps {
  completedOrders: CompletedOrder[];
}

export const DashboardPage = ({ completedOrders }: DashboardPageProps) => {
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = completedOrders.filter(
      o => new Date(o.completedAt || 0).toDateString() === today
    );

    const totalOrders = completedOrders.length;
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;
    const ordersToday = todayOrders.length;
    const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0);

    // Payment breakdown
    const paymentBreakdown: Record<string, number> = {};
    completedOrders.forEach(order => {
      const method = order.paymentMethod || 'unknown';
      paymentBreakdown[method] = (paymentBreakdown[method] || 0) + order.total;
    });

    // Order type breakdown
    const orderTypeBreakdown: Record<string, number> = {};
    completedOrders.forEach(order => {
      orderTypeBreakdown[order.orderType] = (orderTypeBreakdown[order.orderType] || 0) + order.total;
    });

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersToday,
      revenueToday,
      paymentBreakdown,
      orderTypeBreakdown,
    };
  }, [completedOrders]);

  // Hourly revenue chart data
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      const revenue = completedOrders
        .filter(o => {
          const date = new Date(o.completedAt || 0);
          return date.getHours() === hour;
        })
        .reduce((sum, o) => sum + o.total, 0);
      return {
        hour: `${String(hour).padStart(2, '0')}:00`,
        revenue,
      };
    });
  }, [completedOrders]);

  // Order type breakdown for pie chart
  const orderTypeData = useMemo(() => {
    return Object.entries(stats.orderTypeBreakdown).map(([type, value]) => ({
      name: type === 'takeaway' ? '🛍️ Takeaway' : type === 'dine-in' ? '🪑 Dine In' : '👑 VIP',
      value,
    }));
  }, [stats.orderTypeBreakdown]);

  // Payment method breakdown
  const paymentData = useMemo(() => {
    return Object.entries(stats.paymentBreakdown).map(([method, value]) => ({
      name: method === 'qris' ? '📱 QRIS' : method === 'va' ? '🏦 VA' : method === 'cash' ? '💵 Cash' : '💳 Debit',
      value,
    }));
  }, [stats.paymentBreakdown]);

  const colors = ['#f472b6', '#a78bfa', '#6ee7b7', '#93c5fd', '#fde68a'];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Total Pesanan</p>
          <p className="text-3xl font-bold text-pink">{stats.totalOrders}</p>
        </div>

        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Total Pendapatan</p>
          <p className="text-2xl font-bold text-purple">{formatRupiah(stats.totalRevenue)}</p>
        </div>

        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Rata-rata Pesanan</p>
          <p className="text-2xl font-bold text-mint">{formatRupiah(stats.averageOrderValue)}</p>
        </div>

        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Pesanan Hari Ini</p>
          <p className="text-3xl font-bold text-blue">{stats.ordersToday}</p>
        </div>

        <div className="glass-card p-6 rounded-[20px]">
          <p className="text-sm text-gray-600 mb-2">Pendapatan Hari Ini</p>
          <p className="text-2xl font-bold text-yellow">{formatRupiah(stats.revenueToday)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Revenue */}
        <div className="glass-card p-6 rounded-[20px]">
          <h3 className="text-lg font-bold mb-4 text-gray-800">📈 Pendapatan Per Jam</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,114,182,0.2)" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #f472b6',
                }}
                formatter={(value: any) => formatRupiah(value)}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f472b6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Type Breakdown */}
        <div className="glass-card p-6 rounded-[20px]">
          <h3 className="text-lg font-bold mb-4 text-gray-800">🍽️ Tipe Pesanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${formatRupiah(value)}`}
                outerRadius={80}
                fill="#f472b6"
                dataKey="value"
              >
                {orderTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatRupiah(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="glass-card p-6 rounded-[20px]">
        <h3 className="text-lg font-bold mb-4 text-gray-800">💳 Metode Pembayaran</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,114,182,0.2)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid #f472b6',
              }}
              formatter={(value: any) => formatRupiah(value)}
            />
            <Bar dataKey="value" fill="#a78bfa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6 rounded-[20px]">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Pesanan Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pink/25">
                <th className="text-left py-3 px-4 font-bold text-gray-700">No. Pesanan</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Pelanggan</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Tipe</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Metode</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.slice(-10).reverse().map(order => (
                <tr key={order.id} className="border-b border-pink/10 hover:bg-white/30">
                  <td className="py-3 px-4 font-semibold">{order.orderNumber}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-pink/20 text-pink px-2 py-1 rounded-full">
                      {order.orderType === 'takeaway' && '🛍️'}
                      {order.orderType === 'dine-in' && '🪑'}
                      {order.orderType === 'vip' && '👑'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.paymentMethod === 'qris' && '📱 QRIS'}
                    {order.paymentMethod === 'va' && '🏦 VA'}
                    {order.paymentMethod === 'cash' && '💵 Cash'}
                    {order.paymentMethod === 'debit' && '💳 Debit'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-pink">
                    {formatRupiah(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

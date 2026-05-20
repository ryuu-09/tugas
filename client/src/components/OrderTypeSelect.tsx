import { useState } from 'react';
import { Order, Table, VIPRoom } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrderTypeSelectProps {
  tables: Table[];
  vipRooms: VIPRoom[];
  onSelectTakeaway: (customerName: string, phone?: string) => void;
  onSelectDineIn: (tableId: string, guests: number, customerName: string) => void;
  onSelectVIP: (roomId: string, guests: number, customerName: string) => void;
  onCancel: () => void;
}

export const OrderTypeSelect = ({
  tables,
  vipRooms,
  onSelectTakeaway,
  onSelectDineIn,
  onSelectVIP,
  onCancel,
}: OrderTypeSelectProps) => {
  const [step, setStep] = useState<'select' | 'takeaway' | 'dine-in' | 'vip'>('select');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedVIPRoom, setSelectedVIPRoom] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);

  const handleTakeawayConfirm = () => {
    if (customerName.trim()) {
      onSelectTakeaway(customerName, customerPhone || undefined);
    }
  };

  const handleDineInConfirm = () => {
    if (selectedTable && customerName.trim()) {
      onSelectDineIn(selectedTable, guests, customerName);
    }
  };

  const handleVIPConfirm = () => {
    if (selectedVIPRoom && customerName.trim()) {
      onSelectVIP(selectedVIPRoom, guests, customerName);
    }
  };

  if (step === 'select') {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[90] p-4 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Pilih Tipe Pesanan</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Takeaway Card */}
            <div
              onClick={() => setStep('takeaway')}
              className="glass-card p-8 cursor-pointer hover:shadow-xl transition-all duration-250 transform hover:-translate-y-2"
            >
              <div className="text-6xl mb-4 text-center">🛍️</div>
              <h3 className="text-2xl font-bold text-center mb-2 text-pink">TAKEAWAY</h3>
              <p className="text-center text-gray-600 mb-4">Ambil di Kasir</p>
              <p className="text-center text-sm text-gray-500">Estimasi siap: 5–10 menit</p>
            </div>

            {/* Dine In Card */}
            <div
              onClick={() => setStep('dine-in')}
              className="glass-card p-8 cursor-pointer hover:shadow-xl transition-all duration-250 transform hover:-translate-y-2"
            >
              <div className="text-6xl mb-4 text-center">🪑</div>
              <h3 className="text-2xl font-bold text-center mb-2 text-mint">DINE IN</h3>
              <p className="text-center text-gray-600 mb-4">Makan di Tempat</p>
              <p className="text-center text-sm text-gray-500">Pilih meja reguler</p>
            </div>

            {/* VIP Card */}
            <div
              onClick={() => setStep('vip')}
              className="glass-card p-8 cursor-pointer hover:shadow-xl transition-all duration-250 transform hover:-translate-y-2 shimmer-gold"
            >
              <div className="text-6xl mb-4 text-center">👑</div>
              <h3 className="text-2xl font-bold text-center mb-2 text-yellow">VIP ROOM</h3>
              <p className="text-center text-gray-600 mb-4">VIP Experience</p>
              <p className="text-center text-sm text-yellow">+Rp 25.000</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={onCancel} variant="outline">
              Batal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'takeaway') {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[90] p-4 overflow-y-auto">
        <div className="glass-card p-6 md:p-8 max-w-md w-full my-auto">
          <h3 className="text-2xl font-bold mb-6 text-pink">🛍️ Takeaway</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Nama Pelanggan</label>
              <Input
                placeholder="Masukkan nama"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Nomor Telepon (Opsional)</label>
              <Input
                placeholder="0812-3456-7890"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="bg-mint/20 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Estimasi siap:</strong> 5–10 menit
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setStep('select')}
              variant="outline"
              className="flex-1"
            >
              Kembali
            </Button>
            <Button
              onClick={handleTakeawayConfirm}
              disabled={!customerName.trim()}
              className="flex-1 gradient-button text-white"
            >
              Lanjut
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'dine-in') {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[90] p-4 overflow-y-auto p-4">
        <div className="glass-card p-6 md:p-8 max-w-2xl w-full my-auto">
          <h3 className="text-2xl font-bold mb-6 text-mint">🪑 Dine In - Pilih Meja</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`
                  p-2 sm:p-3 md:p-4 rounded-lg font-bold transition-all duration-250 text-sm sm:text-base
                  ${
                    table.status === 'occupied'
                      ? 'bg-red-100 text-red-700 cursor-not-allowed opacity-50'
                      : selectedTable === table.id
                        ? 'bg-gradient-to-r from-mint to-blue text-white shadow-lg'
                        : 'bg-white/50 text-gray-700 hover:bg-white/75'
                  }
                `}
                disabled={table.status === 'occupied'}
              >
                <div className="text-lg sm:text-2xl mb-1">
                  {table.status === 'occupied' ? '🔴' : '🟢'}
                </div>
                <span className="text-xs sm:text-sm">T{String(table.number).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nama Pelanggan</label>
              <Input
                placeholder="Masukkan nama"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Jumlah Tamu</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="bg-white/50 hover:bg-white/75 px-4 py-2 rounded-lg font-bold"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-12 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="bg-white/50 hover:bg-white/75 px-4 py-2 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep('select')}
              variant="outline"
              className="flex-1"
            >
              Kembali
            </Button>
            <Button
              onClick={handleDineInConfirm}
              disabled={!selectedTable || !customerName.trim()}
              className="flex-1 gradient-button-mint text-white"
            >
              Lanjut
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'vip') {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[90] p-4 overflow-y-auto p-4">
        <div className="glass-card p-6 md:p-8 max-w-2xl w-full my-auto">
          <h3 className="text-2xl font-bold mb-6 text-yellow">👑 VIP Room - Pilih Ruangan</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {vipRooms.map(room => (
              <div
                key={room.id}
                onClick={() => room.status === 'available' && setSelectedVIPRoom(room.id)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all duration-250
                  ${
                    room.status === 'occupied'
                      ? 'bg-red-100 opacity-50 cursor-not-allowed'
                      : selectedVIPRoom === room.id
                        ? 'glass-card shimmer-gold border-2 border-yellow'
                        : 'glass-card hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{room.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    room.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {room.status === 'available' ? 'Tersedia' : 'Terisi'}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800">{room.name}</h4>
                <p className="text-xs text-gray-600">Kapasitas: {room.capacity.min}–{room.capacity.max} orang</p>
                <div className="mt-2 text-xs text-gray-500">
                  ✓ AC Pribadi ✓ Sofa Premium
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nama Tamu</label>
              <Input
                placeholder="Masukkan nama"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Jumlah Tamu</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="bg-white/50 hover:bg-white/75 px-4 py-2 rounded-lg font-bold"
                >
                  −
                </button>
                <span className="text-2xl font-bold w-12 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                  className="bg-white/50 hover:bg-white/75 px-4 py-2 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-yellow/20 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-800">
                Surcharge VIP: <span className="text-yellow font-bold">+Rp 25.000</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep('select')}
              variant="outline"
              className="flex-1"
            >
              Kembali
            </Button>
            <Button
              onClick={handleVIPConfirm}
              disabled={!selectedVIPRoom || !customerName.trim()}
              className="flex-1 gradient-button-gold text-white"
            >
              Lanjut
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

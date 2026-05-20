import { useState } from 'react';
import { Settings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { showToast } from '@/components/Toast';

interface SettingsPageProps {
  settings: Settings;
  onUpdateSettings: (updates: Partial<Settings>) => void;
}

export const SettingsPage = ({ settings, onUpdateSettings }: SettingsPageProps) => {
  const [formData, setFormData] = useState(settings);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    showToast('✅ Pengaturan disimpan!', 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Store Information */}
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🏪 Informasi Toko</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Toko</label>
            <Input
              value={formData.storeName}
              onChange={e => handleInputChange('storeName', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tagline</label>
            <Input
              value={formData.storeTagline}
              onChange={e => handleInputChange('storeTagline', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Alamat</label>
            <Input
              value={formData.storeAddress}
              onChange={e => handleInputChange('storeAddress', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nomor Telepon</label>
            <Input
              value={formData.storePhone}
              onChange={e => handleInputChange('storePhone', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Cashier Settings */}
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">👤 Kasir</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Kasir Aktif</label>
            <Input
              value={formData.cashierName}
              onChange={e => handleInputChange('cashierName', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Shift</label>
            <select
              value={formData.shift}
              onChange={e => handleInputChange('shift', e.target.value)}
              className="w-full px-4 py-2 border border-pink/25 rounded-lg bg-white/50"
            >
              <option value="pagi">Pagi</option>
              <option value="siang">Siang</option>
              <option value="malam">Malam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Settings */}
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Pengaturan Harga</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.ppnEnabled}
              onCheckedChange={checked => handleInputChange('ppnEnabled', checked)}
            />
            <span className="font-semibold">Aktifkan PPN 11%</span>
          </label>

          {formData.ppnEnabled && (
            <div>
              <label className="block text-sm font-semibold mb-2">Persentase PPN (%)</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.ppnPercentage}
                onChange={e => handleInputChange('ppnPercentage', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">VIP Surcharge (Rp)</label>
            <Input
              type="number"
              value={formData.vipSurcharge}
              onChange={e => handleInputChange('vipSurcharge', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.loyaltyPointsEnabled}
              onCheckedChange={checked => handleInputChange('loyaltyPointsEnabled', checked)}
            />
            <span className="font-semibold">Aktifkan Loyalty Points</span>
          </label>
        </div>
      </div>

      {/* Table Settings */}
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🪑 Pengaturan Meja</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Jumlah Meja Reguler: {formData.regularTableCount}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={formData.regularTableCount}
              onChange={e => handleInputChange('regularTableCount', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-4">Nama VIP Room</label>
            <div className="space-y-3">
              {formData.vipRoomNames.map((name, index) => (
                <Input
                  key={index}
                  value={name}
                  onChange={e => {
                    const newNames = [...formData.vipRoomNames];
                    newNames[index] = e.target.value;
                    handleInputChange('vipRoomNames', newNames);
                  }}
                  placeholder={`VIP Room ${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎨 Tampilan</h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.darkMode}
              onCheckedChange={checked => handleInputChange('darkMode', checked)}
            />
            <span className="font-semibold">Dark Mode</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.cloudAnimations}
              onCheckedChange={checked => handleInputChange('cloudAnimations', checked)}
            />
            <span className="font-semibold">Animasi Awan</span>
          </label>
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="glass-card p-6 rounded-[20px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🖨️ Struk & Printer</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-3">Lebar Struk</label>
            <div className="flex gap-3">
              {(['58mm', '80mm'] as const).map(width => (
                <label key={width} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="receiptWidth"
                    value={width}
                    checked={formData.receiptWidth === width}
                    onChange={e => handleInputChange('receiptWidth', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{width}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.showQRRating}
              onCheckedChange={checked => handleInputChange('showQRRating', checked)}
            />
            <span className="font-semibold">Tampilkan QR Rating di Struk</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={formData.autoPrint}
              onCheckedChange={checked => handleInputChange('autoPrint', checked)}
            />
            <span className="font-semibold">Cetak Otomatis Setelah Bayar</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full gradient-button text-white py-3 font-bold rounded-full"
      >
        💾 Simpan Pengaturan
      </Button>
    </div>
  );
};

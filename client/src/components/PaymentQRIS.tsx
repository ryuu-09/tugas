import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { formatRupiah, formatTime } from '@/utils/formatting';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentQRISProps {
  order: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentQRIS = ({ order, onSuccess, onCancel }: PaymentQRISProps) => {
  const [timeLeft, setTimeLeft] = useState(300000); // 5 minutes
  const [status, setStatus] = useState<'waiting' | 'processing' | 'success' | 'expired'>('waiting');
  const [progress, setProgress] = useState(100);

  // Use the provided QRIS data
  const qrisPayload = "00020101021126570011ID.DANA.WWW011893600915302429220802090242922080303UMI51440014ID.CO.QRIS.WWW0215ID10265135796010303UMI5204737253033605802ID5904Revy6015Kab. Karanganya6105577836304A713";

  useEffect(() => {
    if (timeLeft <= 0) {
      if (status === 'waiting') {
        setStatus('expired');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        setProgress((newTime / 300000) * 100);
        if (newTime <= 0 && status === 'waiting') {
          setStatus('expired');
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, status]);

  const handleSimulatePayment = async () => {
    if (status !== 'waiting') return;
    setStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSuccess();
  };

  const handleRetry = () => {
    setTimeLeft(300000);
    setProgress(100);
    setStatus('waiting');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[130] p-4 overflow-y-auto">
      <div className="glass-card p-6 md:p-8 max-w-md w-full shadow-2xl border border-white/20 my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📱 QRIS Payment</h2>
          <div className="bg-pink/10 text-pink px-3 py-1 rounded-full text-xs font-bold">
            OFFICIAL QRIS
          </div>
        </div>

        {/* Merchant Info */}
        <div className="bg-white/60 p-4 rounded-xl mb-6 text-center border border-pink/10">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Merchant</p>
          <p className="text-xl font-black text-gray-800">REVY</p>
          <p className="text-xs text-gray-500 mt-1 font-mono">NMID: ID1026513579601</p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-4 md:p-6 rounded-2xl mb-6 flex flex-col items-center justify-center shadow-inner border border-gray-100">
          <div className="relative p-2 bg-white">
             <QRCodeSVG 
                value={qrisPayload} 
                size={180}
                level="H"
                includeMargin={true}
                className="w-full max-w-[200px] h-auto"
                imageSettings={{
                    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/QRIS_logo.svg/1200px-QRIS_logo.svg.png",
                    x: undefined,
                    y: undefined,
                    height: 35,
                    width: 35,
                    excavate: true,
                }}
             />
          </div>
          <p className="mt-4 text-[10px] text-gray-400 font-mono uppercase tracking-tighter text-center">
            Scan QR code dengan aplikasi pembayaran yang didukung
          </p>
        </div>

        {/* Amount */}
        <div className="text-center mb-6 bg-gradient-to-r from-pink/5 to-purple/5 p-4 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink to-purple">
            {formatRupiah(order.total)}
          </p>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Waktu Tersisa</p>
            <p className="text-sm font-mono font-bold text-pink">{formatTime(timeLeft)}</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink to-purple h-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-6 min-h-[24px]">
          {status === 'waiting' && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="text-gray-600 text-sm font-medium">Menunggu pembayaran Anda...</p>
            </div>
          )}
          {status === 'processing' && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-pink border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm font-medium">Memverifikasi transaksi...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-bold">Pembayaran Berhasil!</p>
            </div>
          )}
          {status === 'expired' && (
            <div className="flex items-center justify-center gap-2 text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="font-bold">Waktu Pembayaran Habis</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="flex-1 text-gray-500 hover:text-gray-700"
            disabled={status === 'processing' || status === 'success'}
            aria-label="Batal pembayaran QRIS"
          >
            Batal
          </Button>
          {status === 'expired' ? (
            <Button
              onClick={handleRetry}
              className="flex-[2] gradient-button text-white font-bold shadow-lg shadow-pink/20"
              aria-label="Coba pembayaran QRIS lagi"
            >
              🔄 Coba Lagi
            </Button>
          ) : (
            <Button
              onClick={handleSimulatePayment}
              disabled={status !== 'waiting'}
              className="flex-[2] gradient-button text-white font-bold shadow-lg shadow-pink/20"
              aria-label="Simulasi pembayaran QRIS"
            >
              Simulasi Bayar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

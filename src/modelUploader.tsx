import { useState } from 'react';
import { Upload } from 'lucide-react';

interface ModelUploaderProps {
  onModelSelect: (url: string) => void;
}

export default function ModelUploader({ onModelSelect }: ModelUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.glb')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      onModelSelect(url);
    } else {
      alert('Mohon pilih file .glb');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Model 3D</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <Upload size={48} className="text-gray-400 mb-4" />
          <span className="text-sm text-gray-600 mb-2">
            {selectedFile ? selectedFile.name : 'Klik untuk upload file .glb'}
          </span>
          <span className="text-xs text-gray-500">
            File format: .glb (GLTF Binary)
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".glb"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Model berhasil dimuat: {selectedFile.name}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Tekan tombol "Mulai AR" untuk melihat model dalam AR
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Catatan:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Gunakan browser Chrome di Android untuk pengalaman terbaik</li>
          <li>• Pastikan izin kamera sudah diaktifkan</li>
          <li>• Arahkan kamera ke permukaan datar untuk menempatkan model</li>
        </ul>
      </div>
    </div>
  );
}

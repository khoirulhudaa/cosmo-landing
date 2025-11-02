import { Grid3X3 } from 'lucide-react';

const MODELS = [
  {
    id: 'box',
    name: 'Box Sample',
    url: 'https://vr.kiraproject.id/models/box-sample.glb'
  },
  {
    id: 'toilet',
    name: 'Toilet',
    url: 'https://vr.kiraproject.id/models/toilet.glb'
  },
  {
    id: 'shoe',
    name: 'Shoe',
    url: 'https://vr.kiraproject.id/models/shoe.glb'
  },
  {
    id: 'product',
    name: 'Product Sample',
    url: 'https://vr.kiraproject.id/models/product-sample.glb'
  },
  {
    id: 'machine',
    name: 'Machine',
    url: 'https://vr.kiraproject.id/models/machine.glb'
  },
  {
    id: 'astronaut',
    name: 'Astronaut',
    url: 'http://vr.kiraproject.id/models/astronaut.glb'
  }
];

export default function ModelSelector({ onModelSelect }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Grid3X3 size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Pilih Model 3D</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelSelect(model.url)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              <Grid3X3 size={40} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {model.name}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Petunjuk:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Pilih salah satu model untuk menampilkannya</li>
          <li>• Gunakan browser Chrome di Android untuk pengalaman AR terbaik</li>
          <li>• Pastikan izin kamera sudah diaktifkan di perangkat Anda</li>
        </ul>
      </div>
    </div>
  );
}

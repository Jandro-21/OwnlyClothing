import { XCircle, ArrowLeft } from 'lucide-react';

export default function Failure({ onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-4 animate-fade-in relative overflow-hidden">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-4xl font-bold mb-3">
          Pago cancelado
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          El pago no se completó. Puedes intentarlo de nuevo cuando quieras.
        </p>

        <button
          onClick={onBack}
          className="glass-button px-8 py-3 rounded-full font-semibold text-lg flex items-center justify-center mx-auto gap-2 hover:bg-red-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}

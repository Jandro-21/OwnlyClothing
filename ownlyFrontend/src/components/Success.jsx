import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function Success({ onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-4 animate-fade-in relative overflow-hidden">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-4xl font-bold mb-3">
          ¡Pago exitoso!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Tu pedido ha sido procesado correctamente. Recibirás un correo con los detalles.
        </p>

        <button
          onClick={onBack}
          className="glass-button px-8 py-3 rounded-full font-semibold text-lg flex items-center justify-center mx-auto gap-2 hover:bg-green-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}

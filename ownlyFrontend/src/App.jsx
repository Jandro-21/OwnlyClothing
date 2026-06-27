import React, { useState } from 'react';
import { Droplet, ArrowRight } from 'lucide-react';
import Store from './components/Store';

export default function App() {
  const [view, setView] = useState('landing');

  return (
    <div className="text-gray-900 dark:text-white min-h-screen relative overflow-x-hidden selection:bg-purple-300 selection:text-purple-900">
      
      {/* Background Animado */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:bg-purple-900 dark:opacity-40 transition-colors duration-500"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-cyan-900 dark:opacity-40 transition-colors duration-500"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900 dark:opacity-40 transition-colors duration-500"></div>
      </div>

      {view === 'landing' ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700">
          <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-4 animate-fade-in relative overflow-hidden group">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/40 to-transparent rotate-45 transform pointer-events-none dark:from-white/5"></div>
            
            <Droplet className="w-16 h-16 mx-auto mb-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Ownly<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Clothing</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              La nueva dimensión del estilo. Transparencia, elegancia y exclusividad diseñada para ti.
            </p>
            
            <button onClick={() => setView('store')} className="glass-button px-8 py-3 rounded-full font-semibold text-lg flex items-center justify-center mx-auto space-x-2 group-hover:shadow-lg dark:text-white">
              <span>Entrar a la Tienda</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <Store />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Droplet, ArrowRight } from 'lucide-react';
import Store from './components/Store';
import Success from './components/Success';
import Failure from './components/Failure';

export default function App() {
  const [screen, setScreen] = useState('landing');

  useEffect(() => {
    const ruta = window.location.pathname;
    if (ruta === '/success') setScreen('success');
    else if (ruta === '/cancel') setScreen('failure');
    else setScreen('landing');
  }, []);

  const irAlaTienda = () => {
    window.history.pushState({}, '', '/');
    setScreen('store');
  };

  if (screen === 'success') return <Success onBack={irAlaTienda} />;
  if (screen === 'failure') return <Failure onBack={irAlaTienda} />;

  return (
    <div className="text-gray-900 dark:text-white min-h-screen relative overflow-x-hidden selection:bg-purple-300 selection:text-purple-900">
      
      {/* Fondo animado con burbujas de colores */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="blob top-0 left-1/4 bg-purple-300 dark:bg-purple-900"></div>
        <div className="blob top-0 right-1/4 bg-cyan-300 dark:bg-cyan-900" style={{ animationDelay: '-2s' }}></div>
        <div className="blob -bottom-32 left-1/2 bg-pink-300 dark:bg-pink-900" style={{ animationDelay: '-4s' }}></div>
      </div>

      {screen === 'landing' ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700">
          <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-4 animate-fade-in relative overflow-hidden group">
            <div className="shine dark:shine"></div>
            
            <Droplet className="w-16 h-16 mx-auto mb-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Ownly<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Clothing</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              La nueva dimensión del estilo. Transparencia, elegancia y exclusividad diseñada para ti.
            </p>
            
            <button 
              onClick={irAlaTienda}
              className="glass-button px-8 py-3 rounded-full font-semibold text-lg flex items-center justify-center mx-auto space-x-2 group-hover:shadow-lg dark:text-white"
            >
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
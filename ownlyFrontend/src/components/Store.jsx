import React, { useState, useEffect } from 'react';
import { Droplet, Moon, Sun, Palette, ShoppingBag, X, CreditCard } from 'lucide-react';

export default function Store() {
  const [view, setView] = useState('store');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [products, setProducts] = useState([]);
  
  // Estados del Carrito
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.retail_price) || 0), 0).toFixed(2);

  // NUEVO: Función para iniciar el pago con Stripe
  const handleStripeCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('http://localhost:3000/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart })
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirigir al usuario a la página de pago segura de Stripe
        window.location.href = data.url;
      } else {
        alert("Hubo un problema al generar el enlace de pago.");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al conectar con el servidor para el pago.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const categories = ['Camisetas', 'Sudaderas', 'Pantalones', 'Gorras', 'Accesorios'];
  const filteredProducts = currentCategory === 'All' 
    ? products 
    : products.filter(p => p.category === currentCategory);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="glass-panel sticky top-0 z-40 mx-4 mt-4 mb-6 rounded-2xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
          <Droplet className="text-purple-500 w-8 h-8" />
          <span className="text-2xl font-bold">Ownly<span className="font-light">Clothing</span></span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCartOpen(true)} className="glass-button p-2 rounded-full relative transition-all">
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="glass-button p-2 rounded-full">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 h-fit sticky top-28 glass-panel rounded-2xl p-6">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-4">Categorías</h2>
          <nav className="flex flex-col space-y-2 mb-6">
            <button onClick={() => setCurrentCategory('All')} className="text-left px-4 py-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition-colors">Todas</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCurrentCategory(cat)} className="text-left px-4 py-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/10 transition-colors">
                {cat}
              </button>
            ))}
          </nav>
          
          <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
            <button onClick={() => setView('customizer')} className="w-full glass-button bg-gradient-to-r from-purple-500/20 to-cyan-500/20 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Crea tu prenda
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {view === 'store' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                  <img src={p.thumbnail_url} alt={p.name} className="w-32 h-32 object-contain mb-4" />
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-bold mb-4">{p.retail_price ? `${p.retail_price}€` : 'Precio no disp.'}</p>
                  
                  <button onClick={() => addToCart(p)} className="glass-button w-full py-2 rounded-xl flex justify-center items-center gap-2 font-semibold hover:bg-purple-500 hover:text-white transition-colors">
                    <ShoppingBag className="w-4 h-4" /> Añadir al carrito
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <Customizer onBack={() => setView('store')} />
          )}
        </main>
      </div>

      {/* Modal del Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl p-6 flex flex-col animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tu Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Tu carrito está vacío.</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-sm text-purple-600 font-bold">{item.retail_price}€</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Eliminar</button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-4">
                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>Total:</span>
                  <span>{cartTotal}€</span>
                </div>
                
                {/* Botón único de Stripe */}
                <button 
                  onClick={handleStripeCheckout}
                  disabled={isCheckingOut}
                  className={`w-full bg-[#635BFF] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${isCheckingOut ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4b45cf]'}`}
                >
                  <CreditCard className="w-5 h-5" /> 
                  {isCheckingOut ? 'Procesando...' : 'Pagar de forma segura'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">Pagos procesados de forma segura por Stripe</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Customizer({ onBack }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendToPrintful = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/create-custom-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tshirt', text, color: '#ffffff' })
      });
      const data = await response.json();
      if(data.success) alert("Diseño guardado. (En el futuro se añadirá al carrito)");
    } catch (e) {
      alert("Error: Verifica el backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Editor de Prenda</h2>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu texto..." className="w-full p-3 rounded-xl mb-4 bg-white/20 border border-white/30 dark:text-white" />
      <div className="flex gap-4">
        <button onClick={onBack} className="glass-button px-6 py-3 rounded-xl">Volver</button>
        <button onClick={handleSendToPrintful} disabled={isLoading} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">
          {isLoading ? 'Guardando...' : 'Añadir diseño al carrito'}
        </button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Droplet, Moon, Sun, Palette, ShoppingBag, X, CreditCard, Plus, Minus } from 'lucide-react';

function parsePrecio(precio) {
  if (precio == null) return 0;
  if (typeof precio === 'string') {
    const limpio = precio.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(limpio) || 0;
  }
  return parseFloat(precio) || 0;
}

export default function Store() {
  const [currentSection, setCurrentSection] = useState('store');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [showingCart, setShowingCart] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const traerProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/products');
        const datos = await respuesta.json();

        const productosClasificados = datos.map(producto => {
          let categoria = 'Accesorios';
          const nombre = producto.name.toLowerCase();

          if (
            nombre.includes('camiseta') ||
            nombre.includes('t-shirt') ||
            nombre.includes('tee') ||
            nombre.includes('shirt') ||
            nombre.includes('top')
          ) {
            categoria = 'Camisetas';
          } else if (
            nombre.includes('sudadera') ||
            nombre.includes('hoodie') ||
            nombre.includes('jacket') ||
            nombre.includes('sweater') ||
            nombre.includes('fleece')
          ) {
            categoria = 'Sudaderas';
          } else if (
            nombre.includes('pantalón') ||
            nombre.includes('pant') ||
            nombre.includes('shorts') ||
            nombre.includes('chándal') ||
            nombre.includes('jogger')
          ) {
            categoria = 'Pantalones';
          } else if (
            nombre.includes('gorra') ||
            nombre.includes('cap') ||
            nombre.includes('hat') ||
            nombre.includes('beanie') ||
            nombre.includes('visera')
          ) {
            categoria = 'Gorras';
          }

          return { ...producto, categoriaAsignada: categoria };
        });

        setProducts(productosClasificados);
      } catch (error) {
        console.error('Ay, no pudimos conectar con el servidor:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    traerProductos();
  }, []);

  const agregarAlCarrito = (producto, keyPersonalizado = null) => {
    const key = keyPersonalizado || producto.id;
    setCart(prev => {
      const yaExiste = prev.find(item => item.key === key);
      if (yaExiste) {
        return prev.map(item =>
          item.key === key ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { key, producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (key, delta) => {
    setCart(prev =>
      prev
        .map(item =>
          item.key === key
            ? { ...item, cantidad: Math.max(0, item.cantidad + delta) }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalDelCarrito = cart
    .reduce((total, item) => total + parsePrecio(item.producto.retail_price || '20.00') * item.cantidad, 0)
    .toFixed(2);

  const irAPagarConStripe = async () => {
    setProcessingPayment(true);
    try {
      const respuesta = await fetch('http://localhost:3000/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart })
      });
      const datos = await respuesta.json();

      if (datos.url) {
        window.location.href = datos.url;
      } else {
        alert('Ups, no pudimos generar el enlace de pago. Intenta de nuevo.');
      }
    } catch (error) {
      console.error(error);
      alert('Error al conectar con el servidor de pagos.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const categorias = ['Camisetas', 'Sudaderas', 'Pantalones', 'Gorras', 'Accesorios'];
  const productosFiltrados =
    selectedCategory === 'All'
      ? products
      : products.filter(p => p.categoriaAsignada === selectedCategory);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <header className="glass-panel sticky top-0 z-40 mx-4 mt-4 mb-6 rounded-2xl px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => { setCurrentSection('store'); setSelectedCategory('All'); }}
        >
          <Droplet className="text-purple-500 w-8 h-8" />
          <span className="text-2xl font-bold">Ownly<span className="font-light">Clothing</span></span>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setShowingCart(true)} className="glass-button p-2 rounded-full relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button onClick={() => setDarkMode(!darkMode)} className="glass-button p-2 rounded-full">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        <aside className="w-full md:w-64 h-fit sticky top-28 glass-panel rounded-2xl p-6">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-semibold mb-4">
            Categorías
          </h2>

          <nav className="flex flex-col space-y-2 mb-6">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`text-left px-4 py-2 rounded-xl transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-purple-600/20 text-purple-600 font-bold'
                  : 'hover:bg-white/30 dark:hover:bg-white/10'
              }`}
            >
              Todas
            </button>

            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-4 py-2 rounded-xl transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600/20 text-purple-600 font-bold'
                    : 'hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
            <button
              onClick={() => setCurrentSection('customizer')}
              className="w-full glass-button bg-gradient-to-r from-purple-500/20 to-cyan-500/20 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Crea tu prenda
            </button>
          </div>
        </aside>

        <main className="flex-1">
          {currentSection === 'store' ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 px-2">
                {selectedCategory === 'All' ? 'Todos los Productos' : selectedCategory}
              </h2>

              {loadingProducts ? (
                <div className="text-center py-20">
                  <div className="inline-block w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Cargando productos...</p>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                  No hay productos disponibles en esta categoría actualmente.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productosFiltrados.map(producto => (
                    <div key={producto.id} className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center">
                      <img
                        src={producto.thumbnail_url}
                        alt={producto.name}
                        className="w-32 h-32 object-contain mb-4"
                      />
                      <h3 className="font-bold text-lg line-clamp-2 min-h-[3.5rem]">{producto.name}</h3>
                      <p className="text-purple-600 dark:text-purple-400 font-bold mb-4">
                        {producto.retail_price ? `${producto.retail_price}€` : '20.00€'}
                      </p>

                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        className="glass-button w-full py-2 rounded-xl flex justify-center items-center gap-2 font-semibold hover:bg-purple-500 hover:text-white transition-colors mt-auto"
                      >
                        <ShoppingBag className="w-4 h-4" /> Añadir al carrito
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Customizer
              onBack={() => setCurrentSection('store')}
              onAddToCart={agregarAlCarrito}
            />
          )}
        </main>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="text-center text-sm text-gray-400 dark:text-gray-600 py-6 mt-12 px-4">
        Esto es un proyecto falso — las compras no deben ser reales.
      </footer>

      {/* ─── Modal del carrito ────────────────────────────────────────── */}
      {showingCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tu Carrito</h2>
              <button
                onClick={() => setShowingCart(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Tu carrito está vacío.</p>
              ) : (
                cart.map(item => (
                  <div
                    key={item.key}
                    className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.producto.thumbnail_url}
                        alt={item.producto.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{item.producto.name}</h4>
                        <p className="text-sm text-purple-600 font-bold">
                          {item.producto.retail_price || '20.00'}€
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cambiarCantidad(item.key, -1)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-semibold">{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(item.key, 1)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-4">
                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>Total:</span>
                  <span>{totalDelCarrito}€</span>
                </div>

                <button
                  onClick={irAPagarConStripe}
                  disabled={processingPayment}
                  className={`w-full bg-[#635BFF] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${
                    processingPayment
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-[#4b45cf]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  {processingPayment ? 'Procesando...' : 'Pagar de forma segura'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Personalizador de prendas ──────────────────────────────────────────
function Customizer({ onBack, onAddToCart }) {
  const [tipo, setTipo] = useState('camiseta');
  const [texto, setTexto] = useState('');
  const [color, setColor] = useState('#6d28d9');

  const tiposPrenda = [
    { id: 'camiseta', label: 'Camiseta', precio: '25.00' },
    { id: 'sudaderas', label: 'Sudadera', precio: '45.00' },
    { id: 'gorra', label: 'Gorra', precio: '20.00' },
  ];

  const colores = [
    { hex: '#6d28d9', nombre: 'Púrpura' },
    { hex: '#0891b2', nombre: 'Cian' },
    { hex: '#000000', nombre: 'Negro' },
    { hex: '#ffffff', nombre: 'Blanco' },
    { hex: '#dc2626', nombre: 'Rojo' },
  ];

  const prendaActual = tiposPrenda.find(t => t.id === tipo);

  const aniadirAlCarrito = () => {
    if (!texto.trim()) {
      alert('Escribe un texto para tu diseño.');
      return;
    }

    const nombrePrenda = `${prendaActual.label} personalizada — "${texto}"`;
    const keyPersonalizado = `custom_${Date.now()}`;

    onAddToCart(
      {
        id: keyPersonalizado,
        name: nombrePrenda,
        retail_price: prendaActual.precio,
        thumbnail_url: `https://placehold.co/200x200/${color.replace('#', '')}/${
          color === '#ffffff' ? '333' : 'fff'
        }?text=${encodeURIComponent(texto)}`,
      },
      keyPersonalizado
    );

    setTexto('');
  };

  return (
    <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Crea tu prenda</h2>

      <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Tipo de prenda
      </label>
      <div className="flex gap-3 mb-6">
        {tiposPrenda.map(t => (
          <button
            key={t.id}
            onClick={() => setTipo(t.id)}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              tipo === t.id
                ? 'bg-purple-600 text-white'
                : 'glass-button hover:bg-white/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Color
      </label>
      <div className="flex gap-3 mb-6">
        {colores.map(c => (
          <button
            key={c.hex}
            onClick={() => setColor(c.hex)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              color === c.hex ? 'border-purple-500 scale-110' : 'border-gray-300 dark:border-gray-600'
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.nombre}
          />
        ))}
      </div>

      <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Texto del diseño
      </label>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe lo que quieras estampar..."
        className="w-full p-3 rounded-xl mb-6 bg-white/20 border border-white/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl mb-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {prendaActual.label} personalizada
        </span>
        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
          {prendaActual.precio}€
        </span>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="glass-button px-6 py-3 rounded-xl font-semibold">
          Volver
        </button>
        <button
          onClick={aniadirAlCarrito}
          className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
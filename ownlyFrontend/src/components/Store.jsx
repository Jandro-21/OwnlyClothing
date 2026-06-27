import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplet, Moon, Sun, Menu, Palette, 
  ShoppingBag, Globe, Camera, User, Mail 
} from 'lucide-react';

const productsData = [
  { id: 1, name: "Camiseta Esencial", price: "19.99€", category: "Camisetas", emoji: "👕" },
  { id: 2, name: "Sudadera Oversize", price: "39.99€", category: "Sudaderas", emoji: "🧥" },
  { id: 3, name: "Pantalón Cargo", price: "49.99€", category: "Pantalones", emoji: "👖" },
  { id: 4, name: "Gorra Urbana", price: "14.99€", category: "Gorras", emoji: "🧢" },
  { id: 5, name: "Gafas de Sol", price: "24.99€", category: "Accesorios", emoji: "🕶️" },
  { id: 6, name: "Mochila Minimal", price: "34.99€", category: "Accesorios", emoji: "🎒" },
  { id: 7, name: "Camiseta Gráfica", price: "22.99€", category: "Camisetas", emoji: "👚" },
  { id: 8, name: "Pantalón Chándal", price: "29.99€", category: "Pantalones", emoji: "🩳" },
  { id: 9, name: "Gorra Visera Plana", price: "16.99€", category: "Gorras", emoji: "👲" },
];

export default function Store() {
  const [view, setView] = useState('store'); // 'store' o 'customizer'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [canvasType, setCanvasType] = useState('tshirt');
  const [garmentColor, setGarmentColor] = useState('#ffffff');
  const [garmentText, setGarmentText] = useState('');

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    setView('store');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        isDarkMode={isDarkMode} 
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        goHome={() => { setView('store'); setCurrentCategory('All'); }}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 flex flex-col md:flex-row gap-6 mb-10">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onSelectCategory={handleCategorySelect}
          onShowCustomizer={() => { setView('customizer'); setIsMobileMenuOpen(false); }}
        />

        <main className="flex-1 min-w-0">
          {view === 'store' && <ProductGrid category={currentCategory} />}
          {view === 'customizer' && (
            <Customizer 
              type={canvasType} 
              setType={setCanvasType}
              color={garmentColor}
              setColor={setGarmentColor}
              text={garmentText}
              setText={setGarmentText}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function Header({ toggleDarkMode, isDarkMode, toggleMenu, goHome }) {
  return (
    <header className="glass-panel sticky top-0 z-40 mx-4 mt-4 mb-6 rounded-2xl px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
        <Droplet className="text-purple-500 w-8 h-8" />
        <span className="text-2xl font-bold tracking-tight">Glass<span className="font-light">Wear</span></span>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="glass-button p-2 rounded-full" aria-label="Cambiar modo oscuro">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="md:hidden glass-button p-2 rounded-full" onClick={toggleMenu}>
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ isOpen, onSelectCategory, onShowCustomizer }) {
  const categories = ['Camisetas', 'Sudaderas', 'Pantalones', 'Gorras', 'Accesorios'];
  
  return (
    <aside className={`glass-panel rounded-2xl p-6 w-full md:w-64 flex-shrink-0 h-fit sticky top-28 ${isOpen ? 'block' : 'hidden md:block'}`}>
      <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-4">Categorías</h2>
      <nav className="flex flex-col space-y-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => onSelectCategory(cat)} className="text-left px-4 py-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/5 transition-colors font-medium text-gray-700 dark:text-gray-200">
            {cat}
          </button>
        ))}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-300/30 dark:border-gray-600/30">
        <button onClick={onShowCustomizer} className="w-full glass-button bg-gradient-to-r from-purple-500/20 to-cyan-500/20 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 group">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
          Crea tu prenda
        </button>
      </div>
    </aside>
  );
}

function ProductGrid({ category }) {
  const filtered = category === 'All' ? productsData : productsData.filter(p => p.category === category);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-3xl font-bold">{category === 'All' ? 'Destacados' : category}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Descubre nuestra colección premium</p>
        </div>
      </div>
      
      {filtered.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer animate-slide-up">
              <div className="w-32 h-32 mb-4 bg-white/30 dark:bg-black/30 rounded-full flex items-center justify-center text-6xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                {product.emoji}
              </div>
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{product.category}</p>
              <div className="flex justify-between items-center w-full mt-auto">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{product.price}</span>
                <button className="glass-button p-2 rounded-lg text-gray-800 dark:text-white">
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Customizer({ type, setType, color, setColor, text, setText, isDarkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.shadowColor = isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    ctx.fillStyle = color;
    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (type === 'tshirt') {
      ctx.moveTo(120, 50); ctx.quadraticCurveTo(200, 100, 280, 50); ctx.lineTo(350, 100); ctx.lineTo(330, 180); ctx.lineTo(290, 150); ctx.lineTo(290, 350); ctx.lineTo(110, 350); ctx.lineTo(110, 150); ctx.lineTo(70, 180); ctx.lineTo(50, 100);
    } else if (type === 'hoodie') {
      ctx.moveTo(140, 80); ctx.quadraticCurveTo(200, 10, 260, 80); ctx.lineTo(350, 120); ctx.lineTo(340, 220); ctx.lineTo(300, 190); ctx.lineTo(300, 350); ctx.lineTo(100, 350); ctx.lineTo(100, 190); ctx.lineTo(60, 220); ctx.lineTo(50, 120);
    } else if (type === 'pants') {
      ctx.moveTo(120, 50); ctx.lineTo(280, 50); ctx.lineTo(320, 350); ctx.lineTo(230, 350); ctx.lineTo(200, 150); ctx.lineTo(170, 350); ctx.lineTo(80, 350);
    } else if (type === 'cap') {
      ctx.moveTo(100, 200); ctx.bezierCurveTo(100, 50, 300, 50, 300, 200); ctx.lineTo(360, 220); ctx.lineTo(340, 240); ctx.lineTo(100, 200);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.stroke();

    ctx.beginPath();
    if (type === 'tshirt') { ctx.moveTo(120,50); ctx.quadraticCurveTo(200, 100, 280, 50); ctx.stroke(); }
    if (type === 'pants') { ctx.moveTo(200, 50); ctx.lineTo(200, 150); ctx.stroke(); }
    if (type === 'cap') { ctx.moveTo(200, 100); ctx.lineTo(200, 200); ctx.stroke(); }

    if (text) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      const textColor = (yiq >= 128) ? '#000000' : '#ffffff';

      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px Poppins, sans-serif';
      ctx.textAlign = 'center';
      
      let textY = 200;
      if(type === 'pants') textY = 120;
      if(type === 'cap') textY = 160;

      ctx.fillText(text, 200, textY, 150);
    }
  }, [type, color, text, isDarkMode]);

  const garmentTypes = [
    { id: 'tshirt', label: 'Camiseta' },
    { id: 'hoodie', label: 'Sudadera' },
    { id: 'pants', label: 'Pantalón' },
    { id: 'cap', label: 'Gorra' }
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Crea tu propia prenda</h2>
      <div className="glass-panel rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white/10 dark:bg-black/20 rounded-xl flex items-center justify-center p-4 border border-white/20 dark:border-white/5">
          <canvas ref={canvasRef} width="400" height="400" className="max-w-full h-auto drop-shadow-2xl"></canvas>
        </div>
        
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Prenda base</label>
            <div className="grid grid-cols-2 gap-3">
              {garmentTypes.map(g => (
                <button 
                  key={g.id} 
                  onClick={() => setType(g.id)} 
                  className={`glass-button py-2 rounded-lg text-sm ${type === g.id ? 'ring-2 ring-purple-500' : ''}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Color de la prenda</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Añadir texto</label>
            <input type="text" placeholder="Ej: GlassWear" maxLength="15" value={text} onChange={(e) => setText(e.target.value)} className="w-full glass-button px-4 py-3 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <button className="glass-button bg-gray-900/10 dark:bg-white/10 w-full py-4 rounded-xl font-bold mt-auto hover:bg-gray-900/20 dark:hover:bg-white/20">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="glass-panel mx-4 mb-4 rounded-2xl p-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <span className="text-xl font-bold">Glass<span className="font-light">Wear</span></span>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">© 2026 Todos los derechos reservados.</p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="glass-button p-3 rounded-full hover:text-blue-600 transition-colors"><Globe className="w-5 h-5" /></a>
          <a href="#" className="glass-button p-3 rounded-full hover:text-pink-600 transition-colors"><Camera className="w-5 h-5" /></a>
          <a href="#" className="glass-button p-3 rounded-full hover:text-blue-500 transition-colors"><User className="w-5 h-5" /></a>
          <a href="#" className="glass-button p-3 rounded-full hover:text-green-500 transition-colors"><Mail className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
}
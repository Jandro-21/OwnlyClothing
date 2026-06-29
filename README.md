# OwnlyClothing 💧 — Decoupled E-Commerce & Full-Stack Simulation

OwnlyClothing es una plataforma experimental de comercio electrónico full-stack desacoplada. El proyecto nace como un **MVP/SaaS técnico de porfolio** diseñado para demostrar la integración, filtrado y sincronización de datos en tiempo real entre servicios de terceros y una pasarela de pago segura sin añadir costes innecesarios de infraestructura.

La aplicación simula de extremo a extremo la experiencia de usuario de una tienda moderna, desde la navegación por categorías autogestionadas y el diseño personalizado de prendas en un laboratorio interactivo, hasta el procesamiento del flujo de caja virtual.

---

## 🚀 Demo En Vivo & Arquitectura

*   **Frontend:** [Añade aquí tu enlace de Netlify/Vercel]
*   **Backend API:** [Añade aquí tu enlace de Render/Railway si aplica]
*   **Diseño Interfaz:** Minimalista / Glassmorphism con soporte nativo de Modo Oscuro.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** React (Vite), Tailwind CSS, Lucide Icons.
*   **Backend:** Node.js, Express.js, CORS, Dotenv.
*   **Integraciones Core:** API Externa de Printful (Proveedores POD) y SDK de Stripe (Modo Sandbox).

---

## 💡 Decisiones de Ingeniería y Desafíos Resueltos

### 1. Clasificación Dinámica de Catálogo ("Mapeo Tolerante")
**El Problema:** La API de Printful no proporciona etiquetas de categoría limpias en español para el filtrado en frontend; devuelve nombres técnicos u originales basados en el inventario base en inglés (ej: *Unisex Premium Hoodie*, *Classic Organic Tee*).
**La Solución:** Se implementó una lógica de procesamiento en el hook de carga (`useEffect`) que intercepta el payload del servidor, evalúa los identificadores mediante filtros de cadenas bilingües y normaliza los artículos inyectando una propiedad de categoría legible por la interfaz. Si un producto no coincide con los patrones clave, se aísla de forma segura en *Accesorios* para evitar layouts rotos.

### 2. Sandbox de Stripe a Prueba de Balas (Conversión de Divisas)
Stripe exige de forma estricta que los precios se procesen como enteros equivalentes a céntimos (`unit_amount`). Para evitar errores de tipo `NaN` derivados de respuestas vacías o strings mal formateados por el proveedor, el endpoint del backend (`/api/create-stripe-session`) incluye una capa de desestructuración con valores de respaldo predeterminados y redondeo matemático seguro (`Math.round(price * 100)`).

### 3. Simulación Arquitectónica Eficiente (Filosofía MVP)
Para mantener el porfolio 100% funcional y de coste cero sin sacrificar la lógica comercial real:
*   **Flujo del Customizador:** El laboratorio simula la generación de productos personalizados asignando identificadores dinámicos únicos (`Date.now()`) en memoria, permitiendo que el estado global de React los procese dentro del mismo flujo de caja que los artículos estáticos del inventario.
*   **Estrategia de Producción:** Las claves privadas se aíslan por completo mediante variables de entorno (`.env`). El checkout está configurado permanentemente en **Modo Test**, permitiendo a los reclutadores simular transacciones seguras con las credenciales de prueba oficiales de Stripe.

---

## 🛠️ Instalación y Configuración Local

Si deseas clonar el repositorio y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/ownlyclothing.git](https://github.com/tu-usuario/ownlyclothing.git)

// ─── Configuración inicial ─────────────────────────────────────────────
// Cargamos las variables de entorno (API keys de Stripe y Printful)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Forzamos a Stripe a usar una versión explícita para evitar errores de entorno en Render
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' 
});

const app = express();

// Middleware global: permitir peticiones desde el frontend y entender JSON
app.use(cors());
app.use(express.json());

// ─── 1. Catálogo: traer todos los productos desde Printful ─────────────
// Printful es nuestro proveedor de print-on-demand. Aquí obtenemos
// el catálogo completo de productos que tenemos disponibles.
app.get('/api/products', async (req, res) => {
    try {
        const respuesta = await axios.get('https://api.printful.com/store/products', {
            headers: { 'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}` }
        });
        res.json(respuesta.data.result);
    } catch (error) {
        console.error('Error al contactar con Printful:', error.message);
        res.status(500).json({ error: 'No pudimos obtener los productos de Printful' });
    }
});

// ─── 2. Pago: crear una sesión de Stripe Checkout ─────────────────────
// Recibe los productos del carrito y arma una sesión de pago segura.
// Stripe se encarga de todo: formulario de tarjeta, confirmación, etc.
app.post('/api/create-stripe-session', async (req, res) => {
    try {
        const { cartItems } = req.body;

        // Si el carrito está vacío, no tiene sentido seguir
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Convertimos cada producto del carrito al formato que entiende Stripe
        const productosParaStripe = cartItems.map(item => {
            // El carrito ahora usa { key, producto, cantidad }
            const prod = item.producto || item;
            const cantidad = item.cantidad || 1;

            // Si por algún motivo no hay precio, ponemos 20€ por defecto
            const precio = parseFloat(prod.retail_price) || 20.00;

            const datosProducto = {
                name: prod.name || 'Prenda de OwnlyClothing',
            };

            // La imagen es opcional, pero si la tiene la incluimos
            if (prod.thumbnail_url) {
                datosProducto.images = [prod.thumbnail_url];
            }

            return {
                price_data: {
                    currency: 'eur',
                    product_data: datosProducto,
                    unit_amount: Math.round(precio * 100), // Stripe trabaja en céntimos
                },
                quantity: cantidad,
            };
        });

        // Creamos la sesión de pago en Stripe apuntando a producción
        const sesion = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: productosParaStripe,
            mode: 'payment',
            success_url: 'https://ownly-clothing.vercel.app/success',
            cancel_url: 'https://ownly-clothing.vercel.app/cancel',
        });

        // Devolvemos la URL para que el frontend redirija al usuario
        res.json({ url: sesion.url });
    } catch (error) {
        // Cualquier error de Stripe se imprime aquí con todo detalle
        console.error('Error devuelto por Stripe:', error.message);
        res.status(500).json({ error: 'Error al iniciar el pago con Stripe' });
    }
});

// ─── 3. Personalización: guardar un diseño hecho por el usuario ────────
// Recibe los datos del diseño personalizado y devuelve un producto simulado
// para que el frontend lo añada al carrito.
app.post('/api/create-custom-product', async (req, res) => {
    const { type, text, color } = req.body;
    console.log('Diseño personalizado recibido:', { type, text, color });

    const precios = { camiseta: '25.00', sudadera: '45.00', gorra: '20.00' };
    const precio = precios[type] || '25.00';

    res.json({
        success: true,
        product: {
            id: `custom_${Date.now()}`,
            name: `${
                { camiseta: 'Camiseta', sudadera: 'Sudadera', gorra: 'Gorra' }[type] || 'Prenda'
            } personalizada — "${text}"`,
            retail_price: precio,
            thumbnail_url: `https://placehold.co/200x200/${(color || '6d28d9').replace('#', '')}/${
                color === '#ffffff' ? '333' : 'fff'
            }?text=${encodeURIComponent(text || 'Ownly')}`,
        }
    });
});

// ─── Arrancar el servidor ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
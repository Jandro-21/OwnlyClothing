require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// 1. Endpoint: Obtener productos de Printful
app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get('https://api.printful.com/store/products', {
            headers: { 'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}` }
        });
        res.json(response.data.result);
    } catch (error) {
        console.error("Error en Printful API:", error.message);
        res.status(500).json({ error: "Error al contactar con Printful" });
    }
});

// 2. Endpoint: Generar Sesión de Pago en Stripe
app.post('/api/create-stripe-session', async (req, res) => {
    try {
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        const lineItems = cartItems.map(item => {
            // 1. Protección del precio: Si no hay precio, ponemos 20€ por defecto
            const price = parseFloat(item.retail_price) || 20.00;
            
            // 2. Protección de la imagen
            const productData = {
                name: item.name || 'Prenda de OwnlyClothing',
            };
            if (item.thumbnail_url) {
                productData.images = [item.thumbnail_url];
            }

            return {
                price_data: {
                    currency: 'eur',
                    product_data: productData,
                    unit_amount: Math.round(price * 100), 
                },
                quantity: 1,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        res.json({ url: session.url });
    } catch (error) {
        // Esto imprimirá en la consola de Node el error EXACTO que da Stripe
        console.error("Error devuelto por Stripe:", error.message);
        res.status(500).json({ error: "Error al iniciar el pago con Stripe" });
    }
});

// 3. Endpoint: Producto personalizado (placeholder)
app.post('/api/create-custom-product', async (req, res) => {
    console.log("Personalización recibida:", req.body);
    res.json({ success: true, message: "Recibido en servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
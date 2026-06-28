# 💧 OwnlyClothing — Pasarela de Pago & Print-on-Demand

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://ownly-clothing.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-E114E5?style=for-the-badge&logo=render)](https://ownlyclothing.onrender.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)

> ⚠️ **Nota para curiosos:** Esto es un proyecto de portafolio y simulación. Las compras no son reales, ¡así que no intentes renovar tu armario aquí! 😉

---

## 🚀 La Historia Detrás del Despliegue (O cómo sobreviví a CORS)

Cualquiera puede hacer una aplicación funcional en `localhost:3000`... El verdadero reto empieza cuando decides lanzarla al mundo real. 

Este proyecto nació como una tienda fullstack de ropa personalizada conectada a la API de **Printful** y procesada mediante **Stripe Checkout**. Todo marchaba de maravilla en mi entorno local, hasta que llegó el momento de hostear gratis en la nube. Durante el despliegue me enfrenté a los villanos más clásicos del desarrollo web:
* 🛑 **El muro de CORS:** El navegador bloqueando peticiones porque el Frontend (Vercel) intentaba hablar en secreto con una máquina fantasma (`localhost`).
* 🔑 **El misterio de las API Keys:** Stripe quejándose en producción de que no encontraba sus credenciales debido a variables de entorno mal mapeadas en la nube.
* 💤 **El "servidor dormilón":** Aprender a lidiar con la capa gratuita de Render y sus arranques en frío de 50 segundos tras periodos de inactividad.

Hoy, la app está completamente **viva, conectada y sincronizada** en producción. 🚀

---

## 🛠️ El Stack Tecnológico (Separación de Poderes)

Para mantener este proyecto 100% gratuito y eficiente, dividí la arquitectura de la siguiente manera:

* **Frontend (React + Vite + Tailwind):** Desplegado en **Vercel**. Se compila a archivos estáticos ultrarrápidos y se sirve globalmente.
* **Backend (Node.js + Express):** Alojado en **Render**. Es una API REST clásica encargada de interactuar de forma segura con los proveedores externos. No requiere base de datos persistente ya que delega el catálogo y los pagos.

---

## 🔌 Integraciones Clave

1. **Printful API:** Conexión directa en el backend para obtener el catálogo de productos disponibles en tiempo real.
2. **Stripe Checkout:** Generación dinámica de sesiones de pago seguras (`/api/create-stripe-session`) enviando los céntimos calculados del carrito y redirigiendo al usuario a la pasarela oficial de Stripe.

---



ownly-clothing-j9yz2lcau.vercel.app

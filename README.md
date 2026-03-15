# HerStyleBox - Girls Clothing E-Commerce Platform

A minimalistic, self-service e-commerce platform for girls' clothing with an intuitive admin panel for inventory management.

## Features

- 🛍️ Beautiful product catalog with minimalistic design
- 📸 Easy image upload for products
- 💰 Simple pricing management
- 🛒 Shopping cart functionality
- 👔 Admin panel for non-technical users
- 📱 Responsive design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. (Optional) Copy env example and set your admin password and WhatsApp number:
```bash
cp .env.example .env
# Edit .env: set ADMIN_PASSWORD and NEXT_PUBLIC_WHATSAPP_NUMBER
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Access

Navigate to `/admin` and log in with your password. Default password is `herstylebox2024` if `ADMIN_PASSWORD` is not set. After login you can:
- Add new products
- Upload product images
- Set prices
- Manage inventory
- Edit or delete products

## WhatsApp Orders

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env` (e.g. `919876543210` for India). Customers can click "Order via WhatsApp" in the cart to open WhatsApp with their order summary pre-filled.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- File-based storage (can be upgraded to database)

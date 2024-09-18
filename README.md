# How to run the project

Copy backend/.env.example to backend/.env and modify it

```bash
cd backend
npm install
npm run develop
```


Create .env file in frontend

```
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=YOUR_STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_URL=http://localhost:3000
```


In another terminal

```bash
cd frontend
npm install
npm run dev
```

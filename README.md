# How to run the project

Copy backend/.env.example to backend/.env and modify it

```bash
cd backend
npm install
npm run develop
```


In another terminal

copy frontend/.env.example to frontend/.env and modify it

You can get the stripe keys from [the stripe dashboard](https://dashboard.stripe.com/test/apikeys)

```bash
cd frontend
npm install
npm run dev
```

Then configure the role permission for both Authenticated and Public role in the Strapi admin panel for the following models:

- Course
- Lecture
- Section
- Cart
- User
- Course Progress
- Rating

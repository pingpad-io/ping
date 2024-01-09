# Local Setup

To contribute you will first need to fork the repo and make some adjustments to
get it up and running on your local machine. Below are the steps to follow for you to get Ping to run on your local machine.

### 1. Create a `.env` file

Copy the provided `.env.example` file to `.env`.

```
cp .env.example .env
```

and then fill in the required values, as described in the comments

### 2 Configure your database

You can either use Supabase or a local Docker container to run your database.

### 2.1 Remote Database (using Supabase)

After creating an account and creating a database using the steps above:

1. Create a new project on supabase
2. Copy the `DATABASE_URL` for your `.env`

### 3. Install dependencies

Use `npm` or `bun` to install dependencies.

```
npm install
```

### 4. Push Database Schema and Seed

```
npx prisma db push 
```

Add seed script // TODO


### 5. Running the dev server

Finally, you can run the dev server:

```
npm run dev
```

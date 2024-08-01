# Workflo - Task Management App

## Features

- User authentication (with Email and Password)
- Task management using Context API (CRUD operations)
- Drag and drop tasks between statuses
- Search tasks across statuses

## Tech stack

- Frontend: Next.js with ;atest features like Server Actions and React Server Components
- Styling: Tailwind CSS
- Backend: PostgreSQL (Aiven) with Prisma ORM
- Others: Lucia Auth, Shadcn UI

## Setup Instructions

1. Clone the repository:

   ```sh
   git clone https://github.com/neerrrajj/workflo.git
   ```

2. Navigate to the project directory:

   ```sh
   cd workflo
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Set up your environment variables. Create a `.env` file in the root directory of your project and add the following:

   ```plaintext
   DATABASE_URL=your_postgres_database_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Usage

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

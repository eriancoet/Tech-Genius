# HR Administration System

This is a Next.js application built with TypeScript, tRPC, and NextAuth.js, designed as an HR Administration System. It includes functionalities for managing employees and departments, with role-based access control.

## Features

- **User Authentication**: Secure sign-in with NextAuth.js.
- **Employee Management**: Create, view, edit, and list employees.
- **Department Management**: Create, view, edit, and list departments.
- **Role-Based Access Control**: Different access levels for Super Users, Managers, and Employees.
- **Responsive Design**: User interfaces are designed to be responsive and user-friendly.

## Technologies Used

- **Next.js**: Framework for building the React application.
- **TypeScript**: Superset of JavaScript for type safety.
- **tRPC**: Type-safe API routes.
- **NextAuth.js**: Authentication library for Next.js.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Prisma**: ORM for database access.
- **SQLite**: Lightweight database used for this project.

## Setup

### Prerequisites

Ensure you have Node.js and npm installed. If not, download and install them from [nodejs.org](https://nodejs.org/).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

2. **Install dependencies:**

```bash
npm install
```
3. **Set up environment variables:**

Create an .env file in the root directory and add the necessary environment variables. Example:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
DATABASE_URL="file:./dev.db"
```
4. **Set up the database:**

Run the Prisma migration to set up the database schema:
```bash
npx prisma migrate dev
```
5. **Run create-user script :**
```bash
npm run create-user
```
6. **Start the development server:**

Start the development server:
```bash
npm run dev
```
Open your browser and navigate to http://localhost:3000.

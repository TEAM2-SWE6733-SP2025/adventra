# Adventra App

Welcome to the **Adventra App**! This guide will help you set up the project and understand how to use its key technologies.

## 🛠 Tech Stack

- **Next.js** – React framework for SSR & SSG
- **React.js** – Frontend UI library
- **TailwindCSS** – Utility-first CSS framework
- **PostgreSQL** – Relational database
- **Prisma** – ORM for database interactions
- **Cypress** – End-to-end testing framework
- **Jest** – Unit testing framework

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/TEAM2-SWE6733-SP2025/adventra
```

### 2️⃣ Install Dependencies

```sh
npm install  # or yarn install
```

### 3️⃣ Setup Environment Variables

Create a **.env.local** file in the root directory and add:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/adventra_db
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> ⚠️ Replace `user`, `password`, and `adventra_db` with your actual PostgreSQL credentials.

### 4️⃣ Start the PostgreSQL Database

Ensure you have **PostgreSQL** installed and running.

```sh
# Start PostgreSQL (if using Docker)
docker-compose up -d
```

Or manually start your local PostgreSQL instance.

### 5️⃣ Run Database Migrations

```sh
npx prisma migrate dev --name init
```

### 6️⃣ Start the Development Server

```sh
npm run dev  # or yarn dev
```

Your app will be available at **[http://localhost:3000](http://localhost:3000)** 🚀

---

## 🖌 Styling with TailwindCSS

Tailwind is already configured. Use utility classes like:

```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
  Click Me
</button>
```

You can customize styles in **tailwind.config.js**.

---

## 🛢 Database with Prisma & PostgreSQL

- Define models in **prisma/schema.prisma**
- Run migrations after updating schema:
  ```sh
  npx prisma migrate dev --name update_schema
  ```
- Use Prisma in your Next.js API routes:

  ```js
  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient();
  export default async function handler(req, res) {
    const users = await prisma.user.findMany();
    res.json(users);
  }
  ```

---

## 🧪 Testing

### Unit Testing with Jest

Jest is used for unit tests. Run tests with:

```sh
npm run test  # or yarn test
```

#### Writing a Unit Test Example:

Create a test file **Button.test.js** in the `__tests__` folder:

```js
import { render, screen } from "@testing-library/react";
import Button from "../components/Button";

test("renders the button correctly", () => {
  render(<Button label="Click Me" />);
  expect(screen.getByText("Click Me")).toBeInTheDocument();
});
```

### End-to-End Testing with Cypress

Run Cypress Tests:

```sh
npx cypress open  # Opens Cypress UI
npx cypress run   # Runs tests in headless mode
```

Tests are located in **cypress/e2e/**.

---

## ✅ Additional Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start development server             |
| `npm run build`     | Build for production                 |
| `npm run start`     | Start production server              |
| `npx prisma studio` | Open Prisma Studio for DB management |
| `npx cypress open`  | Open Cypress test runner             |
| `npm run test`      | Run unit tests with Jest             |

---

## 📜 CONTRIBUTING

If you’d like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push the branch (`git push origin feature-branch`).
5. Open a pull request.

---

## 📬 Need Help?

If you run into any issues, feel free to open an issue on GitHub or contact the team.

Happy coding! 🎉

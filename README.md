Student Management System
A full-stack Student Management System built with Node.js, Express.js, PostgreSQL, and React (Vite). It provides a REST API for managing student records and a browser-based interface for registering, viewing, searching, editing, deleting, and exporting student details.
Features
Create a student record
View all students
View one student by ID
Update a student record
Delete a student record
Validate required fields, age, and email
Return structured JSON responses and appropriate HTTP status codes
React frontend with student registration and management table
Search students by name
Download student details as CSV
Technology stack
Backend: Node.js and Express.js
Database: PostgreSQL
Database client: pg
Frontend: React and Vite
HTTP client: Axios (if used by the frontend)
Project structure
The structure below is a guide. Keep the names that match your actual project:
Student-Management-API/
├── db.js
├── server.js
├── routes/
│   └── students.js
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
Requirements
Node.js and npm
PostgreSQL
A PostgreSQL database for the project
Database setup
Create a PostgreSQL database, for example:
CREATE DATABASE student_management;
Connect to that database and create the students table:
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0),
    course VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL
);
If your existing table already exists, do not create it again. Confirm that its columns are id, name, age, course, and email.
Environment variables
Create a .env file in the backend root directory. Use your own PostgreSQL credentials:
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=student_management
DB_PASSWORD=your_postgres_password
DB_PORT=5432
PORT=5000
The variable names must match those read by your db.js and server.js. If your code uses different names, update this example to match it. Never commit .env or real passwords to GitHub.
Install and run the backend
From the backend project directory:
npm install
npm start
If your package.json does not yet contain a start script, add:
"scripts": {
  "start": "node server.js"
}
The backend base URL is determined by the port configured in server.js. The examples in this repository's API documentation use http://localhost:5000; change 5000 if your server uses another port.
Run the React frontend
Open a second terminal:
cd frontend
npm install
npm run dev
Open the Vite URL shown in the terminal, commonly http://localhost:5173.
Make sure the frontend's Axios/base URL points to the backend, not to the Vite frontend port. If the frontend and backend use different origins, configure CORS in Express.
API overview
All student endpoints use the /api/students route prefix.
Method   Endpoint              Description
GET      /api/students       Get all students GET      /api/students/:id   Get one student by ID POST     /api/students       Add a student PUT      /api/students/:id   Update a student DELETE   /api/students/:id   Delete a student
Full request examples, response examples, and status codes are in API_DOCUMENTATION.md.
Validation
The API validates that:
name, age, course, and email are provided
age is a positive whole number
email has a valid basic email format
Testing
You can test the endpoints with Postman, Thunder Client, or curl. Start the backend and database first. Example:
curl http://localhost:5000/api/students
Use the actual backend port if it is not 5000.
GitHub
Before pushing the project, check that .env, node_modules/, and build output folders are excluded by .gitignore.
node_modules/
.env
dist/
Author
Add your name and project details here.
License
Add a license if you intend to distribute this project publicly.
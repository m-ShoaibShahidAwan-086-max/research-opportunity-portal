# University Research Opportunity Portal

A web application for managing research opportunities. Faculty members can create, view, update, close, and delete research opportunities.

**GitHub Repository:** https://github.com/m-ShoaibShahidAwan-086-max/research-opportunity-portal

## Technologies

- Backend: Node.js, Express
- Database: MySQL
- Frontend: HTML, CSS, JavaScript, Bootstrap

## Project Structure

```
backend/     Express REST API
frontend/    Web page (served by the backend)
database/    schema.sql (database setup)
postman/     Exported Postman collection
```

## Setup Instructions

1. Install Node.js and MySQL.
2. Create the database and table:
```
   mysql -u root -p < database/schema.sql
```
   Also create a MySQL user, or use your own user in the next step.
3. Go to the backend folder and install packages:
```
   cd backend
   npm install
```
4. Copy `.env.example` to `.env` and fill in your MySQL details:
```
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_password
   DB_NAME=research_portal
   PORT=3000
```
5. Start the server:
```
   node server.js
```
6. Open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/opportunities | Create an opportunity |
| GET | /api/opportunities | Get all opportunities |
| GET | /api/opportunities/:id | Get one opportunity |
| PUT | /api/opportunities/:id | Update an opportunity (also used to close it) |
| DELETE | /api/opportunities/:id | Delete an opportunity |

## Status Codes

200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Server Error

## Testing

The exported Postman collection is in the `postman` folder.

## Author

Name: Muhammad Shoaib Shahid
Reg. No: 24p-0571
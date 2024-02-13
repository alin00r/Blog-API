# Blog-API
  
## Introduction 🌟
Secure Blog REST API using NodeJS + Express + JWT + Mongoose

## Technologies 🚀

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- sharp
- Multer

## Features ✨

- [x] User Authentication: Allow users to sign up and log in.
- [x] Profile Management: Users can update their profile details and change their password.
- [x] Blog Management: Implement CRUD operations for Blogs.
- [x] File Upload: Allow users to upload a profile picture/avatar.
- [x] Documentation: Provide setup instructions and API documentation.


## Setting Up Your Local Environment

Follow these steps to set up your local environment for the Natours app:

1. **Clone the Repository:**
   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/alin00r/Blog-API.git
   cd Blog-API
   ```
2. **Install Dependencies:**
   Run the following command to install all the required dependencies:
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**

   Before you can run the Blog-API app, you need to set up your environment variables. These variables store sensitive information required for the app to function properly. Follow these steps to configure your environment variables:

   1. **Create a `.env` File:**
      In the root directory of the app, create a file named `.env`.

   2. **Add the Following Environment Variables:**
      Replace the placeholders with your actual information. You might need to sign up for accounts and services to obtain the required credentials.

      ```dotenv

      # MongoDB Configuration
      MONGO_URI=your-mongodb-database-url

      # JSON Web Token Configuration
      JWT_SECRET=your-json-web-token-secret

      ```
# Endpoints
## Auth Endpoints

```POST``` ```/users/signup```

```POST``` ```/users/login```

```POST``` ```/users/logout```

```POST``` ```/users/logoutAll```

## Users Endpoints

```GET``` ```/users/me```

```DELETE``` ```/users/me```

```PATCH``` ```/users/me```

```GET``` ```/users/:id/avatar```

```POST``` ```/upload/me/avatar```

```DELETE``` ```/upload/me/avatar```

```GET``` ``` /users/:username```

## Blog Endpoints

```POST``` ```/search```

```POST``` ```/blog```

```GET``` ```/blogs```

```GET``` ```/blogs/:id```

```PATCH``` ```/blogs/:id```

```DELETE``` ```/blogs/:id```



# API reference

During API development, I use `Postman` for handling/testing all endpoints.

- Postman collection/documentation is available on this link [click here](https://documenter.getpostman.com/view/28708948/2sA2r53QcQ)
- Base URL endpoints: `http://127.0.0.1:8000/` or `http://localhost:8000/`



- [Ali Nour](https://github.com/alin00r)

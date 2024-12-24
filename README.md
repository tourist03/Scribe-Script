# ScribeSpace

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Notes](#notes)
- [Models](#models)
  - [User Model](#user-model)
  - [Note Model](#note-model)
- [Getting Started](#getting-started)
- [License](#license)

## Overview

ScribeSpace is a versatile cloud-based platform designed for seamless writing and drawing, enabling creativity and productivity anytime, anywhere. This API serves as the backend for the ScribeSpace application, allowing users to manage their notes securely.

## Features

- **User Authentication**: Users can create accounts, log in, and manage their sessions securely using JSON Web Tokens (JWT).
- **Note Management**: Users can create, read, update, and delete notes. Each note can have a title, description, and tags for better organization.
- **Secure Storage**: All user data is securely stored in a MongoDB database, ensuring privacy and protection.
- **User Accounts**: Each user can create an account to sync their notes across devices.

## API Endpoints

### Authentication

- **POST** `/api/auth/createuser`
  - Create a new user account.
  - **Request Body**: 
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123"
    }
    ```

- **POST** `/api/auth/login`
  - Authenticate a user and return a JWT token.
  - **Request Body**: 
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

- **POST** `/api/auth/getuser`
  - Retrieve the logged-in user's details. (Requires authentication)

### Notes

- **GET** `/api/notes/fetchallnotes`
  - Fetch all notes for the logged-in user. (Requires authentication)

- **POST** `/api/notes/addnote`
  - Add a new note for the logged-in user.
  - **Request Body**: 
    ```json
    {
      "title": "Note Title",
      "description": "Note Description",
      "tag": "General"
    }
    ```

- **PUT** `/api/notes/updatenote/:id`
  - Update an existing note by ID. (Requires authentication)
  - **Request Body**: 
    ```json
    {
      "title": "Updated Title",
      "description": "Updated Description",
      "tag": "Updated Tag"
    }
    ```

- **DELETE** `/api/notes/deletenote/:id`
  - Delete a note by ID. (Requires authentication)

## Models

### User Model

The User model defines the structure of user data in the database.

```javascript
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
```

### Note Model

The Note model defines the structure of note data in the database.

```javascript
const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    }
});
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   node index.js
   ```

5. The API will be running on `http://localhost:5001`.

## License

This project is licensed under the MIT License.

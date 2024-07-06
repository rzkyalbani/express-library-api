
# Experss Library API

Library Management API adalah sebuah API RESTful yang dikembangkan menggunakan Express.js dan beberapa library javascript lainnya seperti dotenv, mysql2, dan sequelize untuk mengelola data buku, penulis, peminjam, dan catatan peminjaman di sebuah perpustakaan. API ini memungkinkan pengguna untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada entitas buku, penulis, dan peminjam, serta mencatat peminjaman dan pengembalian buku.




## API Reference

### Books Endpoint
#### Add a Book

```http
  POST /api/books
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `title` | `string` | **Required**. Title of the book    |
|  `authorId` | `number` | **Required**. ID of the author    |
|  `publishedDate` | `string` | **Required**. Published date of the book    |
|  `isbn` | `string` | **Required**. Genre of the book  |
|  `genre` | `string` | **Required**. ID of the author    |
|  `availableCopies` | `number` | **Required**. Number of available copies   |

#### Get Books

```http
    GET /api/books
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `-`      | `-` | Retrieve a list of all books |

#### Get Book by ID

```http
    GET /api/books/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. ID of the book to fetch |

#### Update Book

```http
    PUT /api/books/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `title` | `string` | **Optional**. Title of the book    |
|  `authorId` | `number` | **Optional**. ID of the author    |
|  `publishedDate` | `string` | **Optional**. Published date of the book    |
|  `isbn` | `string` | **Optional**. Genre of the book  |
|  `genre` | `string` | **Optional**. ID of the author    |
|  `availableCopies` | `number` | **Optional**. Number of available copies   |


#### Delete Book

```http
    DELETE /api/books/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. ID of the book to delete |

## 

### Authors Endpoint
### Add an Author

```http
  POST /api/authors
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `name` | `string` | **Required**. Name of the author   |
|  `bio` | `string` | **Optional**. Biography of the author   |

### Get Authors

```http
  GET /api/authors
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `-` | `-` |Retrieve a list of all authors|

### Get Author by ID

```http
   GET /api/authors/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `id` | `number` | **Required**. ID of the author to fetch |

### Update Author

```http
   PUT /api/authors/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `name` | `string` | **Optional**. Name of the author   |
|  `bio` | `string` | **Optional**. Biography of the author   |


#### Delete Author

```http
    DELETE /api/authors/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. ID of the author to delete |

## 

### Borrowers Endpoint
### Add a Borrower

```http
  POST /api/borrowers
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `name` | `string` | **Required**. Name of the borrower   |
|  `email` | `string` | **Required**. Email of the Borrower   |

#### Get Borrowers

```http
    GET /api/borrowers
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `-`      | `-` | Retrieve a list of all Borrowers |

### Get Borrower by ID

```http
   GET /api/borrowers/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `id` | `number` | **Required**. ID of the Borrower to fetch |

### Update Borrower

```http
   PUT /api/borrowers/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `name` | `string` | **Optional**. Name of the Borrower   |
|  `email` | `string` | **Optional**. Email of the Borrower   |

#### Delete Borrower

```http
    DELETE /api/borrowers/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. ID of the Borrower to delete |

## 

### Borrowing Records Endpoint
### Record a Book Borrowing

```http
  POST /api/borrowing-records
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `bookId` | `number` | **Required**. ID of the book  |
|  `borrowingId` | `number` | **Required**. ID of the borrower   |
|  `borrowDate` | `string` | **Required**. Date of borrowing |
|  `returnDate` | `string` | **Required**. Date of return |
|  `status` | `string` | **Required**. Status (Borrowed or Returned) |

### Record a Book Return

```http
  PUT /api/borrowing-records/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `id` | `number` | **Required**. ID of the borrowing record to update|
|  `returnDate` | `string` | **Required**. Date of return |
|  `status` | `string` | **Required**. Status (Borrowed or Returned) |

#### Get Borrowing Records

```http
    GET /api/borrowing-records
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `-`      | `-` | Retrieve a list of all borrowing records |

#### Get Borrowing Records by ID

```http
    GET /api/borrowing-records/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. ID of the borrowing record to fetch |

## Installation

Install my-project with npm

```bash
  git clone https://github.com/rzkyalbani/express-library-api.git

  cd express-library-api

  npm install 
  npm run dev
```
    

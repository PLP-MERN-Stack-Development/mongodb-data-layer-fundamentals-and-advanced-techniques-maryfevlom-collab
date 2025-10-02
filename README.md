# 📚 PLP MongoDB Bookstore Assignment

## 👤 Student Information

- **Name:** [ Mawunyo Mary Fevlo]
- **Course:** PLP - Power Learn Project
- **Assignment:** MongoDB Fundamentals
- **Date:** October 2025

## 📋 Project Overview

This project demonstrates MongoDB fundamentals including database setup, CRUD operations, advanced querying, aggregation pipelines, and indexing for performance optimization using MongoDB Atlas cloud database.

-----

## 🗄️ Database Information

### Connection Details

- **Platform:** MongoDB Atlas (Cloud)
- **Database Name:** `plp_bookstore`
- **Collection Name:** `books`
- **Initial Documents:** 48 books
- **Final Documents:** 47 (after deletion task)

### Document Schema

Each book document contains the following fields:

```javascript
{
  title: String,           // Book title
  author: String,          // Author name
  genre: String,           // Book genre/category
  published_year: Number,  // Year of publication
  price: Number,           // Price in USD
  in_stock: Boolean,       // Stock availability
  pages: Number,           // Number of pages
  publisher: String        // Publisher name
}
```

-----

## 📂 Project Structure

```
plp-mongodb-bookstore/
│
├── books.json              # Data file with 48 book documents
├── queries.js              # All MongoDB queries (Tasks 2-5)
├── README.md               # This documentation file
└── screenshots/            # Screenshots folder
    ├── 01_database_setup.png
    ├── 02_documents_view.png
    ├── 03_crud_operations.png
    ├── 04_advanced_queries.png
    ├── 05_aggregation_results.png
    ├── 06_indexes.png
    └── 07_explain_output.png
```

-----

## ✅ Tasks Completed

### ✓ Task 1: MongoDB Setup

**Status:** ✅ Complete

- [x] Created MongoDB Atlas free tier account
- [x] Set up cluster and database access
- [x] Configured network access
- [x] Connected using MongoDB Compass
- [x] Created `plp_bookstore` database
- [x] Created `books` collection
- [x] Imported 48 book documents from JSON file

**Tools Used:**

- MongoDB Atlas (Cloud Database)
- MongoDB Compass (GUI Client)

-----

### ✓ Task 2: Basic CRUD Operations

**Status:** ✅ Complete

All CRUD operations were successfully performed:

#### **CREATE**

- ✅ Inserted 48 books using JSON import in MongoDB Compass
- All books contain required fields (title, author, genre, published_year, price, in_stock, pages, publisher)

#### **READ**

- ✅ Find books by genre: `db.books.find({ genre: "Fiction" })`
- ✅ Find books after 2010: `db.books.find({ published_year: { $gt: 2010 } })`
- ✅ Find books by author: `db.books.find({ author: "George Orwell" })`

#### **UPDATE**

- ✅ Updated price of “1984” from $13.99 to $15.99
- Query: `db.books.updateOne({ title: "1984" }, { $set: { price: 15.99 } })`
- Result: `{ acknowledged: true, modifiedCount: 1 }`

#### **DELETE**

- ✅ Deleted “The Da Vinci Code” by title
- Query: `db.books.deleteOne({ title: "The Da Vinci Code" })`
- Result: `{ acknowledged: true, deletedCount: 1 }`
- Final count: 47 documents

**See screenshots:** `03_crud_operations.png`

-----

### ✓ Task 3: Advanced Queries

**Status:** ✅ Complete

#### **1. Combined Filtering**

✅ Found books that are BOTH in stock AND published after 2010

```javascript
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })
```

#### **2. Projection**

✅ Returned only specific fields (title, author, price) excluding _id

```javascript
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
```

#### **3. Sorting**

✅ **Ascending** (cheapest first):

```javascript
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 })
```

✅ **Descending** (most expensive first):

```javascript
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 })
```

#### **4. Pagination**

✅ Implemented pagination with 5 books per page using `limit()` and `skip()`

**Page 1:**

```javascript
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).limit(5)
```

**Page 2:**

```javascript
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).skip(5).limit(5)
```

**Page 3:**

```javascript
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).skip(10).limit(5)
```

**See screenshots:** `04_advanced_queries.png`

-----

### ✓ Task 4: Aggregation Pipeline

**Status:** ✅ Complete

#### **1. Average Price by Genre**

✅ Grouped books by genre and calculated statistics

```javascript
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      totalBooks: { $sum: 1 }
    }
  },
  { $sort: { averagePrice: -1 } }
])
```

**Results:**

- Identified which genres are most/least expensive
- Counted books per genre
- Sorted by average price

#### **2. Author with Most Books**

✅ Found the author with the highest number of books in collection

```javascript
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 },
      books: { $push: "$title" }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
])
```

**Result:**

- Listed all books by each author
- Ranked authors by number of books
- Identified top author

#### **3. Books by Publication Decade**

✅ Grouped books by decade and counted them

```javascript
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 },
      books: { $push: { title: "$title", year: "$published_year" } }
    }
  },
  { $sort: { _id: 1 } }
])
```

**Results:**

- Books span from 1810s to 2010s
- Identified most popular publication decades
- Showed distribution of books over time

**See screenshots:** `05_aggregation_results.png`

-----

### ✓ Task 5: Indexing

**Status:** ✅ Complete

#### **Indexes Created**

**1. Single-Field Index on Title**

```javascript
db.books.createIndex({ title: 1 })
```

- Purpose: Fast lookups by book title
- Type: Ascending index

**2. Compound Index on Author and Published Year**

```javascript
db.books.createIndex({ author: 1, published_year: -1 })
```

- Purpose: Efficient queries on author and publication year
- Types: Ascending on author, Descending on published_year

**3. Additional Index on Price**

```javascript
db.books.createIndex({ price: 1 })
```

- Purpose: Fast price range queries
- Type: Ascending index

#### **Performance Analysis**

Used `explain("executionStats")` to demonstrate performance improvements:

**Test 1: Title Index**

```javascript
db.books.find({ title: "1984" }).explain("executionStats")
```

- **Result:** Uses IXSCAN (Index Scan)
- **Documents Examined:** 1 (only the matching document)
- **Performance:** Fast lookup

**Test 2: Compound Index**

```javascript
db.books.find({ 
  author: "George Orwell",
  published_year: { $gte: 1940 } 
}).explain("executionStats")
```

- **Result:** Uses compound index
- **Performance:** Efficient filtering on both fields

**Test 3: Non-Indexed Field (Comparison)**

```javascript
db.books.find({ pages: { $gt: 300 } }).explain("executionStats")
```

- **Result:** Uses COLLSCAN (Collection Scan)
- **Documents Examined:** All 47 documents
- **Performance:** Slower (must scan entire collection)

#### **Key Observations:**

- ✅ Indexed queries use **IXSCAN** (Index Scan)
- ✅ Non-indexed queries use **COLLSCAN** (Collection Scan)
- ✅ Indexed queries examine **fewer documents**
- ✅ **Significant performance improvement** with indexes

**See screenshots:** `06_indexes.png`, `07_explain_output.png`

-----

## 🚀 How to Run This Project

### Prerequisites

- MongoDB Atlas account (free tier)
- MongoDB Compass installed
- Internet connection

### Step 1: Set Up MongoDB Atlas

1. Create account at https://www.mongodb.com/cloud/atlas
1. Create a free M0 cluster
1. Set up database user and password
1. Configure network access (allow from anywhere or your IP)
1. Get connection string

### Step 2: Connect with MongoDB Compass

1. Open MongoDB Compass
1. Paste your Atlas connection string
1. Replace `<password>` with your actual password
1. Click “Connect”

### Step 3: Create Database and Import Data

1. Create database: `plp_bookstore`
1. Create collection: `books`
1. Import `books.json` file (ADD DATA → Import JSON)

### Step 4: Run Queries

1. Open MongoSH tab in Compass (bottom of window)
1. Run queries from `queries.js` file
1. Observe results and take screenshots

-----

## 📊 Sample Query Results

### Books by Genre

- **Fiction:** 5 books
- **Fantasy:** 2 books
- **Biography:** 2 books
- **Thriller:** 2 books
- **Romance:** 1 book
- **Dystopian:** 1 book
- **Self-Help:** 1 book
- **Non-Fiction:** 1 book

### Price Range

- **Cheapest:** $9.99 (Pride and Prejudice)
- **Most Expensive:** $19.99 (Becoming by Michelle Obama)
- **Average Price:** ~$14.50

### Publication Years

- **Oldest:** 1813 (Pride and Prejudice)
- **Newest:** 2019 (The Silent Patient)
- **Most Popular Decade:** 2010s (7 books)

-----

## 🎯 Learning Outcomes

Through this assignment, I have learned:

✅ **MongoDB Setup and Configuration**

- Creating and configuring MongoDB Atlas clusters
- Setting up database access and network security
- Connecting clients to cloud databases

✅ **CRUD Operations**

- Creating documents with insertMany()
- Reading documents with find() and various filters
- Updating documents with updateOne() and $set
- Deleting documents with deleteOne()

✅ **Advanced Query Techniques**

- Combining multiple filter conditions with logical operators
- Using projection to return specific fields
- Sorting results in ascending and descending order
- Implementing pagination with limit() and skip()

✅ **Aggregation Framework**

- Using $group to aggregate data
- Calculating statistics ($avg, $sum, $min, $max)
- Using $addFields to create computed fields
- Building multi-stage aggregation pipelines
- Sorting and limiting aggregation results

✅ **Performance Optimization**

- Creating single-field and compound indexes
- Understanding index types (ascending/descending)
- Using explain() to analyze query performance
- Recognizing the difference between IXSCAN and COLLSCAN
- Understanding when indexes improve performance

✅ **Best Practices**

- Proper database and collection naming
- Document schema design
- Query optimization
- Performance monitoring

-----

## 🔧 Tools and Technologies Used

- **Database:** MongoDB Atlas (Cloud)
- **Client Tool:** MongoDB Compass
- **Query Language:** MongoDB Query Language (MQL)
- **Data Format:** JSON
- **Version Control:** Git & GitHub

-----

## 📸 Screenshots

All screenshots are located in the `screenshots/` folder:

1. **01_database_setup.png** - MongoDB Atlas cluster and database
1. **02_documents_view.png** - Books collection with 48 documents
1. **03_crud_operations.png** - CRUD operation results
1. **04_advanced_queries.png** - Advanced query results
1. **05_aggregation_results.png** - Aggregation pipeline outputs
1. **06_indexes.png** - List of created indexes
1. **07_explain_output.png** - Query execution statistics

-----

## 🐛 Troubleshooting

### Common Issues and Solutions

**Issue:** Cannot connect to MongoDB Atlas

- **Solution:** Check network access settings in Atlas, ensure IP is whitelisted

**Issue:** Authentication failed

- **Solution:** Verify username and password, check database user permissions

**Issue:** Queries return no results

- **Solution:** Verify data was imported, check filter syntax

**Issue:** Index not being used

- **Solution:** Run explain() to check query plan, ensure query matches index fields

-----

## 📚 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [MongoDB University](https://learn.mongodb.com/) - Free courses
- [Aggregation Pipeline](https://docs.mongodb.com/manual/aggregation/)
- [Indexes](https://docs.mongodb.com/manual/indexes/)

-----

## 🎓 Conclusion

This assignment provided comprehensive hands-on experience with MongoDB, covering fundamental concepts from basic CRUD operations to advanced aggregation pipelines and performance optimization through indexing. The use of MongoDB Atlas demonstrated cloud database management, while MongoDB Compass provided an intuitive interface for database operations.

All tasks were completed successfully, with proper documentation and screenshots to verify the implementation. The queries demonstrate a solid understanding of MongoDB’s querying capabilities and best practices for database operations.

-----

## 📄 License

This project is for educational purposes as part of the Power Learn Project (PLP) MongoDB fundamentals course.

-----

## 👨‍💻 Author

**[Mawunyo Mary Fevlo]**  
PLP Student  
MongoDB Assignment - October 2025

-----

**Submission Date:** [ 2nd October,2025 ]  
**Repository:** [GitHub Repository Link]

-----

## ✅ Assignment Checklist

- [x] MongoDB Atlas setup complete
- [x] Database and collection created
- [x] 48 books imported from JSON
- [x] All CRUD operations performed
- [x] Advanced queries executed
- [x] Three aggregation pipelines created
- [x] Indexes created and tested
- [x] Performance analysis with explain()
- [x] Screenshots captured
- [x] Documentation complete
- [x] Code files organized
- [x] Ready for GitHub submission

-----

**End of README**
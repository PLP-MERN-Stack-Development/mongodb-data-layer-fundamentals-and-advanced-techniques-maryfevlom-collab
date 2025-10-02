// queries.js
// MongoDB Queries for PLP Bookstore Assignment
// Student: [Mawunyo Mary Fevlo]
// Database: plp_bookstore (MongoDB Atlas)
// Collection: books
// Total Documents: 48 books initially, 47 after deletion

// ============================================
// DATABASE SETUP
// ============================================

// Switch to the plp_bookstore database
// use plp_bookstore

// Verify collection exists
// Use db.getCollectionNames() in the MongoDB shell, or db.listCollections() in Node.js if needed

// Check initial document count
db.books.countDocuments()

// ============================================
// TASK 2: BASIC CRUD OPERATIONS
// ============================================

console.log("=== TASK 2: BASIC CRUD OPERATIONS ===")

// 1. CREATE - Already done via JSON import (48 books imported)

// 2. READ - Find all books in Fiction genre
console.log("\n1. Find all books in Fiction genre:")
db.books.find({ genre: "Fiction" })

// 3. READ - Find books published after 2010
console.log("\n2. Find books published after 2010:")
db.books.find({ published_year: { $gt: 2010 } })

// Alternative: Find books published after 2015
db.books.find({ published_year: { $gt: 2015 } })

// 4. READ - Find books by specific author (George Orwell)
console.log("\n3. Find books by George Orwell:")
db.books.find({ author: "George Orwell" })

// Alternative: Find books by J.K. Rowling
db.books.find({ author: "J.K. Rowling" })

// 5. UPDATE - Update the price of “1984”
console.log("\n4. Update price of '1984' to $15.99:")
db.books.updateOne(
{ title: '1984' },
{ $set: { price: 15.99 } }
)

// Verify the update
db.books.find({ title: '1984' }, { title: 1, price: 1, _id: 0 })

// 6. DELETE - Delete “The Da Vinci Code” by title
console.log("\n5. Delete 'The Da Vinci Code':")
db.books.deleteOne({ title: 'The Da Vinci Code' })

// Verify deletion - count should be 47 now
db.books.countDocuments()

// Verify book is gone
db.books.find({ title: 'The Da Vinci Code' })

// ============================================
// TASK 3: ADVANCED QUERIES
// ============================================

console.log("\n=== TASK 3: ADVANCED QUERIES ===")

// 1. Find books that are BOTH in stock AND published after 2010
console.log("\n1. Books in stock AND published after 2010:")
db.books.find({
in_stock: true,
published_year: { $gt: 2010 }
})

// Count how many match
db.books.find({
in_stock: true,
published_year: { $gt: 2010 }
}).count()

// 2. Use PROJECTION to return only title, author, and price
console.log("\n2. All books with projection (title, author, price only):")
db.books.find(
{},
{ title: 1, author: 1, price: 1, _id: 0 }
)

// Projection with filter - Fiction books only
db.books.find(
{ genre: 'Fiction' },
{ title: 1, author: 1, price: 1, _id: 0 }
)

// 3a. SORT books by price - ASCENDING (cheapest first)
console.log("\n3a. Books sorted by price (ASCENDING - lowest to highest):")
db.books.find(
{},
{ title: 1, price: 1, _id: 0 }
).sort({ price: 1 })

// 3b. SORT books by price - DESCENDING (most expensive first)
console.log("\n3b. Books sorted by price (DESCENDING - highest to lowest):")
db.books.find(
{},
{ title: 1, price: 1, _id: 0 }
).sort({ price: -1 })

// Additional sorting - by publication year
db.books.find(
{},
{ title: 1, published_year: 1, _id: 0 }
).sort({ published_year: -1 })

// 4. PAGINATION - Implement using limit() and skip()
console.log("\n4. PAGINATION (5 books per page):")

// Page 1 - First 5 books
console.log("\nPAGE 1: Books 1-5")
db.books.find(
{},
{ title: 1, author: 1, price: 1, _id: 0 }
).limit(5)

// Page 2 - Next 5 books (skip first 5)
console.log("\nPAGE 2: Books 6-10")
db.books.find(
{},
{ title: 1, author: 1, price: 1, _id: 0 }
).skip(5).limit(5)

// Page 3 - Next 5 books (skip first 10)
console.log("\nPAGE 3: Books 11-15")
db.books.find(
{},
{ title: 1, author: 1, price: 1, _id: 0 }
).skip(10).limit(5)

// Page 4 - Remaining books
console.log("\nPAGE 4: Books 16-20")
db.books.find(
{},
{ title: 1, author: 1, price: 1, _id: 0 }
).skip(15).limit(5)

// Pagination with sorting (sorted by price)
console.log("\nPagination with sorting - Cheapest 5 books:")
db.books.find(
{},
{ title: 1, price: 1, _id: 0 }
).sort({ price: 1 }).limit(5)

// ============================================
// TASK 4: AGGREGATION PIPELINE
// ============================================

console.log("\n=== TASK 4: AGGREGATION PIPELINE ===")

// 1. Calculate AVERAGE PRICE of books by GENRE
console.log("\n1. Average price by genre:")
db.books.aggregate([
{
$group: {
_id: '$genre',
averagePrice: { $avg: '$price' },
totalBooks: { $sum: 1 },
minPrice: { $min: '$price' },
maxPrice: { $max: '$price' }
}
},
{
$sort: { averagePrice: -1 }
},
{
$project: {
genre: '$_id',
averagePrice: { $round: ['$averagePrice', 2] },
totalBooks: 1,
minPrice: 1,
maxPrice: 1,
_id: 0
}
}
])

// 2. Find the AUTHOR with the MOST books
console.log("\n2. Author with most books:")
db.books.aggregate([
{
$group: {
_id: '$author',
bookCount: { $sum: 1 },
books: { $push: '$title' },
totalValue: { $sum: '$price' }
}
},
{
$sort: { bookCount: -1 }
},
{
$limit: 1
}
])

// All authors ranked by book count
console.log("\nAll authors with book counts:")
db.books.aggregate([
{
$group: {
_id: '$author',
bookCount: { $sum: 1 },
books: { $push: '$title' }
}
},
{
$sort: { bookCount: -1 }
}
])

// 3. Group books by PUBLICATION DECADE
console.log("\n3. Books grouped by decade:")
db.books.aggregate([
{
$addFields: {
decade: {
$concat: [
{ $toString: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } },
's'
]
}
}
},
{
$group: {
_id: '$decade',
count: { $sum: 1 },
books: {
$push: {
title: '$title',
year: '$published_year',
author: '$author'
}
},
averagePrice: { $avg: '$price' }
}
},
{
$sort: { _id: 1 }
}
])

// BONUS: Additional useful aggregations

// Most expensive book per genre
console.log("\nBONUS: Most expensive book in each genre:")
db.books.aggregate([
{
$sort: { price: -1 }
},
{
$group: {
_id: '$genre',
mostExpensive: { $first: '$title' },
highestPrice: { $first: '$price' },
author: { $first: '$author' }
}
},
{
$sort: { highestPrice: -1 }
}
])

// Overall collection statistics
console.log("\nBONUS: Overall collection statistics:")
db.books.aggregate([
{
$group: {
_id: null,
totalBooks: { $sum: 1 },
averagePrice: { $avg: '$price' },
totalValue: { $sum: '$price' },
averagePages: { $avg: '$pages' },
inStockCount: { $sum: { $cond: ['$in_stock', 1, 0] } },
outOfStockCount: { $sum: { $cond: ['$in_stock', 0, 1] } }
}
},
{
$project: {
_id: 0,
totalBooks: 1,
averagePrice: { $round: ['$averagePrice', 2] },
totalValue: { $round: ['$totalValue', 2] },
averagePages: { $round: ['$averagePages', 0] },
inStockCount: 1,
outOfStockCount: 1
}
}
])

// ============================================
// TASK 5: INDEXING
// ============================================

console.log("\n=== TASK 5: INDEXING ===")

// 1. Create SINGLE-FIELD INDEX on title
console.log("\n1. Creating index on 'title' field:")
db.books.createIndex({ title: 1 })

// 2. Create COMPOUND INDEX on author and published_year
console.log("\n2. Creating compound index on 'author' and 'published_year':")
db.books.createIndex({ author: 1, published_year: -1 })

// Create additional index on price for demonstration
console.log("\n3. Creating index on 'price' field:")
db.books.createIndex({ price: 1 })

// 3. LIST all indexes
console.log("\n4. All indexes on books collection:")
db.books.getIndexes()

// 4. Use EXPLAIN() to demonstrate performance improvement

console.log("\n5. Performance Analysis with explain():")

// Test 1: Query using TITLE index
console.log("\nTest 1: Finding book by title (uses title index):")
db.books.find({
title: "1984"
}).explain('executionStats')

// Test 2: Query using COMPOUND index
console.log("\nTest 2: Finding books by author and year (uses compound index):")
db.books.find({
author: 'George Orwell',
published_year: { $gte: 1940 }
}).explain('executionStats')

// Test 3: Query using PRICE index
console.log("\nTest 3: Price range query (uses price index):")
db.books.find({
price: { $gte: 10, $lte: 15 }
}).explain('executionStats')

// Test 4: Query WITHOUT index (collection scan)
console.log("\nTest 4: Query on non-indexed field (collection scan):")
db.books.find({
pages: { $gt: 300 }
}).explain('executionStats')

// Performance comparison summary
console.log("\n=== Performance Summary ===")
console.log("Indexed queries use IXSCAN (Index Scan)")
console.log("Non-indexed queries use COLLSCAN (Collection Scan)")
console.log("Indexed queries examine fewer documents")
console.log("Compound indexes work for queries on first field or both fields")

// ============================================
// VERIFICATION QUERIES
// ============================================

console.log("\n=== FINAL VERIFICATION ===")

// Total document count (should be 47 after deletion)
console.log("\nTotal documents in collection:")
db.books.countDocuments()

// List all collections
console.log("\nCollections in database:")
console.log(db.getCollectionNames()) // For MongoDB shell
// OR for Node.js driver:
// db.listCollections().toArray().then(collections => console.log(collections));

// Sample document
console.log("\nSample document:")
db.books.findOne()

// Genres in collection
console.log("\nUnique genres:")
db.books.distinct('genre')

// Date range of publications
console.log("\nPublication year range:")
db.books.aggregate([
{
$group: {
_id: null,
oldestBook: { $min: '$published_year' },
newestBook: { $max: '$published_year' }
}
}
])

console.log("\n=== ALL TASKS COMPLETED SUCCESSFULLY ===")
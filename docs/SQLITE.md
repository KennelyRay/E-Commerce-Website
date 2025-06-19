# SQLite Database Integration

VertixHub now uses SQLite for data persistence instead of localStorage, providing a more robust and scalable data storage solution.

## Features

### 🗃️ **Client-Side SQLite Database**
- Uses `sql.js` to run SQLite in the browser
- Data persists in localStorage as binary SQLite database
- Full SQL query capabilities
- ACID transactions support

### 📊 **Database Schema**

#### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  originalPrice REAL,
  image TEXT,
  images TEXT, -- JSON array
  category TEXT NOT NULL,
  stock INTEGER NOT NULL,
  rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT, -- JSON array
  specifications TEXT, -- JSON object
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  isBanned BOOLEAN DEFAULT FALSE,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Cart Items Table (Future Enhancement)
```sql
CREATE TABLE cart_items (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  productId TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);
```

#### Orders Table (Future Enhancement)
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  items TEXT, -- JSON array
  shippingAddress TEXT, -- JSON object
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Database API

### Core Methods

```typescript
import { db, ensureDbInitialized } from '@/lib/database';

// Initialize database
await ensureDbInitialized();

// Product operations
const products = await db.getAllProducts();
const product = await db.getProductById('123');
await db.insertProduct(productData);
await db.updateProduct(productData);
await db.deleteProduct('123');
const results = await db.searchProducts('GPU', 'Graphics Cards');

// User operations
const users = await db.getAllUsers();
const user = await db.getUserByUsername('john');
const user = await db.getUserByEmail('john@example.com');
await db.insertUser(userData);
await db.updateUser(userData);

// Database management
await db.resetDatabase(); // Reset to defaults
const backup = await db.exportData(); // Export as Uint8Array
await db.importData(backupData); // Import from Uint8Array
```

## Admin Panel Features

### 🔧 **Database Management Tab**
Access database administration tools in the admin panel:

1. **Export Database**
   - Download SQLite database file
   - Creates `.db` file with timestamp
   - Full backup including all data

2. **Import Database**
   - Upload SQLite database file
   - Replaces current database
   - Supports `.db`, `.sqlite`, `.sqlite3` files

3. **Reset Database**
   - Restore to default state
   - Recreates all tables
   - Seeds with initial products and admin user

### 🔍 **Database Status**
- Real-time product and user counts
- Low stock alerts
- Database size monitoring

## Migration from localStorage

The system automatically migrates from localStorage to SQLite:

1. **First Load**: If no SQLite database exists, creates new one
2. **Data Seeding**: Populates with default products from JSON
3. **User Creation**: Sets up admin user automatically
4. **Fallback**: Falls back to JSON data if database initialization fails

## Performance Benefits

### ⚡ **Improved Performance**
- Indexed queries for faster searches
- Efficient data retrieval with SQL
- Better memory management
- Optimized storage format

### 🔍 **Advanced Querying**
```typescript
// Complex search with multiple criteria
const searchResults = await db.searchProducts('gaming RGB', 'Graphics Cards');

// Filter by multiple conditions
// (Can be extended with custom SQL queries)
```

### 📈 **Scalability**
- Handle thousands of products efficiently
- Complex relationships between data
- Transaction support for data integrity
- Prepared statements for security

## Data Persistence

### 🏠 **Browser Storage**
- Database stored in localStorage as binary data
- Automatically saves after each operation
- Survives page reloads and browser sessions
- ~5-10MB storage limit (typical browser limit)

### 💾 **Backup & Restore**
- Export database for backup
- Import on different devices
- Version control for database states
- Easy data migration

## Development Usage

### 🛠️ **Initialize in Components**
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      await ensureDbInitialized();
      const products = await db.getAllProducts();
      setProducts(products);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback to JSON data
    }
  };
  loadData();
}, []);
```

### 🔧 **Error Handling**
```typescript
try {
  await db.insertProduct(newProduct);
  toast.success('Product added successfully!');
} catch (error) {
  console.error('Failed to add product:', error);
  toast.error('Failed to add product');
}
```

## Future Enhancements

### 🚀 **Planned Features**
- [ ] Full-text search across all fields
- [ ] Database analytics and reporting
- [ ] Automated backups
- [ ] Data compression
- [ ] Multi-table joins for complex queries
- [ ] Database versioning and migrations
- [ ] Real-time collaboration (with server integration)

### 🌐 **Server Integration**
When ready to move to server-side:
- Easy migration to PostgreSQL/MySQL
- API endpoints already structured
- Same interface, different backend
- Maintains all functionality

## Troubleshooting

### Common Issues

1. **Database won't initialize**
   - Check browser console for errors
   - Clear localStorage and try again
   - Ensure sql.js is loading properly

2. **Data not persisting**
   - Check localStorage quota
   - Verify database save operations
   - Browser may be in private mode

3. **Import/Export issues**
   - Ensure file is valid SQLite database
   - Check file size limits
   - Verify browser supports file operations

### Debug Commands
```javascript
// In browser console
localStorage.getItem('vertixhub_database'); // Check if database exists
localStorage.removeItem('vertixhub_database'); // Clear database
```

## Performance Tips

1. **Batch Operations**: Group multiple inserts/updates
2. **Indexing**: Tables are pre-indexed for common queries
3. **Pagination**: Implement for large datasets
4. **Caching**: Cache frequently accessed data in component state
5. **Debouncing**: Debounce search queries to reduce database load

---

## Summary

The SQLite integration provides:
- ✅ Reliable data persistence
- ✅ Advanced querying capabilities  
- ✅ Easy backup and restore
- ✅ Better performance than localStorage
- ✅ Scalable architecture for future growth
- ✅ Professional database features in the browser 
import initSqlJs, { Database } from 'sql.js';
import { Product, User } from '@/types';

class DatabaseManager {
  private db: Database | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Only initialize in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Database can only be initialized in browser environment');
      }

      // Initialize sql.js with CDN fallback
      const SQL = await initSqlJs({
        locateFile: (file) => {
          // Try multiple CDN sources for reliability
          const cdnUrls = [
            `https://sql.js.org/dist/${file}`,
            `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`,
            `https://unpkg.com/sql.js@1.8.0/dist/${file}`
          ];
          return cdnUrls[0]; // Use the first URL, can be enhanced with fallback logic
        }
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('vertixhub_database');
      if (savedDb) {
        try {
          const dbData = new Uint8Array(JSON.parse(savedDb));
          this.db = new SQL.Database(dbData);
        } catch (parseError) {
          console.warn('Failed to parse saved database, creating new one:', parseError);
          this.db = new SQL.Database();
          await this.createTables();
          await this.seedInitialData();
        }
      } else {
        this.db = new SQL.Database();
        await this.createTables();
        await this.seedInitialData();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create products table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        originalPrice REAL,
        image TEXT,
        images TEXT, -- JSON array of image URLs
        category TEXT NOT NULL,
        stock INTEGER NOT NULL,
        rating REAL DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        tags TEXT, -- JSON array of tags
        specifications TEXT, -- JSON object
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        isBanned BOOLEAN DEFAULT FALSE,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cart items table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create orders table for future use
    this.db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        items TEXT, -- JSON array of order items
        shippingAddress TEXT, -- JSON object
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    this.saveDatabase();
  }

  private async seedInitialData(): Promise<void> {
    // Import initial products data
    const productsData = await import('@/data/products.json');
    const products = productsData.products as unknown as Product[];

    for (const product of products) {
      await this.insertProduct(product);
    }

    // Create admin user
    await this.insertUser({
      id: 'admin',
      name: 'Administrator',
      username: 'Admin',
      email: 'admin@vertixhub.com',
      password: '12345',
      isAdmin: true,
      isBanned: false,
      createdAt: new Date().toISOString()
    });
  }

  private saveDatabase(): void {
    if (!this.db) return;
    
    const data = this.db.export();
    const dataArray = Array.from(data);
    localStorage.setItem('vertixhub_database', JSON.stringify(dataArray));
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM products ORDER BY name');
    const products: Product[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      products.push(this.parseProductRow(row));
    }

    stmt.free();
    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM products WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.parseProductRow(row);
    }

    stmt.free();
    return null;
  }

  async insertProduct(product: Product): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO products 
      (id, name, description, price, originalPrice, image, images, category, stock, rating, reviews, featured, tags, specifications, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      product.id,
      product.name,
      product.description,
      product.price,
      product.originalPrice || null,
      product.image,
      JSON.stringify(product.images || []),
      product.category,
      product.stock,
      product.rating,
      product.reviews,
      product.featured ? 1 : 0,
      JSON.stringify(product.tags || []),
      JSON.stringify(product.specifications || {}),
      new Date().toISOString()
    ]);

    stmt.free();
    this.saveDatabase();
  }

  async updateProduct(product: Product): Promise<void> {
    await this.insertProduct(product);
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run([id]);
    stmt.free();
    this.saveDatabase();
  }

  async searchProducts(searchTerm: string, category?: string): Promise<Product[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `
      SELECT * FROM products 
      WHERE (name LIKE ? OR description LIKE ? OR tags LIKE ?)
    `;
    const params: any[] = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY name';

    const stmt = this.db.prepare(query);
    stmt.bind(params);

    const products: Product[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      products.push(this.parseProductRow(row));
    }

    stmt.free();
    return products;
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
    const users: User[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      users.push(this.parseUserRow(row));
    }

    stmt.free();
    return users;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind([username]);

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.parseUserRow(row);
    }

    stmt.free();
    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.bind([email]);

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return this.parseUserRow(row);
    }

    stmt.free();
    return null;
  }

  async insertUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      INSERT INTO users 
      (id, name, username, email, password, isAdmin, isBanned, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      user.id,
      user.name,
      user.username,
      user.email,
      user.password,
      user.isAdmin ? 1 : 0,
      user.isBanned ? 1 : 0,
      user.createdAt
    ]);

    stmt.free();
    this.saveDatabase();
  }

  async updateUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      UPDATE users 
      SET name = ?, username = ?, email = ?, password = ?, isAdmin = ?, isBanned = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run([
      user.name,
      user.username,
      user.email,
      user.password,
      user.isAdmin ? 1 : 0,
      user.isBanned ? 1 : 0,
      new Date().toISOString(),
      user.id
    ]);

    stmt.free();
    this.saveDatabase();
  }

  // Utility methods
  private parseProductRow(row: any): Product {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      price: row.price as number,
      originalPrice: row.originalPrice ? (row.originalPrice as number) : undefined,
      image: row.image as string,
      images: row.images ? JSON.parse(row.images as string) : undefined,
      category: row.category as string,
      stock: row.stock as number,
      rating: row.rating as number,
      reviews: row.reviews as number,
      featured: Boolean(row.featured),
      tags: row.tags ? JSON.parse(row.tags as string) : [],
      specifications: row.specifications ? JSON.parse(row.specifications as string) : {}
    };
  }

  private parseUserRow(row: any): User {
    return {
      id: row.id as string,
      name: row.name as string,
      username: row.username as string,
      email: row.email as string,
      password: row.password as string,
      isAdmin: Boolean(row.isAdmin),
      isBanned: Boolean(row.isBanned),
      createdAt: row.createdAt as string
    };
  }

  async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Drop all tables
    this.db.run('DROP TABLE IF EXISTS products');
    this.db.run('DROP TABLE IF EXISTS users');
    this.db.run('DROP TABLE IF EXISTS cart_items');
    this.db.run('DROP TABLE IF EXISTS orders');

    // Recreate tables and seed data
    await this.createTables();
    await this.seedInitialData();
  }

  async exportData(): Promise<Uint8Array> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.export();
  }

  async importData(data: Uint8Array): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Database import is only available in browser environment');
      }

      const SQL = await initSqlJs({
        locateFile: (file) => {
          const cdnUrls = [
            `https://sql.js.org/dist/${file}`,
            `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`,
            `https://unpkg.com/sql.js@1.8.0/dist/${file}`
          ];
          return cdnUrls[0];
        }
      });
      
      this.db = new SQL.Database(data);
      this.saveDatabase();
    } catch (error) {
      console.error('Failed to import database:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const db = new DatabaseManager();

// Helper function to ensure database is initialized
export const ensureDbInitialized = async (): Promise<void> => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    throw new Error('Database initialization is only available in browser environment');
  }
  await db.initialize();
}; 
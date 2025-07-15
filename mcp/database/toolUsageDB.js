import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path
const dbPath = join(__dirname, '../../tool_usage.db');

// Initialize database
const db = new sqlite3.Database(dbPath);

// Create tool_usage table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tool_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_name TEXT NOT NULL,
      arguments TEXT NOT NULL,
      result TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      execution_time_ms INTEGER
    )
  `);
});

export class ToolUsageDB {
  static async logToolUsage(toolName, args, result, executionTime = null) {
    return new Promise((resolve, reject) => {
      const argsJson = JSON.stringify(args);
      const resultJson = JSON.stringify(result);
      
      const stmt = db.prepare(`
        INSERT INTO tool_usage (tool_name, arguments, result, execution_time_ms)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run(toolName, argsJson, resultJson, executionTime, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
      
      stmt.finalize();
    });
  }
  
  static async getToolUsageHistory(limit = 100) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM tool_usage 
        ORDER BY timestamp DESC 
        LIMIT ?
      `, [limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  static async getToolUsageStats() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          tool_name,
          COUNT(*) as usage_count,
          AVG(execution_time_ms) as avg_execution_time,
          MIN(timestamp) as first_used,
          MAX(timestamp) as last_used
        FROM tool_usage 
        GROUP BY tool_name
        ORDER BY usage_count DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  static closeDB() {
    return new Promise((resolve) => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        }
        resolve();
      });
    });
  }
}
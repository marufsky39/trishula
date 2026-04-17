#!/usr/bin/env python3
"""
WITARA Platform - Database Migration Runner

Skrip ini menjalankan migration SQL ke Supabase database.
Pastikan environment variables sudah di-set sebelum menjalankan.

Environment variables yang diperlukan:
- POSTGRES_URL: Connection string ke Supabase PostgreSQL
- SUPABASE_SERVICE_ROLE_KEY: Service role key untuk akses admin

Usage:
    python scripts/run-migration.py
"""

import os
import sys
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

def get_connection():
    """
    Membuat connection ke Supabase PostgreSQL database.
    
    Environment variable POSTGRES_URL formatnya:
    postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
    """
    db_url = os.getenv('POSTGRES_URL')
    
    if not db_url:
        print("❌ Error: POSTGRES_URL environment variable tidak ditemukan")
        print("   Pastikan .env.local sudah di-set dengan POSTGRES_URL")
        sys.exit(1)
    
    try:
        conn = psycopg2.connect(db_url)
        print("✅ Connected to Supabase database")
        return conn
    except psycopg2.Error as e:
        print(f"❌ Error connecting to database: {e}")
        sys.exit(1)

def read_sql_file(file_path):
    """
    Membaca SQL migration file.
    
    Args:
        file_path: Path ke file SQL
    
    Returns:
        Isi file SQL sebagai string
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Error: File {file_path} tidak ditemukan")
        sys.exit(1)
    except IOError as e:
        print(f"❌ Error membaca file: {e}")
        sys.exit(1)

def run_migration(conn, sql_content):
    """
    Menjalankan SQL migration ke database.
    
    Args:
        conn: Database connection
        sql_content: Isi SQL untuk dijalankan
    
    Returns:
        True jika sukses, False jika error
    """
    try:
        cursor = conn.cursor()
        
        # Execute SQL
        print("\n⏳ Running migration...")
        cursor.execute(sql_content)
        
        # Commit changes
        conn.commit()
        
        print("✅ Migration completed successfully!")
        cursor.close()
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Error running migration: {e}")
        conn.rollback()
        return False

def main():
    """Main function untuk menjalankan migration."""
    
    print("=" * 60)
    print("WITARA Platform - Database Migration")
    print("=" * 60)
    
    # Get database connection
    conn = get_connection()
    
    # Read migration file
    migration_file = Path(__file__).parent / "01-init-database.sql"
    
    print(f"\n📄 Reading migration file: {migration_file}")
    sql_content = read_sql_file(migration_file)
    print(f"   File size: {len(sql_content)} characters")
    
    # Run migration
    success = run_migration(conn, sql_content)
    
    # Close connection
    conn.close()
    
    # Exit with appropriate code
    if success:
        print("\n" + "=" * 60)
        print("✅ Database setup completed!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Setup Storage bucket 'waste-images' di Supabase Dashboard")
        print("2. Configure Storage RLS policies (lihat SUPABASE_SETUP.md)")
        print("3. Run aplikasi: npm run dev")
        print("4. Test login di http://localhost:3000/login")
        print("\nNeed help? Baca SUPABASE_SETUP.md untuk panduan lengkap")
        return 0
    else:
        print("\n" + "=" * 60)
        print("❌ Migration failed!")
        print("=" * 60)
        print("\nChecklist:")
        print("- POSTGRES_URL environment variable di-set?")
        print("- Sudah ada koneksi internet ke Supabase?")
        print("- Database sudah bisa diakses dari IP Anda?")
        return 1

if __name__ == '__main__':
    sys.exit(main())

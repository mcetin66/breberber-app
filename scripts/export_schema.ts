
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function exportSchema() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not defined');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('📊 Fetching current database schema...\n');

        // 1. Get all tables
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        console.log('=== TABLES ===');
        for (const row of tablesRes.rows) {
            console.log(`\n📋 ${row.table_name}`);

            // Get columns for this table
            const colsRes = await client.query(`
                SELECT 
                    column_name, 
                    data_type, 
                    is_nullable,
                    column_default
                FROM information_schema.columns 
                WHERE table_name = $1 
                AND table_schema = 'public'
                ORDER BY ordinal_position;
            `, [row.table_name]);

            for (const col of colsRes.rows) {
                const nullable = col.is_nullable === 'YES' ? '?' : '';
                const def = col.column_default ? ` = ${col.column_default.substring(0, 30)}...` : '';
                console.log(`   - ${col.column_name}${nullable}: ${col.data_type}${def}`);
            }
        }

        // 2. Get RLS policies
        console.log('\n\n=== RLS POLICIES ===');
        const rlsRes = await client.query(`
            SELECT 
                schemaname,
                tablename,
                policyname,
                permissive,
                roles,
                cmd,
                qual
            FROM pg_policies
            WHERE schemaname = 'public'
            ORDER BY tablename, policyname;
        `);

        for (const pol of rlsRes.rows) {
            console.log(`\n🔒 ${pol.tablename}.${pol.policyname}`);
            console.log(`   Command: ${pol.cmd}, Permissive: ${pol.permissive}`);
            console.log(`   Roles: ${pol.roles}`);
        }

        // 3. Get foreign keys
        console.log('\n\n=== FOREIGN KEYS ===');
        const fkRes = await client.query(`
            SELECT
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            ORDER BY tc.table_name;
        `);

        for (const fk of fkRes.rows) {
            console.log(`   ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        }

        console.log('\n✅ Schema export complete.');

    } catch (err: any) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

exportSchema();

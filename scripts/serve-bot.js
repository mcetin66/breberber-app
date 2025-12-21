const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Inject ENV
try {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {
    console.log("Dotenv load failed");
}

let adminSupabase = null;
try {
    const { createClient } = require('@supabase/supabase-js');
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST exist for this to work
    if (url && serviceKey) {
        adminSupabase = createClient(url, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });
        console.log('✅ Admin Supabase Client initialized for Proxy Mode');
    }
} catch (e) {
    console.warn('⚠️ Supabase Admin client could not be initialized (missing dependency?)');
}

const PORT = 3005;

const server = http.createServer(async (req, res) => {
    console.log(`➡️  ${req.method} ${req.url}`); // Global Request Log

    // Helper to read body
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const bodyText = Buffer.concat(chunks).toString();

    // API: Proxy Customers
    if (req.method === 'GET' && req.url === '/api/customers') {
        if (!adminSupabase) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server not configured with Service Role Key' }));
            return;
        }
        try {
            const { data, error } = await adminSupabase
                .from('profiles')
                .select('id, full_name, role, email')
                .eq('role', 'customer')
                .limit(1000); // 50 -> 1000
            if (error) throw error;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // API: Proxy Businesses
    if (req.method === 'GET' && req.url === '/api/businesses') {
        if (!adminSupabase) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server not configured with Service Role Key' }));
            return;
        }
        try {
            // Fetch businesses and join with profiles to get owner email
            const { data, error } = await adminSupabase
                .from('businesses')
                .select('id, name, owner_id, owner:profiles(email)')
                .limit(1000);

            if (error) throw error;

            // Flatten the structure for easier consumption
            const simplified = data.map(b => ({
                id: b.id,
                name: b.name,
                email: b.owner?.email || 'N/A'
            }));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(simplified));
        } catch (err) {
            console.error("Proxy Business Error:", err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // API: Create Booking (Proxy Write)
    if (req.method === 'POST' && req.url === '/api/create-booking') {
        if (!adminSupabase) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server key missing' }));
            return;
        }
        try {
            console.log('📝 Proxy Write: Creating booking...');
            const payload = JSON.parse(bodyText);
            const { error } = await adminSupabase.from('bookings').insert(payload);

            if (error) throw error;
            console.log('✅ Proxy Write: Success');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (err) {
            console.error("Proxy Write Error:", err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, '../simulation-bot.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading html');
                return;
            }

            // Inject ENV (Client Side - Anon Key Only)
            const url = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
            const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''; // Keep using Anon for frontend auth

            const injection = `
            <script>
                window.SERVER_CONFIG = {
                    url: "${url}",
                    key: "${key}",
                    hasProxy: ${!!adminSupabase}
                };
            </script>
            `;

            // Inject before closing head or body
            const finalHtml = data.replace('</head>', `${injection}</head>`);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(finalHtml);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log('\x1b[33m%s\x1b[0m', `\n🚀 Simülasyon Sunucusu Başladı at http://localhost:${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `ℹ️  Credentials .env dosyasından otomatik yüklendi.`);
    console.log('Sayfa açılıyor...');

    // Auto-open in Chrome if possible
    const start = (process.platform == 'darwin'
        ? 'open -a "Google Chrome"'
        : process.platform == 'win32'
            ? 'start chrome'
            : 'xdg-open');

    exec(`${start} http://localhost:${PORT}`);
});

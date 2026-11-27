const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, 'bd.env') });
const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'pharmapro_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log(' Conectado a MySQL');
        connection.release();
    } catch (err) {
        console.error(' Error conectando a MySQL:', err.message);
    }
})();

const logAction = async (userId, userName, action, entity, details) => {
    try {
        const sql = "INSERT INTO audit_logs (user_id, user_name, action, entity, details) VALUES (?, ?, ?, ?, ?)";
        await db.query(sql, [userId, userName, action, entity, details]);
    } catch (e) { console.error("Error auditoría:", e); }
};

const verifyRole = (allowedRoles) => {
    return async (req, res, next) => {
        const { actingUser } = req.body;
        if (!actingUser || !actingUser.id) return res.status(401).json({ error: "No autorizado" });
        
        try {
            const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [actingUser.id]);
            if (rows.length === 0) return res.status(401).json({ error: "Usuario inválido" });
            
            const userRole = rows[0].role.toLowerCase();
            const allowed = allowedRoles.map(r => r.toLowerCase());
            
            if (allowed.includes(userRole) || allowed.includes('all')) next();
            else res.status(403).json({ error: "Permisos insuficientes" });
        } catch (err) {
            res.status(500).json(err);
        }
    };
};

const normalizeUser = (user) => ({ id: user.id || user.ID, name: user.name || user.NAME, username: user.username || user.USERNAME, role: user.role || user.ROLE });

app.post('/login', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ? AND password = ?", [user, pass]);
        if (rows.length > 0) {
            const userData = normalizeUser(rows[0]);
            logAction(userData.id, userData.name, 'LOGIN', 'Sistema', 'Inicio de sesión');
            res.json({ success: true, user: userData });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (err) { res.status(500).json(err); }
});

app.get('/users', async (req, res) => { const [r] = await db.query("SELECT * FROM users"); res.json(r.map(normalizeUser)); });
app.post('/users', verifyRole(['admin', 'owner']), async (req, res) => { try { await db.query("INSERT INTO users (NAME, ROLE, username, PASSWORD) VALUES (?, ?, ?, ?)", [req.body.name, req.body.role, req.body.username, req.body.password]); res.json({success:true}); } catch(e){res.status(500).json(e)} });
app.put('/users/:id', verifyRole(['admin', 'owner', 'all']), async (req, res) => { 
    const { name, role, username, password } = req.body; 
    const sql = password ? "UPDATE users SET NAME=?, ROLE=?, username=?, PASSWORD=? WHERE id=?" : "UPDATE users SET NAME=?, ROLE=?, username=? WHERE id=?"; 
    const params = password ? [name, role, username, password, req.params.id] : [name, role, username, req.params.id]; 
    try { await db.query(sql, params); res.json({success:true}); } catch(e){res.status(500).json(e)} 
});
app.delete('/users/:id', verifyRole(['admin', 'owner']), async (req, res) => { try { await db.query("DELETE FROM users WHERE id=?", [req.params.id]); res.json({success:true}); } catch(e){res.status(500).json(e)} });

app.get('/inventory', async (req, res) => { const [r] = await db.query("SELECT * FROM inventory ORDER BY name ASC"); res.json(r); });

app.post('/inventory', verifyRole(['admin', 'owner', 'pharmacist']), async (req, res) => { 
    try {
        const [r] = await db.query("INSERT INTO inventory (name, category, stock, price, expiryDate, image_url) VALUES (?, ?, ?, ?, ?, ?)", 
        [req.body.name, req.body.category, req.body.stock, req.body.price, req.body.expiryDate, req.body.image_url]);
        logAction(req.body.actingUser.id, req.body.actingUser.name, 'ADD_PRODUCT', req.body.name, `Stock: ${req.body.stock}`);
        res.json({id:r.insertId, ...req.body});
    } catch(e){res.status(500).json(e)}
});

app.put('/inventory/:id', verifyRole(['admin', 'owner', 'pharmacist']), async (req, res) => { 
    try {
        await db.query("UPDATE inventory SET name=?, category=?, stock=?, price=?, expiryDate=?, image_url=? WHERE id=?", 
        [req.body.name, req.body.category, req.body.stock, req.body.price, req.body.expiryDate, req.body.image_url, req.params.id]);
        res.json({success:true});
    } catch(e){res.status(500).json(e)}
});

app.delete('/inventory/:id', verifyRole(['admin', 'owner']), async (req, res) => { try { await db.query("DELETE FROM inventory WHERE id=?", [req.params.id]); res.json({success:true}); } catch(e){res.status(500).json(e)} });

app.get('/customers', async (req, res) => { const [r] = await db.query("SELECT * FROM customers ORDER BY name ASC"); res.json(r); });
app.post('/customers', async (req, res) => { try { const [r] = await db.query("INSERT INTO customers (name, phone, address, rnc) VALUES (?, ?, ?, ?)", [req.body.name, req.body.phone, req.body.address, req.body.rnc]); res.json({success:true, id:r.insertId}); } catch(e){res.status(500).json(e)} });
app.put('/customers/:id', async (req, res) => { try { await db.query("UPDATE customers SET name=?, phone=?, address=?, rnc=? WHERE id=?", [req.body.name, req.body.phone, req.body.address, req.body.rnc, req.params.id]); res.json({success:true}); } catch(e){res.status(500).json(e)} });
app.delete('/customers/:id', async (req, res) => { try { await db.query("DELETE FROM customers WHERE id=?", [req.params.id]); res.json({success:true}); } catch(e){res.status(500).json(e)} });

app.get('/suppliers', async (req, res) => { const [r] = await db.query("SELECT * FROM suppliers ORDER BY name ASC"); res.json(r); });
app.post('/suppliers', async (req, res) => { try { await db.query("INSERT INTO suppliers (name, contact, phone, address) VALUES (?, ?, ?, ?)", [req.body.name, req.body.contact, req.body.phone, req.body.address]); res.json({success:true}); } catch(e){res.status(500).json(e)} });
app.delete('/suppliers/:id', async (req, res) => { try { await db.query("DELETE FROM suppliers WHERE id=?", [req.params.id]); res.json({success:true}); } catch(e){res.status(500).json(e)} });

app.get('/branches', async (req, res) => { const [r] = await db.query("SELECT * FROM branches ORDER BY name ASC"); res.json(r); });
app.post('/branches', async (req, res) => { try { await db.query("INSERT INTO branches (name, address, phone) VALUES (?, ?, ?)", [req.body.name, req.body.address, req.body.phone]); res.json({success:true}); } catch(e){res.status(500).json(e)} });
app.delete('/branches/:id', async (req, res) => { try { await db.query("DELETE FROM branches WHERE id=?", [req.params.id]); res.json({success:true}); } catch(e){res.status(500).json(e)} });

app.get('/branch-requests', async (req, res) => { const [r] = await db.query("SELECT * FROM branch_requests ORDER BY date DESC"); res.json(r); });
app.post('/branch-requests', async (req, res) => { try { await db.query("INSERT INTO branch_requests (item_name, qty, requested_by, branch_name, status) VALUES (?, ?, ?, ?, 'Pending')", [req.body.item_name, req.body.qty, req.body.requested_by, req.body.branch_name]); logAction(req.body.actingUser.id, req.body.actingUser.name, 'REQUEST_STOCK', req.body.item_name, `Pide: ${req.body.qty}`); res.json({success:true}); } catch(e){res.status(500).json(e)} });

app.put('/branch-requests/:id/send', verifyRole(['admin', 'owner']), async (req, res) => {
    try {
        await db.query("UPDATE branch_requests SET status='Sent', sent_qty=? WHERE id=?", [req.body.sentQty, req.params.id]);
        logAction(req.body.actingUser.id, req.body.actingUser.name, 'DISPATCH_STOCK', `Pedido #${req.params.id}`, `Enviados: ${req.body.sentQty}`);
        res.json({success:true});
    } catch(e){res.status(500).json(e)}
});

app.put('/branch-requests/:id/receive', verifyRole(['admin', 'owner', 'pharmacist']), async (req, res) => {
    const requestId = req.params.id;
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query("SELECT * FROM branch_requests WHERE id = ?", [requestId]);
        if (rows.length === 0) throw new Error("No encontrado");
        const request = rows[0];
        if (request.status !== 'Sent') throw new Error("No listo");

        await connection.beginTransaction();
        await connection.query("UPDATE inventory SET stock = stock + ? WHERE name = ?", [request.sent_qty, request.item_name]);
        await connection.query("UPDATE branch_requests SET status='Completed' WHERE id=?", [requestId]);
        await connection.commit();
        
        logAction(req.body.actingUser.id, req.body.actingUser.name, 'RECEIVE_STOCK', request.item_name, `Recibidos +${request.sent_qty}`);
        res.json({success:true});
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});


app.post('/sale', async (req, res) => {
    const { patient, items, total, actingUser } = req.body;
    const connection = await db.getConnection();
    
    try {
        const [cashRows] = await connection.query("SELECT * FROM cash_cuts WHERE user_id = ? AND status = 'open'", [actingUser.id]);
        if (cashRows.length === 0) {
            connection.release();
            return res.status(400).json({ error: " CAJA CERRADA" });
        }

        await connection.beginTransaction();

        await connection.query("INSERT INTO orders (patient, items, total, date, status) VALUES (?, ?, ?, NOW(), 'Completed')", [patient, JSON.stringify(items), total]);

        for (const item of items) {
            await connection.query("UPDATE inventory SET stock = stock - ? WHERE id = ?", [item.qty, item.id]);
        }

        await connection.commit();
        res.json({success:true});

    } catch (err) {
        await connection.rollback();
        console.error("Error en venta:", err);
        res.status(500).json(err);
    } finally {
        connection.release(); 
    }
});

app.get('/orders', async (req, res) => { const [r] = await db.query("SELECT * FROM orders ORDER BY date DESC LIMIT 100"); res.json(r.map(o => ({ ...o, items: o.items ? JSON.parse(o.items) : [] }))); });

app.post('/orders/:id/void', verifyRole(['admin', 'owner']), async (req, res) => {
    const { reason, actingUser } = req.body;
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
        if (rows.length === 0) throw new Error("No encontrado");
        if (rows[0].status === 'Voided') throw new Error("Ya anulado");
        
        const items = JSON.parse(rows[0].items);
        await connection.beginTransaction();
        await connection.query("UPDATE orders SET status = 'Voided', void_reason=?, voided_by=?, voided_at=NOW() WHERE id=?", [reason, actingUser.name, req.params.id]);
        
        for (const item of items) {
            await connection.query("UPDATE inventory SET stock = stock + ? WHERE id = ?", [item.qty, item.id]);
        }
        
        await connection.commit();
        logAction(actingUser.id, actingUser.name, 'VOID_SALE', `Order #${req.params.id}`, reason);
        res.json({success:true});
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

app.get('/cash-cut/active/:userId', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM cash_cuts WHERE user_id = ? AND status = 'open'", [req.params.userId]);
        res.json(rows.length > 0 ? rows[0] : null);
    } catch(e){ res.status(500).json(e); }
});

app.post('/cash-cut/open', async (req, res) => { 
    try {
        await db.query("INSERT INTO cash_cuts (user_id, open_amount, status) VALUES (?, ?, 'open')", [req.body.userId, req.body.amount]);
        logAction(req.body.userId, 'Cajero', 'OPEN_BOX', 'Caja', `Apertura: ${req.body.amount}`);
        res.json({success:true});
    } catch(e){ res.status(500).json(e); }
});

app.post('/cash-cut/close', async (req, res) => {
    const { id, closeAmount, userId } = req.body;
    try {
        const [rows] = await db.query("SELECT opened_at FROM cash_cuts WHERE id = ?", [id]);
        const openTime = rows[0].opened_at;
        
        const [saleRows] = await db.query("SELECT SUM(total) as total FROM orders WHERE date >= ? AND status = 'Completed'", [openTime]);
        const totalSales = saleRows[0].total || 0;
        const discrepancy = closeAmount - totalSales;
        
        await db.query("UPDATE cash_cuts SET close_amount=?, sales_total=?, discrepancy=?, closed_at=NOW(), status='closed' WHERE id=?", [closeAmount, totalSales, discrepancy, id]);
        logAction(userId, 'Cajero', 'CLOSE_BOX', 'Caja', `Venta: ${totalSales}`);
        res.json({success:true, totalSales, discrepancy});
    } catch(e){ res.status(500).json(e); }
});

app.get('/stats/weekly', async (req, res) => { 
    const sql = `SELECT DATE(date) as sale_date, SUM(total) as total FROM orders WHERE date >= DATE(NOW()) - INTERVAL 7 DAY AND status='Completed' GROUP BY DATE(date) ORDER BY sale_date ASC`; 
    try {
        const [rows] = await db.query(sql);
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']; 
        res.json(rows.map(x => ({ day: days[new Date(x.sale_date).getUTCDay()], v: x.total })));
    } catch(e){ res.status(500).json(e); }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';

const startServer = (port = PORT, host = HOST) =>
    app.listen(port, host, () => console.log(`Servidor Async LISTO en http://${host}:${port}`));

if (require.main === module) startServer();

module.exports = { app, db, startServer };

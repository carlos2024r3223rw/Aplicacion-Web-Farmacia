const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pharmapro_db'
});

db.connect(err => {
    if (err) console.error('❌ Error MySQL:', err);
    else console.log('✅ Conectado a MySQL (XAMPP)');
});

const normalizeUser = (user) => ({
    id: user.id || user.ID,
    name: user.name || user.NAME,
    username: user.username || user.USERNAME,
    role: user.role || user.ROLE,
    password: user.password || user.PASSWORD
});

// --- LOGIN ---
app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [user, pass], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) res.json({ success: true, user: normalizeUser(result[0]) });
        else res.status(401).json({ success: false, message: "Error" });
    });
});

// --- USUARIOS ---
app.get('/users', (req, res) => { db.query("SELECT * FROM users", (err, r) => res.json(r.map(normalizeUser))); });
app.post('/users', (req, res) => { db.query("INSERT INTO users (NAME, ROLE, username, PASSWORD) VALUES (?, ?, ?, ?)", [req.body.name, req.body.role, req.body.username, req.body.password], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.put('/users/:id', (req, res) => {
    const { name, role, username, password } = req.body;
    const sql = password ? "UPDATE users SET NAME=?, ROLE=?, username=?, PASSWORD=? WHERE id=?" : "UPDATE users SET NAME=?, ROLE=?, username=? WHERE id=?";
    const params = password ? [name, role, username, password, req.params.id] : [name, role, username, req.params.id];
    db.query(sql, params, (err) => err ? res.status(500).json(err) : res.json({success:true}));
});
app.delete('/users/:id', (req, res) => { db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

// --- CLIENTES ---
app.get('/customers', (req, res) => { db.query("SELECT * FROM customers ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/customers', (req, res) => { db.query("INSERT INTO customers (name, phone, address, rnc) VALUES (?, ?, ?, ?)", [req.body.name, req.body.phone, req.body.address, req.body.rnc], (err, r) => err ? res.status(500).json(err) : res.json({success:true, id:r.insertId})); });
app.put('/customers/:id', (req, res) => { db.query("UPDATE customers SET name=?, phone=?, address=?, rnc=? WHERE id=?", [req.body.name, req.body.phone, req.body.address, req.body.rnc, req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/customers/:id', (req, res) => { db.query("DELETE FROM customers WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

// --- PROVEEDORES (NUEVO) ---
app.get('/suppliers', (req, res) => { db.query("SELECT * FROM suppliers ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/suppliers', (req, res) => { db.query("INSERT INTO suppliers (name, contact, phone, address) VALUES (?, ?, ?, ?)", [req.body.name, req.body.contact, req.body.phone, req.body.address], (err, r) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/suppliers/:id', (req, res) => { db.query("DELETE FROM suppliers WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

// --- INVENTARIO ---
app.get('/inventory', (req, res) => { db.query("SELECT * FROM inventory ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/inventory', (req, res) => { db.query("INSERT INTO inventory (name, category, stock, price, expiryDate) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.category, req.body.stock, req.body.price, req.body.expiryDate], (err, r) => err ? res.status(500).json(err) : res.json({id:r.insertId, ...req.body})); });
app.put('/inventory/:id', (req, res) => { db.query("UPDATE inventory SET name=?, category=?, stock=?, price=?, expiryDate=? WHERE id=?", [req.body.name, req.body.category, req.body.stock, req.body.price, req.body.expiryDate, req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/inventory/:id', (req, res) => { db.query("DELETE FROM inventory WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

// --- VENTAS ---
app.post('/sale', (req, res) => {
    const { patient, items, total } = req.body;
    db.beginTransaction(err => {
        if (err) return res.status(500).json(err);
        db.query("INSERT INTO orders (patient, items, total, date, status) VALUES (?, ?, ?, NOW(), 'Completed')", [patient, JSON.stringify(items), total], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json(err));
            const promises = items.map(item => new Promise((resolve, reject) => {
                db.query("UPDATE inventory SET stock = stock - ? WHERE id = ?", [item.qty, item.id], (err) => err ? reject(err) : resolve());
            }));
            Promise.all(promises).then(() => db.commit(err => err ? db.rollback(() => res.status(500).json(err)) : res.json({success:true}))).catch(err => db.rollback(() => res.status(500).json(err)));
        });
    });
});

app.get('/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY date DESC", (err, r) => {
        if (err) return res.status(500).json(err);
        res.json(r.map(o => ({ ...o, items: o.items ? JSON.parse(o.items) : [] })));
    });
});

// --- ANULACIONES (NUEVO) ---
app.post('/orders/:id/void', (req, res) => {
    const orderId = req.params.id;
    // 1. Obtener la orden
    db.query("SELECT * FROM orders WHERE id = ?", [orderId], (err, result) => {
        if (err || result.length === 0) return res.status(500).json({ error: "Order not found" });
        const order = result[0];
        if (order.status === 'Voided') return res.status(400).json({ error: "Already voided" });

        const items = JSON.parse(order.items);
        
        db.beginTransaction(err => {
            if (err) return res.status(500).json(err);
            // 2. Marcar como anulada
            db.query("UPDATE orders SET status = 'Voided' WHERE id = ?", [orderId], (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));
                // 3. Devolver stock
                const promises = items.map(item => new Promise((resolve, reject) => {
                    db.query("UPDATE inventory SET stock = stock + ? WHERE id = ?", [item.qty, item.id], (err) => err ? reject(err) : resolve());
                }));
                Promise.all(promises).then(() => db.commit(err => err ? db.rollback(() => res.status(500).json(err)) : res.json({success:true}))).catch(err => db.rollback(() => res.status(500).json(err)));
            });
        });
    });
});

// --- CIERRE DE CAJA (NUEVO) ---
// Verificar si hay caja abierta para un usuario
app.get('/cash-cut/active/:userId', (req, res) => {
    db.query("SELECT * FROM cash_cuts WHERE user_id = ? AND status = 'open' LIMIT 1", [req.params.userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result.length > 0 ? result[0] : null);
    });
});

// Abrir caja
app.post('/cash-cut/open', (req, res) => {
    const { userId, amount } = req.body;
    db.query("INSERT INTO cash_cuts (user_id, open_amount, status) VALUES (?, ?, 'open')", [userId, amount], (err) => err ? res.status(500).json(err) : res.json({success:true}));
});

// Cerrar caja (Calcula ventas automáticamente)
app.post('/cash-cut/close', (req, res) => {
    const { id, closeAmount, userId } = req.body;
    // 1. Obtener fecha de apertura
    db.query("SELECT opened_at FROM cash_cuts WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        const openTime = result[0].opened_at;
        
        // 2. Sumar ventas desde esa hora hasta ahora para este usuario (Ojo: solo ventas Completed)
        // Nota: En producción idealmente filtrarías por usuario en la tabla orders también
        const sqlSales = "SELECT SUM(total) as total FROM orders WHERE date >= ? AND status = 'Completed'";
        db.query(sqlSales, [openTime], (err, saleResult) => {
            const totalSales = saleResult[0].total || 0;
            const discrepancy = closeAmount - totalSales; // (Lo que hay) - (Lo que debería haber)
            
            // 3. Cerrar
            db.query("UPDATE cash_cuts SET close_amount=?, sales_total=?, discrepancy=?, closed_at=NOW(), status='closed' WHERE id=?", 
                [closeAmount, totalSales, discrepancy, id], 
                (err) => err ? res.status(500).json(err) : res.json({success:true, totalSales, discrepancy})
            );
        });
    });
});

app.get('/stats/weekly', (req, res) => {
    const sql = `SELECT DATE(date) as sale_date, SUM(total) as total FROM orders WHERE date >= DATE(NOW()) - INTERVAL 7 DAY AND status='Completed' GROUP BY DATE(date) ORDER BY sale_date ASC`;
    db.query(sql, (err, r) => {
        if (err) return res.status(500).json(err);
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        res.json(r.map(x => ({ day: days[new Date(x.sale_date).getUTCDay()], v: x.total })));
    });
});

app.listen(3001, () => console.log(' Servidor PRO (Caja+Anulaciones) LISTO puerto 3001'));
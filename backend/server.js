require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- CONEXIÓN BD ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'pharmapro_db'
});

db.connect(err => {
    if (err) console.error('❌ Error MySQL:', err.message);
    else console.log(`✅ Conectado a MySQL - Sistema V16.0`);
});

// --- AUDITORÍA ---
const logAction = (userId, userName, action, entity, details) => {
    const sql = "INSERT INTO audit_logs (user_id, user_name, action, entity, details) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [userId, userName, action, entity, details], (err) => { if(err) console.error(err); });
};

// --- MIDDLEWARE ---
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const { actingUser } = req.body;
        if (!actingUser || !actingUser.id) return res.status(401).json({ error: "No autorizado" });
        db.query("SELECT role FROM users WHERE id = ?", [actingUser.id], (err, result) => {
            if (err || result.length === 0) return res.status(401).json({ error: "Usuario inválido" });
            const userRole = result[0].role.toLowerCase();
            const allowed = allowedRoles.map(r => r.toLowerCase());
            if (allowed.includes(userRole) || allowed.includes('all')) next();
            else res.status(403).json({ error: "Permisos insuficientes" });
        });
    };
};

const normalizeUser = (user) => ({ id: user.id || user.ID, name: user.name || user.NAME, username: user.username || user.USERNAME, role: user.role || user.ROLE, password: user.password || user.PASSWORD });

// --- RUTAS ---
app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [user, pass], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            const userData = normalizeUser(result[0]);
            logAction(userData.id, userData.name, 'LOGIN', 'Sistema', 'Inicio de sesión');
            res.json({ success: true, user: userData });
        } else res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    });
});

// CRUD BÁSICO
app.get('/users', (req, res) => { db.query("SELECT * FROM users", (err, r) => res.json(r.map(normalizeUser))); });
app.post('/users', verifyRole(['admin', 'owner']), (req, res) => { db.query("INSERT INTO users (NAME, ROLE, username, PASSWORD) VALUES (?, ?, ?, ?)", [req.body.name, req.body.role, req.body.username, req.body.password], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.put('/users/:id', verifyRole(['admin', 'owner', 'all']), (req, res) => { const { name, role, username, password } = req.body; const sql = password ? "UPDATE users SET NAME=?, ROLE=?, username=?, PASSWORD=? WHERE id=?" : "UPDATE users SET NAME=?, ROLE=?, username=? WHERE id=?"; const params = password ? [name, role, username, password, req.params.id] : [name, role, username, req.params.id]; db.query(sql, params, (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/users/:id', verifyRole(['admin', 'owner']), (req, res) => { db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

app.get('/inventory', (req, res) => { db.query("SELECT * FROM inventory ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/inventory', verifyRole(['admin', 'owner', 'pharmacist']), (req, res) => { db.query("INSERT INTO inventory (name, category, stock, price, expiryDate) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.category, req.body.stock, req.body.price, req.body.expiryDate], (err, r) => err ? res.status(500).json(err) : res.json({id:r.insertId, ...req.body})); });
app.put('/inventory/:id', verifyRole(['admin', 'owner', 'pharmacist']), (req, res) => { db.query("UPDATE inventory SET name=?, category=?, stock=?, price=?, expiryDate=? WHERE id=?", [req.body.name, req.body.category, req.body.stock, req.body.price, req.body.expiryDate, req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/inventory/:id', verifyRole(['admin', 'owner']), (req, res) => { db.query("DELETE FROM inventory WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

app.get('/customers', (req, res) => { db.query("SELECT * FROM customers ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/customers', (req, res) => { db.query("INSERT INTO customers (name, phone, address, rnc) VALUES (?, ?, ?, ?)", [req.body.name, req.body.phone, req.body.address, req.body.rnc], (err, r) => err ? res.status(500).json(err) : res.json({success:true, id:r.insertId})); });
app.put('/customers/:id', (req, res) => { db.query("UPDATE customers SET name=?, phone=?, address=?, rnc=? WHERE id=?", [req.body.name, req.body.phone, req.body.address, req.body.rnc, req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/customers/:id', (req, res) => { db.query("DELETE FROM customers WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

app.get('/suppliers', (req, res) => { db.query("SELECT * FROM suppliers ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/suppliers', (req, res) => { db.query("INSERT INTO suppliers (name, contact, phone, address) VALUES (?, ?, ?, ?)", [req.body.name, req.body.contact, req.body.phone, req.body.address], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/suppliers/:id', (req, res) => { db.query("DELETE FROM suppliers WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

app.get('/branches', (req, res) => { db.query("SELECT * FROM branches ORDER BY name ASC", (err, r) => res.json(r)); });
app.post('/branches', (req, res) => { db.query("INSERT INTO branches (name, address, phone) VALUES (?, ?, ?)", [req.body.name, req.body.address, req.body.phone], (err) => err ? res.status(500).json(err) : res.json({success:true})); });
app.delete('/branches/:id', (req, res) => { db.query("DELETE FROM branches WHERE id=?", [req.params.id], (err) => err ? res.status(500).json(err) : res.json({success:true})); });

// --- PEDIDOS ENTRE SUCURSALES (LÓGICA V16) ---
app.get('/branch-requests', (req, res) => { db.query("SELECT * FROM branch_requests ORDER BY date DESC", (err, r) => res.json(r)); });

app.post('/branch-requests', (req, res) => { 
    db.query("INSERT INTO branch_requests (item_name, qty, requested_by, branch_name, status) VALUES (?, ?, ?, ?, 'Pending')", 
    [req.body.item_name, req.body.qty, req.body.requested_by, req.body.branch_name], (err) => {
        if(err) return res.status(500).json(err);
        logAction(req.body.actingUser.id, req.body.actingUser.name, 'REQUEST_STOCK', req.body.item_name, `Pide: ${req.body.qty}`);
        res.json({success:true});
    }); 
});

// ADMIN ENVÍA (Con cantidad real)
app.put('/branch-requests/:id/send', verifyRole(['admin', 'owner']), (req, res) => {
    const { sentQty, actingUser } = req.body;
    db.query("UPDATE branch_requests SET status='Sent', sent_qty=? WHERE id=?", [sentQty, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        logAction(actingUser.id, actingUser.name, 'DISPATCH_STOCK', `Pedido #${req.params.id}`, `Enviados: ${sentQty}`);
        res.json({success:true});
    });
});

// SUCURSAL RECIBE (Suma lo enviado)
app.put('/branch-requests/:id/receive', verifyRole(['admin', 'owner', 'pharmacist']), (req, res) => {
    const requestId = req.params.id;
    db.query("SELECT * FROM branch_requests WHERE id = ?", [requestId], (err, result) => {
        if (err || result.length === 0) return res.status(500).json({ error: "Pedido no encontrado" });
        const request = result[0];
        if (request.status !== 'Sent') return res.status(400).json({ error: "No listo para recibir" });

        db.beginTransaction(err => {
            if (err) return res.status(500).json(err);
            // Sumamos sent_qty, no qty
            const sqlUpdateStock = "UPDATE inventory SET stock = stock + ? WHERE name = ?";
            db.query(sqlUpdateStock, [request.sent_qty, request.item_name], (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));
                db.query("UPDATE branch_requests SET status='Completed' WHERE id=?", [requestId], (err) => {
                    if (err) return db.rollback(() => res.status(500).json(err));
                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).json(err));
                        logAction(req.body.actingUser.id, req.body.actingUser.name, 'RECEIVE_STOCK', request.item_name, `Recibidos +${request.sent_qty}`);
                        res.json({success:true});
                    });
                });
            });
        });
    });
});

// --- VENTAS Y CAJA ---
app.post('/sale', (req, res) => {
    const { patient, items, total, actingUser } = req.body;
    db.query("SELECT * FROM cash_cuts WHERE user_id = ? AND status = 'open'", [actingUser.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(400).json({ error: "⛔ CAJA CERRADA" });

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
});

app.get('/orders', (req, res) => { db.query("SELECT * FROM orders ORDER BY date DESC LIMIT 100", (err, r) => res.json(r.map(o => ({ ...o, items: o.items ? JSON.parse(o.items) : [] })))); });

app.post('/orders/:id/void', verifyRole(['admin', 'owner']), (req, res) => {
    const { reason, actingUser } = req.body;
    db.query("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, result) => {
        if (err || result.length === 0) return res.status(500).json({ error: "No encontrado" });
        if (result[0].status === 'Voided') return res.status(400).json({ error: "Ya anulado" });
        const items = JSON.parse(result[0].items);
        db.beginTransaction(err => {
            db.query("UPDATE orders SET status = 'Voided', void_reason=?, voided_by=?, voided_at=NOW() WHERE id=?", [reason, actingUser.name, req.params.id], (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));
                const promises = items.map(item => new Promise((resolve, reject) => {
                    db.query("UPDATE inventory SET stock = stock + ? WHERE id = ?", [item.qty, item.id], (err) => err ? reject(err) : resolve());
                }));
                Promise.all(promises).then(() => db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json(err));
                    logAction(actingUser.id, actingUser.name, 'VOID_SALE', `Order #${req.params.id}`, reason);
                    res.json({success:true});
                })).catch(err => db.rollback(() => res.status(500).json(err)));
            });
        });
    });
});

app.post('/cash-cut/open', (req, res) => { db.query("INSERT INTO cash_cuts (user_id, open_amount, status) VALUES (?, ?, 'open')", [req.body.userId, req.body.amount], (err) => { if(err) return res.status(500).json(err); logAction(req.body.userId, 'Cajero', 'OPEN_BOX', 'Caja', `Apertura: ${req.body.amount}`); res.json({success:true}); }); });
app.post('/cash-cut/close', (req, res) => {
    const { id, closeAmount, userId } = req.body;
    db.query("SELECT opened_at FROM cash_cuts WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        const openTime = result[0].opened_at;
        db.query("SELECT SUM(total) as total FROM orders WHERE date >= ? AND status = 'Completed'", [openTime], (err, saleResult) => {
            const totalSales = saleResult[0].total || 0;
            const discrepancy = closeAmount - totalSales;
            db.query("UPDATE cash_cuts SET close_amount=?, sales_total=?, discrepancy=?, closed_at=NOW(), status='closed' WHERE id=?", [closeAmount, totalSales, discrepancy, id], (err) => { if(err) return res.status(500).json(err); logAction(userId, 'Cajero', 'CLOSE_BOX', 'Caja', `Venta: ${totalSales}`); res.json({success:true, totalSales, discrepancy}); });
        });
    });
});

app.get('/stats/weekly', (req, res) => {
    const sql = `SELECT DATE(date) as sale_date, SUM(total) as total FROM orders WHERE date >= DATE(NOW()) - INTERVAL 7 DAY AND status='Completed' GROUP BY DATE(date) ORDER BY sale_date ASC`;
    db.query(sql, (err, r) => { if (err) return res.status(500).json(err); const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']; res.json(r.map(x => ({ day: days[new Date(x.sale_date).getUTCDay()], v: x.total }))); });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Servidor V16.0 LISTO en puerto ${PORT}`));
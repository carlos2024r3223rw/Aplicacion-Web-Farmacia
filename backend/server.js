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

// --- HELPER PARA NORMALIZAR USUARIOS ---
// Esto arregla el problema de NAME vs name
const normalizeUser = (user) => {
    return {
        id: user.id || user.ID,
        name: user.name || user.NAME,
        username: user.username || user.USERNAME,
        role: user.role || user.ROLE,
        password: user.password || user.PASSWORD
    };
};

// --- LOGIN ---
app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [user, pass], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            // Normalizamos el usuario antes de enviarlo
            const safeUser = normalizeUser(result[0]);
            res.json({ success: true, user: safeUser });
        }
        else res.status(401).json({ success: false, message: "Error" });
    });
});

// --- USUARIOS (GET) ---
app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).json(err);
        // Normalizamos toda la lista
        const safeUsers = result.map(u => normalizeUser(u));
        res.json(safeUsers);
    });
});

// --- USUARIOS (POST - CREAR) ---
app.post('/users', (req, res) => {
    const { name, role, username, password } = req.body;
    // Usamos nombres de columnas genéricos que suelen funcionar
    const sql = "INSERT INTO users (NAME, ROLE, username, PASSWORD) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, role, username, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- USUARIOS (PUT - EDITAR / CAMBIAR PASS) ---
app.put('/users/:id', (req, res) => {
    const { name, role, username, password } = req.body;
    
    if (password) {
        // Si hay contraseña, actualizamos todo (incluido el pass)
        const sql = "UPDATE users SET NAME=?, ROLE=?, username=?, PASSWORD=? WHERE id=?";
        db.query(sql, [name, role, username, password, req.params.id], (err, result) => { 
            if (err) return res.status(500).json(err); 
            res.json({ success: true }); 
        });
    } else {
        // Si NO hay contraseña, actualizamos solo datos
        const sql = "UPDATE users SET NAME=?, ROLE=?, username=? WHERE id=?";
        db.query(sql, [name, role, username, req.params.id], (err, result) => { 
            if (err) return res.status(500).json(err); 
            res.json({ success: true }); 
        });
    }
});

app.delete('/users/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => { if (err) return res.status(500).json(err); res.json({ success: true }); });
});

// --- INVENTARIO ---
app.get('/inventory', (req, res) => {
    db.query("SELECT * FROM inventory ORDER BY name ASC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/inventory', (req, res) => {
    const { name, category, stock, price, expiryDate } = req.body;
    const sql = "INSERT INTO inventory (name, category, stock, price, expiryDate) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, category, stock, price, expiryDate], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

app.put('/inventory/:id', (req, res) => {
    const { name, category, stock, price, expiryDate } = req.body;
    const sql = "UPDATE inventory SET name=?, category=?, stock=?, price=?, expiryDate=? WHERE id=?";
    db.query(sql, [name, category, stock, price, expiryDate, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/inventory/:id', (req, res) => {
    db.query("DELETE FROM inventory WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- VENTAS (POS) ---
app.post('/sale', (req, res) => {
    const { patient, items, total } = req.body;
    db.beginTransaction(err => {
        if (err) return res.status(500).json(err);
        const sqlOrder = "INSERT INTO orders (patient, items, total, date, status) VALUES (?, ?, ?, NOW(), 'Completed')";
        db.query(sqlOrder, [patient, JSON.stringify(items), total], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json(err));
            const updatePromises = items.map(item => {
                return new Promise((resolve, reject) => {
                    const sqlUpdate = "UPDATE inventory SET stock = stock - ? WHERE id = ?";
                    db.query(sqlUpdate, [item.qty, item.id], (err, result) => { if (err) reject(err); else resolve(result); });
                });
            });
            Promise.all(updatePromises)
                .then(() => { db.commit(err => { if (err) return db.rollback(() => res.status(500).json(err)); res.json({ success: true }); }); })
                .catch(err => { db.rollback(() => res.status(500).json({ error: "Stock error", details: err })); });
        });
    });
});

app.get('/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY date DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        const parsedOrders = result.map(o => ({ ...o, items: o.items ? JSON.parse(o.items) : [] }));
        res.json(parsedOrders);
    });
});

app.get('/stats/weekly', (req, res) => {
    const sql = `SELECT DATE(date) as sale_date, SUM(total) as total FROM orders WHERE date >= DATE(NOW()) - INTERVAL 7 DAY GROUP BY DATE(date) ORDER BY sale_date ASC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        const daysMap = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        const formatted = result.map(r => ({ day: daysMap[new Date(r.sale_date).getUTCDay()], v: r.total }));
        res.json(formatted);
    });
});

app.listen(3001, () => console.log(' Backend CORREGIDO listo en puerto 3001'));
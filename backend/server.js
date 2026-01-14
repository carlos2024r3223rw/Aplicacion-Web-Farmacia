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

// --- LOGIN ---
app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [user, pass], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) res.json({ success: true, user: result[0] });
        else res.status(401).json({ success: false, message: "Incorrecto" });
    });
});

// --- INVENTARIO ---
app.get('/inventory', (req, res) => {
    db.query("SELECT * FROM inventory", (err, result) => {
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

app.delete('/inventory/:id', (req, res) => {
    db.query("DELETE FROM inventory WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- USUARIOS (PERSONAL) ---
app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/users', (req, res) => {
    const { name, role, username, password } = req.body;
    const sql = "INSERT INTO users (name, role, username, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, role, username, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// NUEVO: ACTUALIZAR USUARIO (Para editar personal y cambiar contraseñas)
app.put('/users/:id', (req, res) => {
    const { name, role, username, password } = req.body;
    // Si envían contraseña, la actualizamos. Si no, mantenemos la anterior.
    let sql, params;
    if (password && password.trim() !== "") {
        sql = "UPDATE users SET name=?, role=?, username=?, password=? WHERE id=?";
        params = [name, role, username, password, req.params.id];
    } else {
        sql = "UPDATE users SET name=?, role=?, username=? WHERE id=?";
        params = [name, role, username, req.params.id];
    }
    
    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/users/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- PEDIDOS ---
app.get('/orders', (req, res) => {
    db.query("SELECT * FROM orders", (err, result) => {
        if (err) return res.status(500).json(err);
        const parsedOrders = result.map(order => ({
            ...order,
            items: JSON.parse(order.items || '[]')
        }));
        res.json(parsedOrders);
    });
});

app.delete('/orders/:id', (req, res) => {
    db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.listen(3001, () => {
    console.log('🚀 Backend listo en puerto 3001');
});
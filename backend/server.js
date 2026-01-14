const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- 1. CONEXIÓN A BASE DE DATOS (XAMPP) ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Usuario por defecto de XAMPP
    password: '',      // Contraseña por defecto (vacía)
    database: 'pharmapro_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL (XAMPP)');
});

// Ruta de prueba para saber si el servidor vive
app.get('/', (req, res) => {
    res.send('🤖 Servidor Backend PharmaPro: ONLINE');
});

// ==========================================
//                 RUTAS
// ==========================================

// --- LOGIN ---
app.post('/login', (req, res) => {
    const { user, pass } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [user, pass], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

// --- INVENTARIO (CRUD) ---

// Obtener todos
app.get('/inventory', (req, res) => {
    const sql = "SELECT * FROM inventory ORDER BY name ASC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Crear nuevo
app.post('/inventory', (req, res) => {
    const { name, category, stock, price, expiryDate } = req.body;
    const sql = "INSERT INTO inventory (name, category, stock, price, expiryDate) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, category, stock, price, expiryDate], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// EDITAR (Stock, Precio, Nombre...)
app.put('/inventory/:id', (req, res) => {
    const { name, category, stock, price, expiryDate } = req.body;
    const sql = "UPDATE inventory SET name=?, category=?, stock=?, price=?, expiryDate=? WHERE id=?";
    db.query(sql, [name, category, stock, price, expiryDate, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Borrar
app.delete('/inventory/:id', (req, res) => {
    const sql = "DELETE FROM inventory WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- USUARIOS / PERSONAL (CRUD) ---

// Obtener todos
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// Crear nuevo
app.post('/users', (req, res) => {
    const { name, role, username, password } = req.body;
    const sql = "INSERT INTO users (name, role, username, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, role, username, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// EDITAR (Cambiar contraseña, rol, nombre)
app.put('/users/:id', (req, res) => {
    const { name, role, username, password } = req.body;
    
    // Lógica: Si la contraseña viene vacía, no la cambiamos.
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

// Borrar
app.delete('/users/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- PEDIDOS (ORDERS) ---

// Obtener todos (y parsear el JSON de los items)
app.get('/orders', (req, res) => {
    const sql = "SELECT * FROM orders ORDER BY date DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        
        // Convertimos el string JSON de la DB a objeto JS real para que React lo entienda
        const parsedOrders = result.map(order => ({
            ...order,
            items: order.items ? JSON.parse(order.items) : []
        }));
        
        res.json(parsedOrders);
    });
});

// Completar/Borrar pedido
app.delete('/orders/:id', (req, res) => {
    const sql = "DELETE FROM orders WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- INICIAR SERVIDOR ---
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});
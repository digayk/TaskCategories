const express = require('express');
const db = require('./db'); // Zorg dat db.js in dezelfde map staat
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <h1>Project API - Imagine Flowers API Documentatie</h1>
        <p>Welkom bij de API voor de bloemenzaak. Gebruik onderstaande endpoints:</p>
        
        <h3>Bloemen (Items) Endpoints:</h3>
        <ul>
            <li><strong>GET /items</strong> - Lijst van alle bloemen (gebruik ?sort=prijs voor sorteren)</li>
            <li><strong>GET /items/search?q=...</strong> - Zoeken op naam (bijv. ?q=roos)</li>
            <li><strong>GET /items/pagination?limit=5&offset=0</strong> - Gepagineerde lijst</li>
            <li><strong>POST /items</strong> - Nieuwe bloem toevoegen (JSON body: "naam", "prijs")</li>
            <li><strong>PUT /items/:id</strong> - Bloem bijwerken (JSON body: "naam", "prijs")</li>
            <li><strong>DELETE /items/:id</strong> - Bloem verwijderen</li>
        </ul>

        <h3>Categorieën Endpoints:</h3>
        <ul>
            <li><strong>GET /categories</strong> - Alle categorieën (Boeketten, Rouw, etc.)</li>
            <li><strong>GET /categories/:id</strong> - Details van één categorie</li>
            <li><strong>POST /categories</strong> - Nieuwe categorie toevoegen (JSON body: "naam")</li>
            <li><strong>PUT /categories/:id</strong> - Categorie bijwerken (JSON body: "naam")</li>
            <li><strong>DELETE /categories/:id</strong> - Categorie verwijderen</li>
        </ul>
    `);
});


app.get('/items/search', async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) return res.status(400).json({ error: "Gebruik ?q=zoekterm" });
    try {
        const [rows] = await db.query("SELECT * FROM items WHERE naam LIKE ?", [`%${searchTerm}%`]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/items/pagination', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const [rows] = await db.query("SELECT * FROM items LIMIT ? OFFSET ?", [limit, offset]);
        res.json({ count: rows.length, limit, offset, data: rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/items', async (req, res) => {
    try {
        const sortField = req.query.sort === 'prijs' ? 'prijs' : 'id';
        const [rows] = await db.query(`SELECT * FROM items ORDER BY ${sortField} ASC`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/items', async (req, res) => {
    const { naam, prijs } = req.body;

    if (!naam || !prijs) return res.status(400).json({ error: "Naam en prijs verplicht" });
    if (typeof prijs !== 'number') return res.status(400).json({ error: "Prijs moet een getal zijn" });
    if (/\d/.test(naam)) return res.status(400).json({ error: "Naam mag geen cijfers bevatten" });

    try {
        const [result] = await db.query("INSERT INTO items (naam, prijs) VALUES (?, ?)", [naam, prijs]);
        res.status(201).json({ message: "Bloem toegevoegd", id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/items/:id', async (req, res) => {
    const { naam, prijs } = req.body;
    try {
        const [result] = await db.query("UPDATE items SET naam = ?, prijs = ? WHERE id = ?", [naam, prijs, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Niet gevonden" });
        res.json({ message: "Bijgewerkt!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM items WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Niet gevonden" });
        res.json({ message: "Verwijderd" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


app.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/categories/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Niet gevonden" });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/categories', async (req, res) => {
    const { naam } = req.body;
    if (!naam) return res.status(400).json({ error: "Naam verplicht" });
    if (/\d/.test(naam)) return res.status(400).json({ error: "Categorienaam mag geen cijfers bevatten" });

    try {
        const [result] = await db.query("INSERT INTO categories (naam) VALUES (?)", [naam]);
        res.status(201).json({ id: result.insertId, naam });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/categories/:id', async (req, res) => {
    const { naam } = req.body;
    try {
        const [result] = await db.query("UPDATE categories SET naam = ? WHERE id = ?", [naam, req.params.id]);
        res.json({ message: "Categorie bijgewerkt" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/categories/:id', async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM categories WHERE id = ?", [req.params.id]);
        res.json({ message: "Categorie verwijderd" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
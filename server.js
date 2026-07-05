const express = require('express');
const mysql = require('mysql2');
const app = express();

// Aplikacija radi na portu 3000 (baza podataka na ucka interno koristi 3306)
const PORT = 3000; 

// Omogućavanje čitanja JSON podataka iz tijela HTTP zahtjeva
app.use(express.json());

// ---------------------------------------------------------
// SPAJANJE S BAZOM PODATAKA (MySQL)
// ---------------------------------------------------------
const db = mysql.createPool({
    host: 'ucka.veleri.hr',
    user: 'rda',      
    password: '11',      
    database: 'rda_skiller', 
    port: 3306, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Provjera statusa veze s bazom podataka
db.getConnection((err, connection) => {
    if (err) {
        console.error('Greška pri spajanju na MySQL bazu:', err.message);
    } else {
        console.log('Uspješno spojeno na MySQL bazu podataka na ucka.veleri.hr.');
        connection.release();
    }
});

// ---------------------------------------------------------
// POČETNA RUTA (Rješava problem "Cannot GET /")
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.send('SKILLer Backend API uspješno radi! Koristite rute u množini, npr. /api/izvedbe, /api/korisnici ili /api/usluge.');
});


// ---------------------------------------------------------
// 5.1. CREATE (POST) OPERACIJE - Unos novih zapisa
// ---------------------------------------------------------

// /api/korisnici (POST): Registracija novog korisnika
app.post('/api/korisnici', (req, res) => {
    const { Korisnicko_ime, Kontakt } = req.body;
    if (!Korisnicko_ime || !Kontakt) {
        return res.status(400).json({ error: 'Korisnicko_ime i Kontakt su obvezni.' });
    }
    const query = 'INSERT INTO Korisnik (Korisnicko_ime, Kontakt) VALUES (?, ?)';
    db.query(query, [Korisnicko_ime, Kontakt], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Korisnik uspješno registriran', id: results.insertId });
    });
});

// /api/ponuditelji (POST): Kreiranje profila ponuditelja
app.post('/api/ponuditelji', (req, res) => {
    const { Opis_profila, Ocjena_ponuditelja, ID_korisnika } = req.body;
    const query = 'INSERT INTO Ponuditelj_usluge (Opis_profila, Ocjena_ponuditelja, ID_korisnika) VALUES (?, ?, ?)';
    db.query(query, [Opis_profila, Ocjena_ponuditelja || 0.00, ID_korisnika], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Profil ponuditelja kreiran', id: results.insertId });
    });
});

// /api/potrazitelji (POST): Kreiranje profila potražitelja
app.post('/api/potrazitelji', (req, res) => {
    const { Opis_potreba, Ocjena_potrazitelja, ID_korisnika } = req.body;
    const query = 'INSERT INTO Potrazitelj_usluge (Opis_potreba, Ocjena_potrazitelja, ID_korisnika) VALUES (?, ?, ?)';
    db.query(query, [Opis_potreba, Ocjena_potrazitelja || 0.00, ID_korisnika], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Profil potražitelja kreiran', id: results.insertId });
    });
});

// /api/usluge (POST): Kreiranje i objava oglasa za uslugu
app.post('/api/usluge', (req, res) => {
    const { Naziv_usluge, Opis_usluge, Kategorija_usluge, ID_ponuditelja } = req.body;
    const query = 'INSERT INTO Usluga (Naziv_usluge, Opis_usluge, Kategorija_usluge, ID_ponuditelja) VALUES (?, ?, ?, ?)';
    db.query(query, [Naziv_usluge, Opis_usluge, Kategorija_usluge, ID_ponuditelja], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Usluga uspješno objavljena', id: results.insertId });
    });
});

// /api/izvedbe (POST): Pokretanje i ugovaranje nove suradnje
app.post('/api/izvedbe', (req, res) => {
    const { Vrijeme, Lokacija, Status, ID_usluge, ID_potrazitelja } = req.body;
    const query = 'INSERT INTO Izvedba (Vrijeme, Lokacija, Status, ID_usluge, ID_potrazitelja) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [Vrijeme, Lokacija, Status || 'dogovoreno', ID_usluge, ID_potrazitelja], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Izvedba uspješno inicirana', id: results.insertId });
    });
});

// /api/razgovori (POST): Unos nove stavke razgovora
app.post('/api/razgovori', (req, res) => {
    const { Dogovorena_cijena, Uvjeti, ID_izvedbe } = req.body;
    const query = 'INSERT INTO Razgovor (Dogovorena_cijena, Uvjeti, ID_izvedbe) VALUES (?, ?, ?)';
    db.query(query, [Dogovorena_cijena, Uvjeti, ID_izvedbe], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Dogovoreni uvjeti ubilježeni', id: results.insertId });
    });
});

// /api/recenzije (POST): Unos ocjene i komentara nakon posla
app.post('/api/recenzije', (req, res) => {
    const { Ocjena, Recenzija, ID_izvedbe } = req.body;
    const query = 'INSERT INTO Recenzija (Ocjena, Recenzija, ID_izvedbe) VALUES (?, ?, ?)';
    db.query(query, [Ocjena, Recenzija, ID_izvedbe], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Recenzija uspješno predana', id: results.insertId });
    });
});


// ---------------------------------------------------------
// 5.2. UPDATE (PUT) OPERACIJE - Ažuriranje postojećih zapisa
// ---------------------------------------------------------

app.put('/api/korisnici/:id', (req, res) => {
    const { Korisnicko_ime, Kontakt } = req.body;
    const query = 'UPDATE Korisnik SET Korisnicko_ime = ?, Kontakt = ? WHERE ID_korisnika = ?';
    db.query(query, [Korisnicko_ime, Kontakt, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Korisnički podaci ažurirani' });
    });
});

app.put('/api/usluge/:id', (req, res) => {
    const { Naziv_usluge, Opis_usluge, Kategorija_usluge } = req.body;
    const query = 'UPDATE Usluga SET Naziv_usluge = ?, Opis_usluge = ?, Kategorija_usluge = ? WHERE ID_usluge = ?';
    db.query(query, [Naziv_usluge, Opis_usluge, Kategorija_usluge, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Oglas za uslugu uspješno ažuriran' });
    });
});

app.put('/api/izvedbe/:id', (req, res) => {
    const { Status } = req.body;
    const query = 'UPDATE Izvedba SET Status = ? WHERE ID_izvedbe = ?';
    db.query(query, [Status, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status izvedbe promijenjen' });
    });
});

app.put('/api/ponuditelji/:id', (req, res) => {
    const { Opis_profila, Ocjena_ponuditelja } = req.body;
    const query = 'UPDATE Ponuditelj_usluge SET Opis_profila = ?, Ocjena_ponuditelja = ? WHERE ID_ponuditelja = ?';
    db.query(query, [Opis_profila, Ocjena_ponuditelja, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profil ponuditelja ažuriran' });
    });
});


// ---------------------------------------------------------
// 5.3. DELETE OPERACIJE - Uklanjanje zapisa
// ---------------------------------------------------------

app.delete('/api/izvedbe/:id', (req, res) => {
    const query = 'DELETE FROM Izvedba WHERE ID_izvedbe = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Izvedba izbrisana.' });
    });
});

app.delete('/api/korisnici/:id', (req, res) => {
    const query = 'DELETE FROM Korisnik WHERE ID_korisnika = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(400).json({ 
                error: 'Nemoguće obrisati korisnika zbog RESTRICT ograničenja u bazi.' 
            });
        }
        res.json({ message: 'Korisnik uspješno obrisan.' });
    });
});


// ---------------------------------------------------------
// 5.4. RETRIEVE/READ (GET) OPERACIJE - Popravljene i dodane sve rute u množini
// ---------------------------------------------------------

// Dohvat svih korisnika
app.get('/api/korisnici', (req, res) => {
    db.query('SELECT * FROM Korisnik', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Dohvat svih oglasa usluga
app.get('/api/usluge', (req, res) => {
    db.query('SELECT * FROM Usluga', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Dohvat svih izvedbi (Rješava grešku kod unosa /api/izvedbe)
app.get('/api/izvedbe', (req, res) => {
    db.query('SELECT * FROM Izvedba', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Dohvat svih ponuditelja
app.get('/api/ponuditelji', (req, res) => {
    db.query('SELECT * FROM Ponuditelj_usluge', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Dohvat svih potražitelja
app.get('/api/potrazitelji', (req, res) => {
    db.query('SELECT * FROM Potrazitelj_usluge', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Dohvat svih razgovora
app.get('/api/razgovori', (req, res) => {
    db.query('SELECT * FROM Razgovor', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Dohvat svih recenzija
app.get('/api/recenzije', (req, res) => {
    db.query('SELECT * FROM Recenzija', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Pojedinačni dohvat usluge preko ID-a
app.get('/api/usluge/:id', (req, res) => {
    db.query('SELECT * FROM Usluga WHERE ID_usluge = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Usluga nije pronađena' });
        res.json(results[0]);
    });
});


// ---------------------------------------------------------
// 5.5. SLOŽENE RETRIEVE/READ OPERACIJE (Hijerarhijska struktura)
// ---------------------------------------------------------

// /api/izvedbe/:id/detaljno (GET): Kompleksan JOIN s mapiranjem u objekt
app.get('/api/izvedbe/:id/detaljno', (req, res) => {
    const query = `
        SELECT 
            i.ID_izvedbe, i.Vrijeme, i.Lokacija, i.Status,
            u.ID_usluge, u.Naziv_usluge, u.Opis_usluge, u.Kategorija_usluge,
            kp.ID_korisnika AS ID_klijenta, kp.Korisnicko_ime AS Klijent_ime, kp.Kontakt AS Klijent_kontakt,
            raz.ID_razgovora, raz.Dogovorena_cijena, raz.Uvjeti,
            rec.ID_recenzije, rec.Ocjena, rec.Recenzija AS Tekst_recenzije
        FROM Izvedba i
        JOIN Usluga u ON i.ID_usluge = u.ID_usluge
        JOIN Potrazitelj_usluge pt ON i.ID_potrazitelja = pt.ID_potrazitelja
        JOIN Korisnik kp ON pt.ID_korisnika = kp.ID_korisnika
        LEFT JOIN Razgovor raz ON i.ID_izvedbe = raz.ID_izvedbe
        LEFT JOIN Recenzija rec ON i.ID_izvedbe = rec.ID_izvedbe
        WHERE i.ID_izvedbe = ?
    `;

    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Detaljna izvedba nije pronađena.' });

        const row = results[0];
        const detaljanPrikaz = {
            id_izvedbe: row.ID_izvedbe,
            vrijeme: row.Vrijeme,
            lokacija: row.Lokacija,
            status: row.Status,
            usluga: {
                id_usluge: row.ID_usluge,
                naziv_usluge: row.Naziv_usluge,
                opis_usluge: row.Opis_usluge,
                kategorija: row.Kategorija_usluge
            },
            potrazitelj: {
                id_korisnika: row.ID_klijenta,
                korisnicko_ime: row.Klijent_ime,
                kontakt: row.Klijent_kontakt
            },
            razgovor_uvjeti: row.ID_razgovora ? {
                id_razgovora: row.ID_razgovora,
                dogovorena_cijena: row.Dogovorena_cijena,
                uvjeti: row.Uvjeti
            } : null,
            recenzija: row.ID_recenzije ? {
                id_recenzije: row.ID_recenzije,
                ocjena: row.Ocjena,
                komentar: row.Tekst_recenzije
            } : null
        };

        res.json(detaljanPrikaz);
    });
});


// Pokretanje HTTP poslužitelja (Ispravljen kraj koda)
app.listen(PORT, () => {
    console.log(`SKILLer Backend API poslužitelj uspješno pokrenut na http://localhost:${PORT}`);
});
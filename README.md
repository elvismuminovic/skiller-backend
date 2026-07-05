# SKILLer - Backend API

Bok! Ovo je repozitorij s izvornim kodom za backend našeg projekta **SKILLer** (platforma za freelance poslove). Kod je napisan u Node.js-u i Expressu i služi kao dokaz za **Ishod 5** kod profesora Kaluže.

## Što smo koristili od tehnologija?
- **Runtime:** Node.js
- **Framework:** Express.js
- **Baza:** MySQL (spojeni smo direktno na `ucka.veleri.hr`, baza `rda_skiller`)

## Kako pokrenuti kod kod sebe na kompjuteru

Da bi sve radilo, samo prati ove korake:

### 1. Kloniranje / Download
Prvo kloniraj ovaj repozitorij ili samo skini `.zip` datoteku i raspakiraj je negdje na disk.

### 2. Instalacija paketa
Otvori terminal (ili onaj terminal unutar VS Code-a), uđi u mapu projekta i upiši ovo da ti povuče sve potrebne module (Express i MySQL2):
```bash
npm install
```
### 3. Pokretanje poslužitelja
Kad se sve instalira, pokreni backend poslužitelj s naredbom:
```bash
npm start
```
Nakon toga će ti u terminalu javiti da sve radi i poslužitelj će se podići na adresi: http://localhost:3000
Rute koje smo napravili (API rute)
Sve ove rute povlače stvarne podatke iz tablica koje već imamo gore na učki i prate točno ono što nam piše u Word dokumentaciji:
GET / - Obična početna stranica, čisto da se vidi da se server uspješno podigao.
GET /api/korisnici - Vraća popis svih registriranih korisnika.
GET /api/usluge - Vraća sve objavljene oglase za usluge.
GET /api/izvedbe - Vraća popis svih ugovorenih poslova / suradnji.
GET /api/ponuditelji - Vraća profile ljudi koji nude usluge.
GET /api/potrazitelji - Vraća profile klijenata koji traže usluge.
GET /api/izvedbe/:id/detaljno - Naša složena ruta (Ishod 5.5). Radi JOIN i slaže cijeli hijerarhijski JSON objekt (spaja podatke o poslu, klijentu, usluzi i recenziji ako postoji).
Autori (Tim SKILLer):
Leonardo Stankić,
Mateo Agatić,
Josip Barišić,
Elvis Muminović,
Adrian Novak

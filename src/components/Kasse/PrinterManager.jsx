const express = require('express');
const router = express.Router();
const printer = require('pdf-to-printer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment');

// 🚀 Drucker aus System abfragen
router.get('/', async (req, res) => {
  try {
    const list = await printer.getPrinters();
    res.json({ printers: list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Abrufen der Druckerliste' });
  }
});

// 📠 Druckbefehl empfangen und durchführen
router.post('/print', async (req, res) => {
  const { printerName, items } = req.body;
  if (!printerName) return res.status(400).json({ error: 'Kein Drucker angegeben' });
  try {
    const doc = new PDFDocument({ margin: 40 });
    const pdfPath = path.join(os.tmpdir(), `receipt_${Date.now()}.pdf`);
    const ws = fs.createWriteStream(pdfPath);
    doc.pipe(ws);

    // 👇 Beispiel-Inhalt; items kann genutzt werden
    doc
      .fontSize(18)
      .text('TBS SOLUTIONS', { align: 'center' })
      .moveDown()
      .fontSize(12)
      .text(`Datum: ${moment().format('DD.MM.YYYY HH:mm:ss')}`)
      .moveDown();

    if (Array.isArray(items)) {
      items.forEach(it => {
        doc.text(`${it.name} x${it.qty} – ${it.price.toFixed(2)} €`);
      });
    }

    doc.moveDown()
      .fontSize(12)
      .text('*** Ende der Quittung ***', { align: 'center' });
    doc.end();

    ws.on('finish', async () => {
      await printer.print(pdfPath, { printer: printerName });
      fs.unlink(pdfPath, () => {});
      res.json({ message: `✅ Gedruckt auf "${printerName}"` });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Druck fehlgeschlagen', details: err.message });
  }
});

module.exports = router;

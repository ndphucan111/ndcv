require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route xử lý POST từ form
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const newContact = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'contact_logs.json');

  try {
    let existing = [];

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      existing = JSON.parse(data);
    }

    existing.push(newContact);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf8');

    res.json({ success: true, message: 'Thông tin đã được lưu thành công!' });
  } catch (error) {
    console.error('❌ Lỗi khi lưu thông tin:', error);
    res.status(500).json({ success: false, message: 'Lưu thông tin thất bại.' });
  }
});

// Route mặc định
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

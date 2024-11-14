const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// تأكيد أن الخادم يقرأ بيانات الـ JSON المرسلة من العميل
app.use(bodyParser.json());

// تأكيد وجود مجلد `data` لحفظ الملفات
const dataDirectory = path.join(__dirname, 'data');
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);  // إذا لم يكن المجلد موجودًا، سيتم إنشاؤه
}

// استقبال بيانات صورة Base64 وحفظها في ملف `data.png`
app.post('/save-image', (req, res) => {
    const { imageBase64 } = req.body;

    // اسم الملف الذي سيتم حفظ الصورة فيه
    const filePath = path.join(dataDirectory, 'data.png');

    // إزالة بيانات Base64 الزائدة (مثل: "data:image/png;base64,")
    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');

    // حفظ الصورة في ملف
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('حدث خطأ أثناء حفظ الصورة:', err);
            return res.status(500).send('حدث خطأ أثناء حفظ الصورة.');
        }
        console.log('تم حفظ الصورة بنجاح!');
        res.send('تم حفظ الصورة بنجاح!');
    });
});

// بدء تشغيل الخادم على المنفذ 3000
app.listen(3000, () => {
    console.log('الخادم يعمل على http://localhost:3000');
});

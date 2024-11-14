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

// استقبال البيانات وحفظها في ملف نصي
app.post('/save-info', (req, res) => {
    const data = req.body;
    
    // اسم الملف سيكون هو عنوان الـ IP
    const fileName = path.join(dataDirectory, `${data.ip}.txt`);

    // تنسيق البيانات لتخزينها في الملف
    const content = `
        عنوان الـ IP: ${data.ip}
        معلومات المتصفح: ${data.browserInfo}
        نظام التشغيل: ${data.platform}
        لغة المتصفح: ${data.language}
        إصدار المتصفح: ${data.appVersion}
        تمكين الكوكيز: ${data.cookiesEnabled}
        عدد الأنوية في المعالج: ${data.cores}
        الذاكرة المتاحة: ${data.memory} جيجابايت
        دقة الشاشة: ${data.screenWidth}x${data.screenHeight}
        عمق الألوان: ${data.colorDepth}
    `;

    // حفظ البيانات في الملف النصي
    fs.writeFile(fileName, content, (err) => {
        if (err) {
            console.error('حدث خطأ أثناء حفظ البيانات:', err);
            return res.status(500).send('حدث خطأ أثناء حفظ البيانات.');
        }
        console.log('تم حفظ البيانات بنجاح!');
        res.send('تم حفظ البيانات بنجاح!');
    });
});

// بدء تشغيل الخادم على المنفذ 3000
app.listen(3000, () => {
    console.log('الخادم يعمل على http://localhost:3000');
});

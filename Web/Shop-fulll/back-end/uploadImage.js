// // doc excel
// const XLSX = require('xlsx');
// const path = require('path')
// const fs = require('fs');

// // Đọc tệp Excel
// const workbook = XLSX.readFile(path.join(__dirname, '../product.xlsx'));

// // Lấy tên các sheet trong workbook
// const sheetNames = workbook.SheetNames;

// // Lấy dữ liệu từ sheet đầu tiên
// const sheet = workbook.Sheets[sheetNames[0]];

// // Chuyển dữ liệu sheet thành định dạng JSON
// const data = XLSX.utils.sheet_to_json(sheet);

// // In ra dữ liệu
// console.log(data);

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * @summary
 * This feature checks if an email is right email style
 * 
 * @param {string} email - email address
 * 
 * @returns {boolean} email style is right, return true. else return false
 */
export const checkValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * @summary
 * This download excel of data
 * 
 * @param {Array} data - export data
 * @param {string} title - excel title
 * @param {string} fileName - saved file name
 */
export const exportExcel = (data, title, fileName) => {
    if (!data.length) return;

    // 1. Convert table data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(({ ...rest }) => rest)
    );

    // 2. Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // 3. Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    // 4. Save to file
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
};

export const testEnglishNumberWithoutSpecialCharacter = (min, max, text) => {
    const regex = new RegExp(`^[a-zA-Z0-9]{${min},${max}}$`);
    return regex.test(text);
}

export const testStartEnglish = (min, max, text) => {
    const regex = new RegExp(`^[A-Za-z][\\w\\-@!]{${min - 1},${max - 1}}$`);
    return regex.test(text);
}

export const testEnglishNumberDashUnderscore = (min, max, text) => {
    const regex = new RegExp(`^[A-Za-z][A-Za-z0-9_-]{${min - 1},${max - 1}}$`);
    return regex.test(text);
}
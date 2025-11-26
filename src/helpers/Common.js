import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportExcel = (data, title, fileName) => {
    if (!data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(
        data.map(({ ...rest }) => rest)
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

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
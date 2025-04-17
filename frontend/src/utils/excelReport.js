import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateExcelReport = ({ data, headers, filename }) => {
    
  if (!data || !headers || !filename) {
   
    console.error("Missing data or headers or file-name for the report.");
    return;
  }

  // Convert headers to worksheet format
  const formattedData = [headers, ...data.map((item) => headers.map((key) => item[key]))];

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // Write and save file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(dataBlob, filename);
};

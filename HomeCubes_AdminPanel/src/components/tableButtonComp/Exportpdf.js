import React from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";


const Exportpdf = ({ pdfData, fileName }) => {
  console.log("pdfData,fileName", pdfData, fileName);
  const exportPDF = () => {
    const unit = "pt";
    const size = "A2"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    // const tit
    var keys = Object.keys(pdfData[0]);
    const headers = [keys];
    var values = pdfData.map(item =>
      Object.values(item)
    )
    let content = {
      startY: 50,
      head: headers,
      body: values
    };
    doc.text(fileName, marginLeft, 10);
    doc.autoTable(content);
    doc.save(fileName)



    // var style = "<style>";
    // style = style + "table {width: 100%;font: 17px Calibri;}";
    // style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    // style = style + "padding: 2px 3px;text-align:left;}";
    // style = style + "</style>";

    // var win = window.open('', '_blank');
    // win.document.write('<html><head>');
    // win.document.write('<title>' + fileName + '</title>');
    // win.document.write(style);
    // win.document.write('</head>');
    // win.document.write('<body>');
    // win.document.write('<h1>' + fileName + '</h1>');
    // win.document.write(pdfData);
    // win.document.write('</body></html>');
    // win.print();
    // win.close();
  }

  return (
    <button className="exporting_btns" onClick={() => exportPDF()}><i class="fa-solid fa-file-pdf"></i></button>
  );

}

export default Exportpdf
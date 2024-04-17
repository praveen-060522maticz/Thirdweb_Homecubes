import React from 'react';
import { CSVLink } from "react-csv";

const Exportcsv=({csvData,fileName})=>{
    
    var header=csvData.map((item)=>
    [JSON.stringify(item)]
    )

const csvReport = {
    data: csvData,
    filename: fileName
  };


  return (
    
    <CSVLink {...csvReport} >
    <button className="exporting_btns"><i class="fa-solid fa-file-csv"></i></button>
    </CSVLink>
  );


}
export default Exportcsv;
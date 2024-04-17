import React ,{useEffect,useState}from 'react'
// import Button from '@mui/material/Button';
import * as filesaver from 'file-saver';
import XLSX from 'sheetjs-style';
// import { Tooltip } from '@mui/material';

const Exportexcel=({excelData,fileName})=>{

const fileType= 'appliction/vnd.openxmlfoemates-officedocument.spreadsheetml.sheet;charser=UTF-8';
const fileExtension = '.xlsx';

const exportexcel=async()=>{
    console.log('====================================');
    console.log(excelData);
    console.log('====================================');
    
    const ws= XLSX.utils.json_to_sheet(excelData);
    const wb = {Sheets : {"data" : ws}, SheetNames :['data']};
    const excelBuffer=XLSX.write(wb,{bookType : 'xlsx', type : 'array'});
    const data=new Blob([excelBuffer],{type : fileType});
    filesaver.saveAs(data,fileName+fileExtension);
}

    return(
        <>
        {/* <Tooltip title="export excel">
            <Button variant='contained' onClick={(e)=>exportexcel(filename)} color="primary" style={{cursor : "pointer", fontSize : 14}}>
                Excel Export
            </Button>
        </Tooltip> */}
        <button className="exporting_btns" onClick={(e)=>exportexcel(fileName)} ><i class="fa-solid fa-file-excel" ></i></button>
         {/* <button variant='contained' onClick={(e)=>exportexcel(fileName)} color="primary" className='btn bottom_btn' style={{cursor : "pointer", fontSize : 14}}>
                Excel Export
            </button> */}
        </>
    )

}

export default Exportexcel;

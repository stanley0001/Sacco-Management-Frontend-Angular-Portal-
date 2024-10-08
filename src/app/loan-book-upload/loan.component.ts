import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientsCsvData } from './LoanCsvData';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../product.service';
import { ResponseModel } from './responseModel';

@Component({
  selector: 'app-loan-book-upload',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanBookComponent implements OnInit {
  public records: any[] = [];
  page = 1;
  itemsPerPage = 10;
  pageSizes = [5, 10, 20, 50, 100];
  jsondatadisplay:any;
  @ViewChild('csvReader') csvReader: any;
  constructor(private restClient:ProductService) { 
      
  }

  ngOnInit(): void {
  }
  uploadListener($event: any): void {

  let text = [];
  let files = $event.srcElement.files;

  if (this.isValidCSVFile(files[0])) {

    let input = $event.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

      let headersRow = this.getHeaderArray(csvRecordsArray);

      this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
    };

    reader.onerror = function () {
      console.log('error is occured while reading file!');
    };

  } else {
    alert("Please import valid .csv file.");
    this.fileReset();
  }
}
//get data from csv
getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
  let csvArr = [];

  for (let i = 1; i < csvRecordsArray.length; i++) {
    let curruntRecord = (csvRecordsArray[i]).split(',');
    if (curruntRecord.length == headerLength) {
      let csvRecord: ClientsCsvData = new ClientsCsvData();
      csvRecord.customerName = curruntRecord[1]? curruntRecord[1].trim() : '';
      csvRecord.documentNumber = curruntRecord[2]? curruntRecord[2].trim() : '';
      csvRecord.phoneNumber = curruntRecord[3]? curruntRecord[3].trim() : '';
      csvRecord.loanRef = curruntRecord[4]? curruntRecord[4].trim() : '';
      csvRecord.loanStatus = curruntRecord[5]? curruntRecord[5].trim() : '';
      csvRecord.loanAmount = curruntRecord[6]? curruntRecord[6].trim() : '';
      csvRecord.interest = curruntRecord[7]? curruntRecord[7].trim() : '';
      csvRecord.penalties = curruntRecord[8]? curruntRecord[8].trim() : '';
      csvRecord.balance = curruntRecord[9]? curruntRecord[9].trim() : '';
      csvRecord.commencementDate = curruntRecord[10]? curruntRecord[10].trim() : '';
      csvRecord.dueDate = curruntRecord[11]? curruntRecord[11].trim() : '';
      csvRecord.productName = curruntRecord[12]? curruntRecord[12].trim() : '';
      csvRecord.installments = curruntRecord[13]? curruntRecord[13].trim() : '';
      
      csvArr.push(csvRecord);
    }
    
  }
  return csvArr;
}
//check etension
isValidCSVFile(file: any) {
  return file.name.endsWith(".csv");
}

getHeaderArray(csvRecordsArr: any) {
  let headers = (csvRecordsArr[0]).split(',');
  let headerArray = [];
  for (let j = 0; j < headers.length; j++) {
    headerArray.push(headers[j]);
  }
  return headerArray;
}

fileReset() {
  this.csvReader.nativeElement.value = "";
  this.records = [];
  this.jsondatadisplay = '';
}

getJsonData(){
  this.jsondatadisplay = JSON.stringify(this.records);
}
onPageSizeChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value;

  console.log("selected page size ",selectedValue)
  this.itemsPerPage = Number.parseInt(selectedValue); 
}
uploadLoanBook(){
  // console.log(this.records);
  this.restClient.uploadLoanBook(this.records).subscribe(
    (response:ResponseModel)=>{
    // console.log("response",response);
     this.fileReset()
     alert(response.message)
   },
    (error :HttpErrorResponse)=>{
     alert(error.message)
    }
);
}
}

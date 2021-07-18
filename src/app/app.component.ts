import { Component } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { concat } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product{
  name: string;
  sacCode: string;
  price: number;
  qty: number;
}
class Invoice{
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  invno: string;
  invdt: Date;
  invdt2: string;
  qr: string;

  products: Product[] = [];
  additionalDetails: string;

  constructor(){
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoice = new Invoice(); 
  
  generatePDF(action = 'open') {

    let qra1 = "upi://pay?pa=bhelbhpv@sbi&pn=Bharat Heavy Electricals Ltd.&tn=Supplier GSTIN. 37AAACB4146P7Z8; Bank A/c No. 33276118389; IFSC Code. SBIN0001675; InvNo. ";
    let qra2 = ";  InvDt. ";
    let qra3 = ";  Total Inv Val. ";
    let qra4 = "; Taxable Value. ";
    let qra5 = "&am=";
    let qra6 = "&mode=01";
//this.invoice.invdt2 = String(this.invoice.invdt.getDate()).padStart(2, '0') + "-" + String(this.invoice.invdt.getMonth() + 1).padStart(2, '0') + "-" + this.invoice.invdt.getFullYear();
//this.invoice.invdt2 = this.invoice.invdt.toLocaleDateString();  
this.invoice.qr = qra1 + this.invoice.invno + qra2 + this.invoice.invdt + qra3 + this.invoice.products.reduce((sum, p)=> sum + (p.price ), 0).toFixed(2) + qra4 + this.invoice.products.reduce((sum, p)=> sum + (p.price * ( p.qty / 100)), 0).toFixed(2) + qra5 + this.invoice.products.reduce((sum, p)=> sum + (p.price * (1 + p.qty / 100)), 0).toFixed(2) + qra6;
    //this.invoice.qr = 'upi://pay?pa=rahul@okhdfcbank&pn=GSTZen Demo Private Limited&tn=Supplier GSTIN. 37AAACB4146P7Z8; Bank A/c No. 0365856004518963; IFSC Code. SIBL0000369; InvNo. INV/001; InvDt. 16-Jul-2021; Total Inv Val. 100; Taxable Value. 100&am=100&mode=01';
    concat
    
    let docDefinition = {
      content: [
        {
          text: 'Bharat Heavy Electricals Limited',
          fontSize: 16,
          alignment: 'center',
          color: 'black'
        },
        {
          text: 'Heavy Plates and Vessels Plant',
          fontSize: 14,
          alignment: 'center',
          color: 'black'
        },
        {
          text: 'Visakhapatnam - 530012, AP, India',
          fontSize: 12,
          alignment: 'center',
          color: 'black'
        },
        {
          text: 'GSTIN: 37AAACB4146P7Z8',
          fontSize: 12,
          alignment: 'center',
          color: 'black'
        },
        {
          text: '--------------------------------------',
          fontSize: 16,
          alignment: 'center',
         color: 'black'
        },


        {
          text: 'B2C Invoice',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'black'
        },



        {
          columns: [
            [         {
              text: `Invoice No.: ${this.invoice.invno}`
              //alignment: 'right'
            },
            { 
              text: `Invoice Dt.: ${this.invoice.invdt}`
              //alignment: 'right'
            },  
              
              {
              text: 'Customer Details',
              style: 'sectionHeader'
            },
              {
                text: this.invoice.customerName,
                bold:true
              },
              { text: this.invoice.address },
              { text: this.invoice.email },
              { text: this.invoice.contactNo }
            ],
            [
              { qr: `${this.invoice.qr}`, fit: '200' ,
              alignment: 'right'}
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*','auto', 'auto', 'auto', 'auto'],
            body: [
              ['Service Description', 'SAC Code', 'Value', 'GST %','Amount'],
              ...this.invoice.products.map(p => ([p.name, p.sacCode, p.price, p.qty, (p.price * (1 + p.qty / 100)).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 4},{}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.price * (1 + p.qty / 100)), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        }
      }
    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();      
    }else{
      pdfMake.createPdf(docDefinition).open();      
    }

  }

  addProduct(){
    this.invoice.products.push(new Product());
  }
  
}

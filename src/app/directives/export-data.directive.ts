import { Directive, HostListener, Input } from '@angular/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

@Directive({
  selector: '[appExportData]',
})
export class ExportDataDirective {
  exportPdfConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'table_DL',
  };
  exportXlsConfig: ExportAsConfig = {
    type: 'xls',
    elementIdOrContent: 'table_DL',
  };
  exportCsvConfig: ExportAsConfig = {
    type: 'csv',
    elementIdOrContent: 'table_DL',
  };
  constructor(private exportAsService: ExportAsService) {}

  @Input('appExportData') type: string;
  @Input() orientation: 'portrait' | 'landscape';
  @HostListener('click', ['$event'])
  exportData() {
  //  console.log(this.type);

    if (this.type === 'pdf') {
      if (!!this.orientation) {
        this.exportPdfConfig['options'] = {
          jsPDF: { orientation: this.orientation }
        }
      }
      this.exportAsService
        .save(this.exportPdfConfig, new Date().toDateString())
        .subscribe(() => {
        //  console.log('Saved');
        });
    } else if (this.type === 'xls') {
      this.exportAsService
        .save(this.exportXlsConfig, new Date().toDateString())
        .subscribe(() => {
        //  console.log('Saved');
        });
    } else if (this.type === 'csv') {
      this.exportAsService
        .save(this.exportCsvConfig, new Date().toDateString())
        .subscribe(() => {
        //  console.log('Saved');
        });
    }
  }
}

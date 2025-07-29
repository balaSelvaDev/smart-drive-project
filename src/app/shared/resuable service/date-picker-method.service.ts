import { Injectable, TemplateRef } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatePickerMethodService {
  constructor(private modalService: NgbModal, private datePipe: DatePipe) { }

  private selectedRangeSubject = new BehaviorSubject<string>('');
  selectedRange$ = this.selectedRangeSubject.asObservable();

  private fromDateSubject = new BehaviorSubject<string>('');
  fromDate$ = this.fromDateSubject.asObservable();

  private toDateSubject = new BehaviorSubject<string>('');
  toDate$ = this.toDateSubject.asObservable();

  fromDate: NgbDateStruct | null = null;
  toDate: NgbDateStruct | null = null;
  hoveredDate: NgbDateStruct | null = null;

  fromTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  toTime: NgbTimeStruct = { hour: 17, minute: 0, second: 0 };

  today = new Date();
  validationError: string = '';

  openPicker(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  applySelection(modal: any) {
    this.validationError = '';
    if (this.fromDate && this.toDate) {
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );

      if (toDateTime < fromDateTime) {
        this.validationError = 'End date & time cannot be earlier than start date & time.';
        return;
      }

      this.updateSelectedRange();
      modal.close();
    }
  }

  updateSelectedRange() {
    if (this.fromDate && this.toDate) {
      const fromDateTime = new Date(
        this.fromDate.year, this.fromDate.month - 1, this.fromDate.day,
        this.fromTime.hour, this.fromTime.minute
      );
      const toDateTime = new Date(
        this.toDate.year, this.toDate.month - 1, this.toDate.day,
        this.toTime.hour, this.toTime.minute
      );

      const fromFormatted = this.datePipe.transform(fromDateTime, 'dd/MM/yyyy hh:mm a', 'IST') || '';
      const toFormatted = this.datePipe.transform(toDateTime, 'dd/MM/yyyy hh:mm a', 'IST') || '';
      const rangeFormatted = `[ ${fromFormatted} ] → [ ${toFormatted} ]`;

      // 🔥 Notify subscribers
      this.selectedRangeSubject.next(rangeFormatted);
      this.fromDateSubject.next(fromFormatted);
      this.toDateSubject.next(toFormatted);
    }
  }

  setDefaultRange() {
    const now = new Date();

    // fromDate = today
    this.fromDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.fromTime = { hour: now.getHours(), minute: now.getMinutes(), second: 0 };

    // toDate = tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.toDate = { year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1, day: tomorrow.getDate() };
    this.toTime = { hour: now.getHours(), minute: now.getMinutes(), second: 0 };

    // auto update
    this.updateSelectedRange();
  }
}

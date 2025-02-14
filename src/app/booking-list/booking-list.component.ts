import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BookingService } from '../core/services/booking.service';
import { Booking } from '../core/models/booking.model';
import { BookingModalComponent } from './booking-modal.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzTableModule,
    NzSelectModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzInputNumberModule,
    NzTimePickerModule,
    NzDividerModule,
    NzModalModule,
  ],
})
export class BookingListComponent implements OnInit {
  searchForm!: FormGroup;
  bookings: Booking[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 20, 50];
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      selectedDeparture: [''],
      selectedDestination: [''],
    });
    this.loadData();
  }
  loadData(): void {
    this.loading = true;
    const formValue = this.searchForm.value;

    this.bookingService
      .getBookings(
        this.pageIndex - 1,
        this.pageSize,
        formValue.selectedDeparture,
        formValue.selectedDestination
      )
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.bookings = data.content;
          this.total = data.totalElements;
          this.loading = false;
        },
        error: () => {
          this.message.error('Có lỗi xảy ra khi tải dữ liệu');
          this.loading = false;
        },
      });
  }
  search(): void {
    this.pageIndex = 1;
    this.loadData();
  }
  reset(): void {
    this.searchForm.reset();
    this.search();
  }
  showModal(booking?: Booking): void {
    console.log('Opening modal with booking:', booking);
    const modal = this.modalService.create({
      nzTitle: booking ? 'Cập nhật Booking' : 'Thêm mới Booking',
      nzContent: BookingModalComponent,
      nzWidth: 800,
      nzData: {
        booking: booking,
      },
      nzFooter: null,
      nzOnOk: () =>
        new Promise((resolve) => {
          modal.getContentComponent().submitForm((success: boolean) => {
            if (success) {
              this.loadData();
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }),
    });
  }
  delete(id: number): void {
    this.modalService.confirm({
      nzTitle: 'Xác nhận xóa',
      nzContent: 'Bạn có chắc chắn muốn xóa booking này?',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.bookingService.deleteBooking(id).subscribe({
          next: () => {
            this.message.success('Xóa thành công');
            this.loadData();
          },
          error: () => this.message.error('Có lỗi xảy ra khi xóa'),
        });
      },
    });
  }
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadData();
  }
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadData();
  }
  trackByFn(index: number, item: any): number {
    return item.id;
  }

  // Thêm helper method để hiển thị trạng thái
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }
}

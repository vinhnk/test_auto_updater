import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BookToursService } from '../core/services/booktours.service';
import { BookTour, SearchCriteria } from '../core/models/booktours.model';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@Component({
  selector: 'app-book-tours-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzDividerModule
  ],
  templateUrl: './book-tours-list.component.html',
  styleUrls: ['./book-tours-list.component.scss']
})
export class BookToursListComponent implements OnInit {
  // Danh sách book tours
  bookTours: BookTour[] = [];
  // Tổng số bản ghi
  total = 0;
  // Kích thước trang
  pageSize = 10;
  // Trang hiện tại
  currentPage = 1;
  // Trạng thái loading
  loading = false;
  // Điều kiện tìm kiếm
  searchValue = {
    customerName: '',
    phone: ''
  };
  // Modal
  isModalVisible = false;
  modalTitle = '';
  selectedBookTour: BookTour | null = null;

  constructor(
    private bookToursService: BookToursService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Load dữ liệu
  loadData(reset: boolean = false): void {
    if (reset) {
      this.currentPage = 1;
    }
    this.loading = true;

    const criteria: SearchCriteria = {
      customerName: this.searchValue.customerName,
      phone: this.searchValue.phone,
      page: this.currentPage - 1,
      size: this.pageSize
    };

    this.bookToursService.search(criteria).subscribe({
      next: (response) => {
        this.bookTours = response.content;
        this.total = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('Có lỗi xảy ra khi tải dữ liệu');
        this.loading = false;
      }
    });
  }

  // Reset form tìm kiếm
  resetSearch(): void {
    this.searchValue = {
      customerName: '',
      phone: ''
    };
    this.loadData(true);
  }

  // Xem chi tiết
  showDetail(id: number): void {
    this.loading = true;
    this.bookToursService.getDetail(id).subscribe({
      next: (bookTour) => {
        this.selectedBookTour = bookTour;
        this.modalTitle = 'Chi tiết đặt tour';
        this.isModalVisible = true;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('Có lỗi xảy ra khi tải chi tiết');
        this.loading = false;
      }
    });
  }

  // Xóa book tour
  delete(id: number): void {
    this.loading = true;
    this.bookToursService.delete(id).subscribe({
      next: () => {
        this.message.success('Xóa thành công');
        this.loadData();
      },
      error: (error) => {
        this.message.error('Có lỗi xảy ra khi xóa');
        this.loading = false;
      }
    });
  }

  // Đóng modal
  handleModalCancel(): void {
    this.isModalVisible = false;
    this.selectedBookTour = null;
  }
}
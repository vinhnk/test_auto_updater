import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { TourService } from '../core/services/tour.service';
import { Tour } from '../core/models/tour.model';
import { TourModalComponent } from '../tour-modal/tour-modal.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SecureImagePipe } from '../shared/pipes/image-url.pipe';


@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzMessageModule,
    NzIconModule,
    NzGridModule,
    SecureImagePipe


  ],
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss'],
  providers: [NzMessageService]
})
export class TourListComponent implements OnInit {
  // Danh sách tour
  tours: Tour[] = [];
  // Từ khóa tìm kiếm
  searchTitle = '';
  // Loading table
  loading = false;
  // Thông tin phân trang
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private tourService: TourService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadTours();
  }

  // Load danh sách tour
  loadTours(): void {
    this.loading = true;
    this.tourService
      .searchTours(this.searchTitle, this.pageIndex - 1, this.pageSize)
      .subscribe({
        next: (response) => {
          this.tours = response.content;

          this.total = response.totalElements;
          this.loading = false;
        },
        error: () => {
          this.message.error('Có lỗi xảy ra khi tải danh sách tour');
          this.loading = false;
        }
      });
  }

  // Xử lý tìm kiếm
  onSearch(): void {
    this.pageIndex = 1;
    this.loadTours();
  }

  // Reset form tìm kiếm
  resetSearch(): void {
    this.searchTitle = '';
    this.pageIndex = 1;
    this.loadTours();
  }

  // Mở modal thêm/sửa tour
  openModal(tour?: Tour): void {
    const modal = this.modal.create({
      nzTitle: tour ? 'Cập nhật tour' : 'Thêm mới tour',
      nzContent: TourModalComponent,
      nzData: {
        tour: tour
      },
      nzWidth: 800,
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadTours();
      }
    });
  }

  // Xóa tour
  deleteTour(id: number): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa tour này?',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.tourService.deleteTour(id).subscribe({
          next: () => {
            this.message.success('Xóa tour thành công');
            this.loadTours();
          },
          error: () => this.message.error('Có lỗi xảy ra khi xóa tour')
        });
      },
      nzCancelText: 'Hủy'
    });
  }
}
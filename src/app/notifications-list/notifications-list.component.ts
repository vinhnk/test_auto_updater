import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../core/services/notifications.service';
import { Notifications, Page } from '../core/models/notifications.model';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
  ],
})
export class NotificationsListComponent implements OnInit {
  // Danh sách notifications
  notifications: Notifications[] = [];
  // Biến cho loading state
  isLoading = false;
  // Biến search
  searchContent = '';
  searchPhone = '';

  // Biến phân trang
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'createdDate';
  sortOrder: string | null = 'desc';

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Load dữ liệu với các tham số phân trang và sắp xếp
  loadData(reset: boolean = false): void {
    console.log('loadData được gọi với reset:', reset);
    if (reset) {
      this.pageIndex = 0;
    }

    this.isLoading = true;
    const sorts = this.sortField
      ? [`${this.sortField},${this.sortOrder || 'desc'}`]
      : ['createdDate,desc'];

    this.notificationsService
      .searchNotifications(
        this.searchContent,
        this.searchPhone,
        this.pageIndex,
        this.pageSize,
        sorts
      )
      .subscribe({
        next: (data: Page<Notifications>) => {
          this.total = data.totalElements;
          this.notifications = data.content;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.isLoading = false;
        },
      });
  }

  // Xử lý sự kiện thay đổi trang hoặc sắp xếp
  onQueryParamsChange(params: NzTableQueryParams): void {
    // Kiểm tra xem có thay đổi thực sự về pageSize hoặc pageIndex không
    const isPageChanged = this.pageSize !== params.pageSize || 
                         this.pageIndex !== (params.pageIndex - 1); // Điều chỉnh pageIndex

    // Kiểm tra xem có thay đổi về sort không
    const currentSort = params.sort.find((item) => item.value !== null);
    const isSortChanged = currentSort && 
      (this.sortField !== currentSort.key || 
       this.sortOrder !== (currentSort.value === 'ascend' ? 'asc' : 'desc'));

    // Nếu không có thay đổi gì, thoát khỏi hàm
    if (!isPageChanged && !isSortChanged) {
      return;
    }

    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex - 1; // Điều chỉnh pageIndex

    if (currentSort) {
      this.sortField = currentSort.key;
      this.sortOrder = currentSort.value === 'ascend' ? 'asc' : 'desc';
    } else {
      this.sortField = 'createdDate';
      this.sortOrder = 'desc';
    }

    this.loadData();
  }

  // Xử lý tìm kiếm
  search(): void {
    this.loadData(true);
  }

  // Reset form tìm kiếm
  resetSearch(): void {
    this.searchContent = '';
    this.searchPhone = '';
    this.loadData(true);
  }
}

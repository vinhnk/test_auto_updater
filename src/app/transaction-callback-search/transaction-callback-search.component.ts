import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { TransactionCallbackService } from '../core/services/transaction-callback.service';
import { TransactionCallback } from '../core/models/transaction-callback.model';

@Component({
  selector: 'app-transaction-callback-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzDatePickerModule,
    NzButtonModule,
    NzGridModule
  ],
  templateUrl: './transaction-callback-search.component.html',
  styleUrls: ['./transaction-callback-search.component.scss']
})
export class TransactionCallbackSearchComponent implements OnInit {
  // Biến lưu trữ dữ liệu
  transactions: TransactionCallback[] = [];
  searchDate: Date | null = null;
  
  // Biến phân trang
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  
  // Biến loading
  loading = false;

  constructor(private transactionService: TransactionCallbackService) {}

  ngOnInit(): void {
    // Load dữ liệu ban đầu
    this.search();
  }

  /**
   * Xử lý khi thay đổi ngày tìm kiếm
   */
  onDateChange(date: Date): void {
    this.searchDate = date;
  }

  /**
   * Xử lý khi thay đổi trang
   */
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.search();
  }

  /**
   * Thực hiện tìm kiếm
   */
  search(): void {
    this.loading = true;

    // Tạo object search data
    const searchData: TransactionCallback = {
      createdDate: this.searchDate ? 
        this.formatDate(this.searchDate) : 
        undefined
    };

    // Gọi service search
    this.transactionService.search(
      searchData,
      this.pageIndex - 1,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.transactions = response.content;
        this.total = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Format date sang string yyyy-MM-dd
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
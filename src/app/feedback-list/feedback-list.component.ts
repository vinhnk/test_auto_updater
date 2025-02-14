import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { Feedback, FeedbackSearchCriteria } from '../core/models/feedback.model';
import { FeedbackService } from '../core/services/feedback.service';

@Component({
  selector: 'app-feedback-list',
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
    NzRateModule,
    NzDividerModule
  ],
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {
  // Dữ liệu tìm kiếm
  searchCriteria: FeedbackSearchCriteria = {
    page: 0,
    size: 10
  };
  
  // Dữ liệu bảng
  total = 0;
  loading = false;
  feedbacks: Feedback[] = [];
  
  // Modal
  isModalVisible = false;
  modalTitle = '';
  currentFeedback: Feedback = {};

  constructor(
    private feedbackService: FeedbackService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.search();
  }

  // Tìm kiếm feedback
  search(): void {
    this.loading = true;
    this.feedbackService.search(this.searchCriteria).subscribe({
      next: (response) => {
        this.feedbacks = response.content;
        this.total = response.totalElements;
        this.loading = false;
      },
      error: () => {
        this.message.error('Có lỗi xảy ra khi tải dữ liệu');
        this.loading = false;
      }
    });
  }

  // Reset form tìm kiếm
  reset(): void {
    this.searchCriteria = {
      page: 0,
      size: 10
    };
    this.search();
  }

  // Xử lý phân trang
  onPageChange(page: number): void {
    this.searchCriteria.page = page - 1;
    this.search();
  }

  // Mở modal thêm/sửa
  openModal(feedback?: Feedback): void {
    this.currentFeedback = feedback || {};
    this.modalTitle = feedback ? 'Sửa feedback' : 'Thêm mới feedback';
    this.isModalVisible = true;
  }

  // Lưu feedback
  saveFeedback(): void {
    const observable = this.currentFeedback.id ? 
      this.feedbackService.update(this.currentFeedback) :
      this.feedbackService.create(this.currentFeedback);

    observable.subscribe({
      next: () => {
        this.message.success('Lưu thành công');
        this.isModalVisible = false;
        this.search();
      },
      error: () => this.message.error('Có lỗi xảy ra khi lưu')
    });
  }

  // Xóa feedback
  deleteFeedback(id: number): void {
    this.feedbackService.delete(id).subscribe({
      next: () => {
        this.message.success('Xóa thành công');
        this.search();
      },
      error: () => this.message.error('Có lỗi xảy ra khi xóa')
    });
  }
}
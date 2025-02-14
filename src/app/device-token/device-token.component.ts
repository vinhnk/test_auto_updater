import { Component, OnInit } from '@angular/core';
import { DeviceToken } from '../core/models/device-token.model';
import { DeviceTokenService } from '../core/services/device-token.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Page } from '../core/models/notifications.model';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-device-token-list',
  templateUrl: './device-token.component.html',
  styleUrls: ['./device-token.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputNumberModule,
  ],
})
export class DeviceTokenListComponent implements OnInit {
  phoneNumber: string = '';
  deviceTokens: DeviceToken[] = [];
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  isModalVisible = false;
  isModalLoading = false;
  editingData: DeviceToken = {};

  constructor(
    private deviceTokenService: DeviceTokenService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    const criteria: DeviceToken = {
      createdBy: this.phoneNumber,
    };

    this.deviceTokenService.search(criteria).subscribe({
      next: (data: Page<DeviceToken>) => {
        this.deviceTokens = data.content;
        this.total = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  showEditModal(data: DeviceToken): void {
    this.editingData = { ...data };
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleOk(): void {
    if (!this.editingData.id) return;

    this.isModalLoading = true;
    const updateData = {
      membershipLevel: this.editingData.membershipLevel,
      numTrips: this.editingData.numTrips,
      awardPoints: this.editingData.awardPoints
    };

    this.deviceTokenService.update(this.editingData.id, updateData).subscribe({
      next: () => {
        this.message.success('Cập nhật thành công');
        this.isModalVisible = false;
        this.isModalLoading = false;
        this.search();
      },
      error: () => {
        this.message.error('Có lỗi xảy ra');
        this.isModalLoading = false;
      }
    });
  }
}

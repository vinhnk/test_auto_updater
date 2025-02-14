import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Membership } from '../core/models/membership.model';
import { MembershipService } from '../core/services/membership.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule
  ],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {
  // Danh sách membership
  memberships: Membership[] = [];
  // Form để thêm/sửa membership
  membershipForm!: FormGroup;
  // Trạng thái modal
  isModalVisible = false;
  // Trạng thái edit hay create
  isEditing = false;

  constructor(
    private membershipService: MembershipService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMemberships();
  }

  // Khởi tạo form
  initForm(): void {
    this.membershipForm = this.fb.group({
      id: [null],
      level: [null, [Validators.required]],
      bonusPointsPerTrip: [null, [Validators.required]],
      numTripsToNextLevel: [null, [Validators.required]]
    });
  }

  // Load danh sách membership
  loadMemberships(): void {
    this.membershipService.getAllMemberships().subscribe({
      next: (data) => {
        this.memberships = data;
      },
      error: (error) => {
        this.message.error('Có lỗi khi tải dữ liệu!');
      }
    });
  }

  // Mở modal thêm mới
  showCreateModal(): void {
    this.isEditing = false;
    this.membershipForm.reset();
    this.isModalVisible = true;
  }

  // Mở modal edit
  showEditModal(membership: Membership): void {
    this.isEditing = true;
    this.membershipForm.patchValue(membership);
    this.isModalVisible = true;
  }

  // Xử lý submit form
  handleSubmit(): void {
    if (this.membershipForm.valid) {
      if (this.isEditing) {
        const id = this.membershipForm.get('id')?.value;
        this.membershipService.updateMembership(id, this.membershipForm.value).subscribe({
          next: () => {
            this.message.success('Cập nhật thành công!');
            this.loadMemberships();
            this.isModalVisible = false;
          },
          error: () => {
            this.message.error('Có lỗi khi cập nhật!');
          }
        });
      } else {
        this.membershipService.createMembership(this.membershipForm.value).subscribe({
          next: () => {
            this.message.success('Thêm mới thành công!');
            this.loadMemberships();
            this.isModalVisible = false;
          },
          error: () => {
            this.message.error('Có lỗi khi thêm mới!');
          }
        });
      }
    }
  }

  // Xử lý xóa membership
  deleteMembership(id: number): void {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa?',
      nzContent: 'Hành động này không thể hoàn tác',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.membershipService.deleteMembership(id).subscribe({
          next: () => {
            this.message.success('Xóa thành công!');
            this.loadMemberships();
          },
          error: () => {
            this.message.error('Có lỗi khi xóa!');
          }
        });
      }
    });
  }
}
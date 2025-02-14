import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BranchesService } from '../core/services/branches.service';
import { Branch } from '../core/models/branches.model';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-branches-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzIconModule,
    NzGridModule,
  ],
  templateUrl: './branches-management.component.html',
  styleUrls: ['./branches-management.component.scss']
})
export class BranchesManagementComponent implements OnInit {
  // Danh sách chi nhánh
  branches: Branch[] = [];
  // Từ khóa tìm kiếm
  searchName = '';
  // Trạng thái hiển thị modal
  isModalVisible = false;
  // Chi nhánh đang được thao tác
  currentBranch: Branch = {};
  // Trạng thái loading
  isLoading = false;

  constructor(
    private branchesService: BranchesService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  /**
   * Tải danh sách chi nhánh
   */
  loadBranches(): void {
    this.isLoading = true;
    this.branchesService.getAll().subscribe({
      next: (data) => {
        this.branches = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error('Lỗi khi tải danh sách chi nhánh');
        this.isLoading = false;
      }
    });
  }

  /**
   * Tìm kiếm chi nhánh theo tên
   */
  searchBranches(): void {
    if (!this.searchName.trim()) {
      this.loadBranches();
      return;
    }

    this.branches = this.branches.filter(branch => 
      branch.name?.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }

  /**
   * Reset tìm kiếm
   */
  resetSearch(): void {
    this.searchName = '';
    this.loadBranches();
  }

  /**
   * Hiển thị modal thêm/sửa chi nhánh
   * @param branch Chi nhánh cần sửa (nếu có)
   */
  showModal(branch?: Branch): void {
    this.currentBranch = branch ? { ...branch } : {};
    this.isModalVisible = true;
  }

  /**
   * Xử lý khi bấm nút OK trên modal
   */
  handleOk(): void {
    if (!this.currentBranch.name?.trim()) {
      this.message.warning('Vui lòng nhập tên chi nhánh');
      return;
    }

    const operation = this.currentBranch.id
      ? this.branchesService.update(this.currentBranch)
      : this.branchesService.create(this.currentBranch);

    operation.subscribe({
      next: () => {
        this.message.success(`${this.currentBranch.id ? 'Cập nhật' : 'Thêm mới'} thành công`);
        this.isModalVisible = false;
        this.loadBranches();
      },
      error: (error) => {
        this.message.error(`Lỗi khi ${this.currentBranch.id ? 'cập nhật' : 'thêm mới'} chi nhánh`);
      }
    });
  }

  /**
   * Xử lý khi bấm nút Cancel trên modal
   */
  handleCancel(): void {
    this.isModalVisible = false;
  }

  /**
   * Xóa chi nhánh
   * @param branch Chi nhánh cần xóa
   */
  deleteBranch(branch: Branch): void {
    if (confirm('Bạn có chắc chắn muốn xóa chi nhánh này?')) {
      this.branchesService.delete(branch.id!).subscribe({
        next: () => {
          this.message.success('Xóa thành công');
          this.loadBranches();
        },
        error: (error) => {
          this.message.error('Lỗi khi xóa chi nhánh');
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PromotionService } from '../core/services/promotion.service';
import { Promotion } from '../core/models/promotion.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { BranchesService } from '../core/services/branches.service';
import { Branch } from '../core/models/branches.model';
import { RouteService } from '../core/services/route.service';
import { Route } from '../core/models/route.model';
import { NotificationResponse } from '../core/models/promotion.model';

@Component({
  selector: 'app-promotion-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzGridModule,
    NzInputNumberModule,
    ReactiveFormsModule,
  ],
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.scss'],
})
export class PromotionManagementComponent implements OnInit {
  promotions: Promotion[] = [];
  searchName = '';
  isModalVisible = false;
  currentPromotion: Promotion = {};
  isLoading = false;
  branches: Branch[] = [];
  routes: Route[] = [];
  selectedDates: string[] = [];
  availableTimes: string[] = [];
  selectedTimes: string[] = [];

  constructor(
    private promotionService: PromotionService,
    private message: NzMessageService,
    private branchesService: BranchesService,
    private routeService: RouteService
  ) {
    this.initializeAvailableTimes();
  }

  ngOnInit(): void {
    this.loadPromotions();
    this.loadBranches();
    this.loadRoutes();
  }

  loadPromotions(): void {
    this.isLoading = true;
    this.promotionService.getAll().subscribe({
      next: (data) => {
        this.promotions = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error('Lỗi khi tải danh sách khuyến mãi');
        this.isLoading = false;
      },
    });
  }

  searchPromotions(): void {
    if (!this.searchName.trim()) {
      this.loadPromotions();
      return;
    }

    this.isLoading = true;
    this.promotionService.findByName(this.searchName).subscribe({
      next: (data) => {
        this.promotions = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error('Lỗi khi tìm kiếm khuyến mãi');
        this.isLoading = false;
      },
    });
  }

  resetSearch(): void {
    this.searchName = '';
    this.loadPromotions();
  }

  showModal(promotion?: Promotion): void {
    if (promotion) {
      const provinces = promotion.province
        ? promotion.province.split(',').map((p) => p.trim())
        : [];
      const routes = promotion.route
        ? promotion.route.split(',').map((r) => r.trim())
        : [];

      this.selectedDates = promotion.applyDateDetail
        ? promotion.applyDateDetail.split(',')
        : [];

      this.selectedTimes = promotion.applyTimeDetail
        ? promotion.applyTimeDetail
            .split(',')
            .map((t) => this.formatTimeForDisplay(t))
        : [];

      this.currentPromotion = {
        ...promotion,
        province2: provinces,
        route2: routes,
      };
    } else {
      this.currentPromotion = {
        // status: 'DRAFT',
        status: 'INACTIVE',
        createdDate: new Date().toISOString(),
        numUsage: 0,
      };
      this.selectedDates = [];
      this.selectedTimes = [];
    }
    this.isModalVisible = true;
  }

  handleOk(): void {
    if (!this.validateForm()) {
      this.message.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const promotionToSave = { ...this.currentPromotion };

    if (Array.isArray(promotionToSave.province2)) {
      promotionToSave.province = promotionToSave.province2.join(',');
    }
    if (Array.isArray(promotionToSave.route2)) {
      promotionToSave.route = promotionToSave.route2.join(',');
    }

    console.log(promotionToSave);

    const operation = promotionToSave.id
      ? this.promotionService.update(promotionToSave)
      : this.promotionService.create(promotionToSave);

    operation.subscribe({
      next: () => {
        this.message.success(
          `${this.currentPromotion.id ? 'Cập nhật' : 'Thêm mới'} thành công`
        );
        this.isModalVisible = false;
        this.loadPromotions();
      },
      error: (error) => {
        this.message.error(
          `Lỗi khi ${
            this.currentPromotion.id ? 'cập nhật' : 'thêm mới'
          } khuyến mãi`
        );
      },
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deletePromotion(promotion: Promotion): void {
    if (confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      this.promotionService.delete(promotion.id!).subscribe({
        next: () => {
          this.message.success('Xóa thành công');
          this.loadPromotions();
        },
        error: (error) => {
          this.message.error('Lỗi khi xóa khuyến mãi');
        },
      });
    }
  }

  // Xử lý khi thay đổi loại giảm giá
  onDiscountTypeChange(): void {
    if (this.currentPromotion.discountType === 'PERCENTAGE') {
      this.currentPromotion.discountUnit = '%';
      if (
        this.currentPromotion.discountValue &&
        this.currentPromotion.discountValue > 100
      ) {
        this.currentPromotion.discountValue = 100;
      }
    } else {
      this.currentPromotion.discountUnit = 'VND';
    }
  }

  // Format hiển thị trạng thái
  getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      // DRAFT: 'Nháp',
      ACTIVE: 'Hoạt động',
      INACTIVE: 'Không hoạt động',
    };
    return statusMap[status] || status;
  }

  // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
  validateDates(): boolean {
    if (!this.currentPromotion.startDate || !this.currentPromotion.endDate) {
      return true;
    }
    return (
      new Date(this.currentPromotion.endDate) >=
      new Date(this.currentPromotion.startDate)
    );
  }

  // Override lại phương thức validateForm
  private validateForm(): boolean {
    if (!this.validateDates()) {
      this.message.warning('Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }
    return !!(
      this.currentPromotion.name?.trim() &&
      this.currentPromotion.startDate &&
      this.currentPromotion.endDate &&
      this.currentPromotion.discountType &&
      this.currentPromotion.discountValue
    );
  }

  loadBranches(): void {
    this.branchesService.getAll().subscribe(
      (data) => {
        this.branches = data;
      },
      (error) => {
        console.error('Lỗi khi tải danh sách chi nhánh:', error);
      }
    );
  }

  loadRoutes(): void {
    this.routeService.getAll().subscribe({
      next: (data) => {
        this.routes = data;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách tuyến đường:', error);
      },
    });
  }

  // Hàm kiểm tra và vô hiệu hóa các ngày nằm ngoài khoảng startDate và endDate
  disableDateSelection = (current: Date): boolean => {
    if (
      !current ||
      !this.currentPromotion.startDate ||
      !this.currentPromotion.endDate
    ) {
      return false;
    }
    const currentDate = new Date(current.setHours(0, 0, 0, 0));
    const startDate = new Date(
      new Date(this.currentPromotion.startDate).setHours(0, 0, 0, 0)
    );
    const endDate = new Date(
      new Date(this.currentPromotion.endDate).setHours(0, 0, 0, 0)
    );

    return currentDate < startDate || currentDate > endDate;
  };

  // Xử lý khi có thay đổi lựa chọn ngày
  onDateSelectionChange(dates: string[]): void {
    if (!dates) {
      this.selectedDates = [];
      this.currentPromotion.applyDateDetail = '';
      return;
    }

    this.selectedDates = dates;
    this.currentPromotion.applyDateDetail = dates.join(',');
  }

  getAvailableDates(): string[] {
    if (!this.currentPromotion.startDate || !this.currentPromotion.endDate) {
      return [];
    }

    const dates: string[] = [];
    const startDate = new Date(this.currentPromotion.startDate);
    const endDate = new Date(this.currentPromotion.endDate);

    for (
      let dt = new Date(startDate);
      dt <= endDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      dates.push(this.formatDate(dt));
    }

    return dates;
  }

  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Khởi tạo danh sách thời gian có thể chọn
  private initializeAvailableTimes(): void {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        this.availableTimes.push(`${formattedHour}:${formattedMinute}`);
      }
    }
  }

  // Xử lý khi có thay đổi lựa chọn thời gian
  onTimeSelectionChange(times: string[]): void {
    if (!times) {
      this.selectedTimes = [];
      this.currentPromotion.applyTimeDetail = '';
      return;
    }

    // Sắp xếp thời gian theo thứ tự tăng dần
    this.selectedTimes = times.sort((a, b) => {
      const [hoursA, minutesA] = a.split(':').map(Number);
      const [hoursB, minutesB] = b.split(':').map(Number);
      return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
    });

    // Cập nhật giá trị vào currentPromotion
    this.currentPromotion.applyTimeDetail = this.selectedTimes.join(',');
  }

  // Hàm format thời gian để hiển thị
  private formatTimeForDisplay(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  /**
   * Gửi thông báo cho một khuyến mãi
   * @param promotion Khuyến mãi cần gửi thông báo
   */
  sendNotification(promotion: Promotion): void {
    // Kiểm tra id tồn tại
    if (!promotion.id) {
      this.message.error('Không tìm thấy thông tin khuyến mãi');
      return;
    }

    // Thêm trạng thái đang gửi thông báo
    promotion.isNotifying = true;

    // Gọi API gửi thông báo
    this.promotionService.sendNotification(promotion.id).subscribe({
      next: (response: NotificationResponse) => {
        // Hiển thị thông báo thành công
        this.message.success(
          `Đã gửi thông báo thành công cho ${response.successCount} người dùng. ${response.message}`
        );
      },
      error: (error) => {
        // Hiển thị thông báo lỗi
        this.message.error('Lỗi khi gửi thông báo: ' + error.message);
      },
      complete: () => {
        // Xóa trạng thái đang gửi
        promotion.isNotifying = false;
      },
    });
  }
}

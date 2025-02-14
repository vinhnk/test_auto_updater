import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouteService } from '../core/services/route.service';
import { StopService } from '../core/services/stop.service';
import { Route } from '../core/models/route.model';
import { Stop } from '../core/models/stop.model';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BranchesService } from '../core/services/branches.service';
import { Branch } from '../core/models/branches.model';

@Component({
  selector: 'app-route-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzGridModule,
    NzIconModule,
    NzSelectModule,
  ],
  templateUrl: './route-management.component.html',
  styleUrls: ['./route-management.component.scss'],
})
export class RouteManagementComponent implements OnInit {
  routes: Route[] = [];
  searchName = '';
  isModalVisible = false;
  currentRoute: Route = {};
  stops: Stop[] = [];
  isLoading = false;
  branches: Branch[] = [];
  routeDirections: string[] = [];

  constructor(
    private routeService: RouteService,
    private stopService: StopService,
    private branchesService: BranchesService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
    this.loadBranches();
  }

  loadRoutes(): void {
    this.isLoading = true;
    this.routeService.getAll().subscribe({
      next: (data) => {
        this.routes = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error('Lỗi khi tải danh sách tuyến đường');
        this.isLoading = false;
      },
    });
  }

  searchRoute(): void {
    if (!this.searchName.trim()) {
      this.loadRoutes();
      return;
    }

    this.isLoading = true;
    this.routeService.findByName(this.searchName).subscribe({
      next: (data) => {
        if (data) {
          this.routes = [data];
        } else {
          this.routes = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.message.error('Lỗi khi tìm kiếm tuyến đường');
        this.isLoading = false;
      },
    });
  }

  resetSearch(): void {
    this.searchName = '';
    this.loadRoutes();
  }

  showModal(route?: Route): void {
    this.currentRoute = route || {};
    if (route?.id) {
      this.loadStops(route.id.toString());
      if (route.branchName) {
        this.updateRouteDirections(route.branchName);
      }
    } else {
      this.stops = [{ name: '', address: '' }];
    }
    this.isModalVisible = true;
  }

  loadStops(routeId: string): void {
    this.stopService.getByRouteId(routeId).subscribe({
      next: (data) => {
        this.stops = data.length ? data : [{ name: '', address: '' }];
      },
      error: (error) => {
        this.message.error('Lỗi khi tải danh sách điểm dừng');
      },
    });
  }

  addStop(): void {
    this.stops.push({ name: '', address: '' });
  }

  removeStop(index: number): void {
    if (this.stops.length > 1) {
      this.stops.splice(index, 1);
    }
  }

  handleOk(): void {
    // Validate form
    if (!this.validateForm()) {
      this.message.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const operation = this.currentRoute.id
      ? this.routeService.update(this.currentRoute)
      : this.routeService.create(this.currentRoute);

    operation.subscribe({
      next: (savedRoute) => {
        // Prepare stops with routeId
        const stopsToSave = this.stops.map((stop) => ({
          ...stop,
          routeId: savedRoute.id?.toString(),
        }));

        // Save stops
        if (this.currentRoute.id) {
          this.stopService
            .deleteByRouteId(this.currentRoute.id.toString())
            .subscribe({
              next: () => this.saveStops(stopsToSave),
              error: (error) =>
                this.message.error('Lỗi khi cập nhật điểm dừng'),
            });
        } else {
          this.saveStops(stopsToSave);
        }
      },
      error: (error) => {
        this.message.error('Lỗi khi lưu tuyến đường');
      },
    });
  }

  private saveStops(stops: Stop[]): void {
    this.stopService.createBatch(stops).subscribe({
      next: () => {
        this.message.success('Lưu thành công');
        this.isModalVisible = false;
        this.loadRoutes();
      },
      error: (error) => {
        this.message.error('Lỗi khi lưu điểm dừng');
      },
    });
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  deleteRoute(route: Route): void {
    if (confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) {
      this.routeService.delete(route.id!).subscribe({
        next: () => {
          this.stopService.deleteByRouteId(route.id!.toString()).subscribe({
            next: () => {
              this.message.success('Xóa thành công');
              this.loadRoutes();
            },
            error: (error) => this.message.error('Lỗi khi xóa điểm dừng'),
          });
        },
        error: (error) => {
          this.message.error('Lỗi khi xóa tuyến đường');
        },
      });
    }
  }

  private validateForm(): boolean {
    if (
      !this.currentRoute.name ||
      !this.currentRoute.branchName ||
      !this.currentRoute.routeDirection ||
      !this.currentRoute.departurePoint ||
      !this.currentRoute.destinationPoint ||
      !this.currentRoute.totalDistance ||
      !this.currentRoute.completionTime ||
      !this.currentRoute.price ||
      !this.currentRoute.firstTripTime ||
      !this.currentRoute.lastTripTime ||
      !this.currentRoute.timeBetweenTrips
    ) {
      return false;
    }
    return this.stops.every((stop) => stop.name && stop.address);
  }

  loadBranches(): void {
    this.branchesService.getAll().subscribe({
      next: (data) => {
        this.branches = data;
      },
      error: (error) => {
        this.message.error('Lỗi khi tải danh sách chi nhánh');
      }
    });
  }

  updateRouteDirections(branchName: string) {
    if (branchName) {
      // Reset routeDirection khi thay đổi chi nhánh
      this.currentRoute.routeDirection = '';
      
      this.routeDirections = [
        `Hà Nội-${branchName}`,
        `${branchName}-Hà Nội`
      ];
      // Tự động chọn chiều đi đầu tiên
      this.currentRoute.routeDirection = this.routeDirections[0];
    } else {
      this.routeDirections = [];
      this.currentRoute.routeDirection = '';
    }
  }
}

import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { API_CONFIG } from '../shared/common';
import { NotificationsService } from '../core/services/notifications.service';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzMessageModule,
    NzTypographyModule,
    NzGridModule,
    NzIconModule,
  ],
})
export class PushNotificationComponent {
  // Biến lưu danh sách số điện thoại (dạng text)
  phoneList: string = '';
  // Biến lưu tiêu đề thông báo
  title: string = '';
  // Biến lưu nội dung tin nhắn
  content: string = '';
  // Biến kiểm soát trạng thái loading khi gửi request
  isLoading = false;

  constructor(
    private notificationsService: NotificationsService,
    private message: NzMessageService
  ) {}

  // Hàm xử lý khi click nút Send
  onSend(): void {
    // Kiểm tra dữ liệu đầu vào
    if (!this.phoneList.trim() || !this.title.trim() || !this.content.trim()) {
      this.message.error('Vui lòng nhập đầy đủ số điện thoại, tiêu đề và nội dung!');
      return;
    }

    // Chuyển đổi danh sách phone từ text sang mảng
    const phones = this.phoneList
      .split('\n')
      .map((phone) => phone.trim())
      .filter((phone) => phone); // Lọc bỏ các dòng trống

    // Chuẩn bị payload
    const payload = {
      phones,
      title: this.title.trim(),
      content: this.content.trim(),
    };

    // Gọi API với đường dẫn từ config
    this.isLoading = true;
    this.notificationsService.pushNotification(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          this.message.success(response.message);
        },
        error: (error) => {
          this.message.error(
            'Có lỗi xảy ra khi gửi thông báo: ' + error.message
          );
        },
      });
  }

  // Hàm reset form
  onReset(): void {
    this.phoneList = '';
    this.title = '';
    this.content = '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'secureImage',
  standalone: true,
})
export class SecureImagePipe implements PipeTransform {
  transform(url: string | undefined): string {
    if (!url) return '';

    // Thay thế domain gốc bằng proxy path
    const fileName = url.split('/').pop();
    const bucketName = 'tour'; // hoặc lấy từ URL gốc nếu cần

    return `${environment.apiUrl}/api/storage/image/${fileName}?bucketName=${bucketName}`;
  }
}

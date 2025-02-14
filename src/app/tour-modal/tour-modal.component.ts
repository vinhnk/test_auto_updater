import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Tour } from '../core/models/tour.model';
import { TourService } from '../core/services/tour.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { API_CONFIG } from '../shared/common';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';


// Đăng ký các font size tùy chỉnh
const Size: any = Quill.import('attributors/style/size');
Size.whitelist = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '36px'];
Quill.register(Size, true);

// Đăng ký các font family tùy chỉnh
const Font: any = Quill.import('attributors/style/font');
Font.whitelist = [
  'Arial',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Raleway',
  'Poppins',
  'Dancing Script',
  'Playfair Display'
];
Quill.register(Font, true);

// Cấu hình Video Blot tùy chỉnh
const Video = Quill.import('formats/video');
const BlockEmbed: any = Quill.import('blots/block/embed');

class VideoBlot extends BlockEmbed {
  static create(url: string) {
    const node = super.create();
    node.setAttribute('src', url);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    node.setAttribute('class', 'ql-video');
    return node;
  }

  static value(node: HTMLElement) {
    return node.getAttribute('src');
  }
}
VideoBlot['blotName'] = 'video';
VideoBlot['tagName'] = 'iframe';

Quill.register(VideoBlot, true);

@Component({
  selector: 'app-tour-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    QuillModule,
    NzCheckboxModule,
    NzRadioModule,
    FormsModule
  ],
  templateUrl: './tour-modal.component.html',
  styleUrls: ['./tour-modal.component.scss'],
})
export class TourModalComponent implements OnInit {
  tour?: Tour;
  form!: FormGroup;

  // Cấu hình Quill Editor
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'size': ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '36px'] }],
      [{ 'font': [
        'Arial',
        'Roboto',
        'Open Sans',
        'Montserrat',
        'Lato',
        'Raleway',
        'Poppins',
        'Dancing Script',
        'Playfair Display'
      ]}],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      // ['clean']
    ],
    imageUploader: {
      upload: (file: File) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('bucketName', 'tour');

          this.http.post(`${API_CONFIG.BASE_URL}/api/storage/upload-file`, formData)
            .subscribe({
              next: (response: any) => {
                if (response.code === '200') {
                  const imageUrl = response.data.path;
                  resolve(imageUrl);
                } else {
                  reject('Upload failed');
                }
              },
              error: (error) => {
                reject(error);
                this.message.error('Có lỗi xảy ra khi tải ảnh lên');
              }
            });
        });
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private tourService: TourService,
    private message: NzMessageService,
    private http: HttpClient,
    @Inject(NZ_MODAL_DATA) private modalData: { tour: Tour }
  ) {
    this.tour = modalData.tour;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // Khởi tạo form
  private initForm(): void {
    this.form = this.fb.group({
      title: [this.tour?.title || '', [Validators.required]],
      image: [this.tour?.image || '', [Validators.required]],
      price: [
        this.tour?.price || null,
        [Validators.required, Validators.min(0)],
      ],
      location: [this.tour?.location || '', [Validators.required]],
      duration: [
        this.tour?.duration || null,
        [Validators.required, Validators.min(1)],
      ],
      description: [this.tour?.description || ''],
      fromDate: [
        this.tour?.fromDate ? new Date(this.tour.fromDate) : null,
        [Validators.required],
      ],
      toDate: [
        this.tour?.toDate ? new Date(this.tour.toDate) : null,
        [Validators.required],
      ],
      status: [this.tour?.status || 1, [Validators.required]],
      bannerImage: [this.tour?.bannerImage || ''],
      shortDescription: [this.tour?.shortDescription || ''],
      isFeatured: [this.tour?.isFeatured || 0],
      isBestSeller: [this.tour?.isBestSeller || 0],
      isNew: [this.tour?.isNew || 0],
    });
  }

  // Submit form
  onSubmit(): void {
    if (this.form.valid) {
      const data = {
        ...this.tour,
        ...this.form.value,
      };

      const request = this.tour
        ? this.tourService.updateTour(data)
        : this.tourService.createTour(data);

      request.subscribe({
        next: () => {
          this.message.success(
            `${this.tour ? 'Cập nhật' : 'Thêm mới'} tour thành công`
          );
          this.modal.close(true);
        },
        error: () => {
          this.message.error(
            `Có lỗi xảy ra khi ${this.tour ? 'cập nhật' : 'thêm mới'} tour`
          );
        },
      });
    }
  }

  // Đóng modal
  onCancel(): void {
    this.modal.close();
  }

  // Thêm method xử lý upload
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', 'tour');

      this.http
        .post(`${API_CONFIG.BASE_URL}/api/storage/upload-file`, formData)
        .subscribe({
          next: (response: any) => {
            if (response.code === '200') {
              // Cập nhật giá trị vào form control
              this.form.patchValue({
                image: response.data.path
              });
              this.message.success('Tải ảnh lên thành công');
            } else {
              this.message.error('Tải ảnh lên thất bại');
            }
          },
          error: (error) => {
            this.message.error('Có lỗi xảy ra khi tải ảnh lên');
            console.error('Upload error:', error);
          }
        });
    }
  }

  onBannerSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', 'tour');

      this.http
        .post(`${API_CONFIG.BASE_URL}/api/storage/upload-file`, formData)
        .subscribe({
          next: (response: any) => {
            if (response.code === '200') {
              this.form.patchValue({
                bannerImage: response.data.path
              });
              this.message.success('Tải banner lên thành công');
            } else {
              this.message.error('Tải banner lên thất bại');
            }
          },
          error: (error) => {
            this.message.error('Có lỗi xảy ra khi tải banner lên');
            console.error('Upload error:', error);
          }
        });
    }
  }

  onCheckboxChange(controlName: string, checked: boolean): void {
    this.form.get(controlName)?.setValue(checked ? 1 : 0);
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BookingService } from '../core/services/booking.service';
import { Booking } from '../core/models/booking.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzSwitchModule,
    NzSelectModule,
  ],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
})
export class BookingModalComponent implements OnInit {
  booking?: Booking;
  form!: FormGroup;
  loading = false;
  isViewMode = true;
  showSaveButton = false;
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA) private modalData: { booking: Booking }
  ) {
    this.booking = modalData.booking;
  }
  ngOnInit(): void {
    this.initForm();
    if (this.booking) {
      this.form.patchValue(this.booking);
      this.booking.passengers?.forEach((passenger) => {
        this.addPassenger(passenger);
      });
      Object.keys(this.form.controls).forEach((key) => {
        if (!['status', 'payAdvance', 'payType'].includes(key)) {
          this.form.get(key)?.disable();
        }
      });

      ['status', 'payAdvance', 'payType'].forEach(field => {
        this.form.get(field)?.valueChanges.subscribe(() => {
          this.showSaveButton = true;
        });
      });
    }
  }
  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      passengerCount: [1, [Validators.required, Validators.min(1)]],
      selectedDeparture: ['', [Validators.required, Validators.minLength(2)]],
      selectedDestination: ['', [Validators.required, Validators.minLength(2)]],
      selectedDate: [null, [Validators.required]],
      departureTime: [
        '',
        [
          Validators.required,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
        ],
      ],
      arrivalTime: [
        '',
        [
          Validators.required,
          Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
        ],
      ],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [0, [Validators.required, Validators.min(0)]],
      passengers: this.fb.array([]),
      departurePoint: ['', [Validators.required]],
      destinationPoint: ['', [Validators.required]],
      hasDiscount: [false],
      status: [0, [Validators.required]],
      note: [''],
      payAdvance: [0, [Validators.required, Validators.min(0)]],
      payType: ['', [Validators.required]],
      createdBy: ['', [Validators.required]],
    });
  }
  get passengers(): FormArray {
    return this.form.get('passengers') as FormArray;
  }
  addPassenger(passenger?: any): void {
    const passengerForm = this.fb.group({
      id: [passenger?.id],
      fullName: [
        passenger?.fullName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      birthYear: [
        passenger?.birthYear || '',
        [Validators.required, Validators.pattern('^\\d{4}$')],
      ],
      phoneNumber: [
        passenger?.phoneNumber || '',
        [Validators.required, Validators.pattern('^[0-9]{10,11}$')],
      ],
      pickupPoint: [
        passenger?.pickupPoint || '',
        [Validators.required, Validators.minLength(5)],
      ],
      dropoffPoint: [
        passenger?.dropoffPoint || '',
        [Validators.required, Validators.minLength(5)],
      ],
    });
    this.passengers.push(passengerForm);
  }
  removePassenger(index: number): void {
    this.passengers.removeAt(index);
  }
  handleSave(): void {
    this.submitForm((success: boolean) => {
      if (success) {
        // Có thể thêm xử lý sau khi lưu thành công
      }
    });
  }
  submitForm(callback: (success: boolean) => void): void {
    if (this.form.valid) {
      this.loading = true;
      const updateData = {
        id: this.booking?.id,
        status: this.form.get('status')?.value,
        payAdvance: this.form.get('payAdvance')?.value,
        payType: this.form.get('payType')?.value
      };

      this.bookingService.partialUpdateBooking(updateData).subscribe({
        next: () => {
          this.message.success('Cập nhật thành công');
          callback(true);
        },
        error: () => {
          this.message.error('Có lỗi xảy ra');
          callback(false);
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      callback(false);
    }
  }
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }
}

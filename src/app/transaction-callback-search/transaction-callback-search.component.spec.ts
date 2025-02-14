import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionCallbackSearchComponent } from './transaction-callback-search.component';

describe('TransactionCallbackSearchComponent', () => {
  let component: TransactionCallbackSearchComponent;
  let fixture: ComponentFixture<TransactionCallbackSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCallbackSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionCallbackSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

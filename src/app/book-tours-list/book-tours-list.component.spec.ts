import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookToursListComponent } from './book-tours-list.component';

describe('BookToursListComponent', () => {
  let component: BookToursListComponent;
  let fixture: ComponentFixture<BookToursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookToursListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookToursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

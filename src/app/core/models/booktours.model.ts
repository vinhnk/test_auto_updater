// Interface cho thông tin tour
export interface Tour {
    id: number;
    title: string;
    image: string;
    price: number;
    location: string;
    duration: number;
    description: string;
    fromDate: string;
    toDate: string;
    bannerImage: string;
    shortDescription: string;
  }
  
  // Interface cho thông tin đặt tour
  export interface BookTour {
    id: number;
    tourId: number;
    customerName: string;
    phone: string;
    email: string;
    numAdults: number;
    numChildren: number;
    tourDate: string;
    customRequest: string;
    createdAt: string;
    tour?: Tour; // Thông tin tour (optional)
  }
  
  // Interface cho response phân trang
  export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
  
  // Interface cho tham số tìm kiếm
  export interface SearchCriteria {
    customerName?: string;
    phone?: string;
    page: number;
    size: number;
  }
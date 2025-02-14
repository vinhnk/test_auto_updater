export interface Tour {
    id?: number;
    title?: string;
    image?: string;
    price?: number;
    location?: string;
    duration?: number;
    description?: string;
    fromDate?: string;
    toDate?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    status?: number;
    bannerImage?: string;
    shortDescription?: string;
    isFeatured?: number;
    isBestSeller?: number;
    isNew?: number;
  }
  
  export interface TourSearchResponse {
    content: Tour[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
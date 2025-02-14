export interface Notifications {
    id: number;
    code: string;
    content: string;
    sentDate: Date;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    phone: string;
    title: string;
    isRead: boolean;
  }
  
  export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
export interface Booking {
  id?: number;
  passengerCount: number;
  selectedDeparture: string;
  selectedDestination: string;
  selectedDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  originalPrice: number;
  departurePoint: string;
  destinationPoint: string;
  hasDiscount: number;
  status: number;
  note?: string;
  payAdvance: number;
  payType: string;
  createdBy: string;
  passengers?: Passenger[];
  branchName: string;
  routeName: string;
}

export interface Passenger {
  id?: number;
  fullName: string;
  birthYear: string;
  phoneNumber: string;
  pickupPoint: string;
  dropoffPoint: string;
  booking?: Booking;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

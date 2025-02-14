export interface DeviceToken {
  id?: number;
  notiTokenCode?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  membershipLevel?: number;
  numTrips?: number;
  awardPoints?: number;
}

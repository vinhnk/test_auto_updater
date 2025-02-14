export interface Route {
    id?: number;
    branchName?: string;
    routeDirection?: string;
    name?: string;
    departurePoint?: string;
    destinationPoint?: string;
    totalDistance?: number;
    completionTime?: number;
    price?: number;
    firstTripTime?: string;
    lastTripTime?: string;
    timeBetweenTrips?: number;
  }
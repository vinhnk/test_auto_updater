export interface Feedback {
    id?: number;
    content?: string;
    rating?: number;
    customerName?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    status?: number;
}

export interface FeedbackSearchCriteria {
    customerName?: string;
    content?: string;
    page?: number;
    size?: number;
}
/**
 * Interface định nghĩa cấu trúc dữ liệu TransactionCallback
 */
export interface TransactionCallback {
    id?: number;
    transactionid?: string;
    transactiontime?: number;
    referencenumber?: string;
    amount?: number;
    content?: string;
    bankaccount?: string;
    orderId?: string;
    sign?: string;
    terminalCode?: string;
    urlLink?: string;
    serviceCode?: string;
    subTerminalCode?: string;
    createdDate?: string;
}

/**
 * Interface định nghĩa cấu trúc response phân trang
 */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
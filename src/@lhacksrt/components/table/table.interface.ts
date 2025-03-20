export interface TableColumn<T> {
    label: string;
    property: keyof T ;
    type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'calendar' | 'input';
    visible?: boolean;
    cssClasses?: string[];
}


export interface TableOptions<T> {
    title: string;
    columns: TableColumn<T>[];
    actions: TableActions<T>[];
    pageSize: number;
    pageSizeOptions: number[];
    imageOptions?: TablePropertyOptions<T>;
    badgeOptions?: TablePropertyOptions<T>;
    progressOptions?: TablePropertyOptions<T>;
    checkboxOptions?: TablePropertyOptions<T>;
    calendarDailyOptions?: TablePropertyOptions<T>;
    calendarWeeklyOptions?: TablePropertyOptions<T>;
    calendarMonthlyTotalOptions?: TablePropertyOptions<T>;
    calendarMonthlyByDayOptions?: TablePropertyOptions<T>;
    
    renderItem: (element: T, property: keyof T) => void;
    updateItem?: (element: T) => void;
}



export interface TablePropertyOptions<T> {
    label: string;
    property: string;
    cssClasses?: string[];
    onClick?: (element: T) => void;
} 

export interface TableActions<T> {
    label: string;
    icon: string;
    iconColor?: string;
    action: (element: T) => void;
    cssClasses?: string[];
}
export type Status = 'idle' | 'loading' | 'error' | 'success';

export interface Task {
    id: number;
    name: string;
    description?: string;
    delivered_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface MetaData {
    total: number;
    is_first_page: boolean;
    is_last_page: boolean;
    current_page: number;
    next_page: number;
    previous_page: number;
}

export interface PaginatedTasks {
    data: Task[];
    meta: MetaData
}

export interface InitialStateInterface {
    list: {
        data: PaginatedTasks | null;
        status: Status;
    },
    show: {
        status: Status;
        errorMessage: string;
    },
    create: {
        status: Status;
        errorMessage: string;
    };
    update: {
        status: Status;
        errorMessage: string;
    };
    delete: {
        status: Status;
        errorMessage: string;
    };
}
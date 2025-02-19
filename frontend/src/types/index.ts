export interface Task {
    id: number;
    title: string;
    text: string;
    description: string;
    source: string;
    task_number: string;
    topic: string;
    created_at: string;
    solution: string;
    explanation?: string;
    task_url?: string;
    image_data?: string;
    image_type?: string;
    solution_file?: string;
    solution_filename?: string;
}

export interface Topic {
    id: number;
    name: string;
    description?: string;
}

export interface TaskCreate {
    taskNumber: string;
    site: 'kompege' | 'polykov';
    text: string;
    topic: string;
    solution: string;
    explanation?: string;
    task_url?: string;
    image_data?: string;
    image_type?: string;
    solution_file?: string;
    solution_filename?: string;
}
export interface Task {
    id: number;
    title: string;
    text: string;
    description: string;
    source: string;
    task_number: string;
    topic: string;
    solution: string;
    explanation: string | null;
    task_url: string | null;
    image_url: string | null;
    image_data: string | null;
    image_type: string | null;
    solution_file: string | null;
    solution_filename: string | null;
    created_at: string;
}

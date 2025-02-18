export interface Task {
    id: number;
    title: string;
    text: string;
    description: string;
    source: string;
    task_number: string;
    topic: string;
    explanation: string | null;
    created_at: string;
}

export interface OnboardingTask {
    id: number;
    title: string;
    description: string | null;
    isCompleted: boolean;
    employeeId: number;
}

export interface Employee {
    id: number;
    fullName: string;
    role: string;
    department: string;
    onboardingTasks: OnboardingTask[];
}
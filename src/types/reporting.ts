export type ReportingPeriod = '7d' | '30d' | 'quarter' | 'ytd' | 'custom';

export type ExecutiveReportSummary = {
   headcount: number;
   activeProjects: number;
   completedTasks: number;
   overallEfficiency: number;
   totalHoursWorked: number;
   totalEstimatedHours: number;
   budgetVariancePercentage: number;
   averagePerformanceRating: number;
   bonusExpenditure: number;
   warningsCount: number;
   logComplianceRate: number;
};

export type DepartmentBreakdown = {
   department: string;
   headcount: number;
   taskCount: number;
   completionRate: number;
   hoursLogged: number;
};

export type EmployeeProductivityMetric = {
   id: string;
   name: string;
   role: string;
   team: string;
   tasksDone: number;
   hoursLogged: number;
   rating: number;
   velocity: number;
};


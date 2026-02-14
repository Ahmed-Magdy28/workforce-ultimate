// export const calculateProgress = (categories: unknown[]) => {
//    const totalTasks = categories.reduce(
//       (sum, cat) => sum + cat.tasks.length,
//       0,
//    );
//    const completedTasks = categories.reduce(
//       (sum, cat) =>
//          sum + cat.tasks.filter((t) => t.status === 'completed').length,
//       0,
//    );
//    return Math.round((completedTasks / totalTasks) * 100);
// };
// export const  getStatusBadge = (status: 'completed' | 'in-progress' | 'pending') => {
//       const statusConfig = {
//          completed: {
//             label: t('roadmap.status.completed', 'Completed'),
//             variant: 'default' as const,
//             icon: <CheckCircle2 className="h-3 w-3" />,
//          },
//          'in-progress': {
//             label: t('roadmap.status.inProgress', 'In Progress'),
//             variant: 'secondary' as const,
//             icon: <ArrowRight className="h-3 w-3" />,
//          },
//          pending: {
//             label: t('roadmap.status.pending', 'Pending'),
//             variant: 'outline' as const,
//             icon: <Target className="h-3 w-3" />,
//          },
//       };}
//       return statusConfig[status];
//    };

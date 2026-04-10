import { Helmet } from 'react-helmet-async';
export default function EmployeeDashboard() {
   return (
      <>
         <Helmet>
            <title>Employee Dashboard | Workforce</title>
            <meta
               name="description"
               content="Track your daily tasks and performance"
            />
         </Helmet>
         <h1 className="text-xl font-semibold">Employee Dashboard</h1>
      </>
   );
}

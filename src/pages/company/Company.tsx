import { Spinner } from '@/components/ui/spinner';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';
import CompanyData from '@/features/company/CompanyData';
import NewCompany from '@/features/company/NewCompany';
import { useQuery } from '@tanstack/react-query';

export default function Company() {
   const user = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
   });
   if (user.isLoading) return <Spinner />;
   const userData = user.data?.user_metadata;
   const company = userData?.company;
   if (!company) return <NewCompany />;
   return <CompanyData />;
}

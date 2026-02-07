import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function Navbar() {
   const dispatch = useDispatch();

   return (
      <header className="h-14 bg-white border-b flex items-center justify-end px-4">
         <button
            onClick={() => dispatch(logout())}
            className="text-sm text-red-600"
         >
            Logout
         </button>
      </header>
   );
}

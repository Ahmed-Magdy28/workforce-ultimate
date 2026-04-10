import { Link } from 'react-router';
import {
   ChevronDown,
   CircleHelp,
   ClipboardCheck,
   Clock3,
   Palette,
   Search,
   Settings,
   Trash2,
   UserRoundPlus,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import useLogout from '@/features/auth/hooks/useLogout';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';
import { getCurrentUserCompanyAPI } from '@/features/company/api/companyApis';
import { Input } from '@/components/ui/input';

function getWorkspaceTitle(fullName: string) {
   return `${fullName}'s Workspace`;
}

function getInitials(fullName: string) {
   return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
}

function MenuRow({
   children,
   className = '',
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div
         className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted ${className}`}
      >
         {children}
      </div>
   );
}

export default function Navbar() {
   const { logout, isLoggingOut } = useLogout();
   const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
   const { data: user } = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
   });
   const { data: company } = useQuery({
      queryKey: ['current-company'],
      queryFn: getCurrentUserCompanyAPI,
   });

   const fullName =
      (user?.user_metadata?.fullName as string | undefined) || 'Workspace user';
   const userAvatar = user?.user_metadata?.avatar as string | undefined;
   const workspaceAvatar = company?.logo_url || userAvatar;
   const workspaceTitle = getWorkspaceTitle(fullName);
   const userStatus = user ? 'Online' : 'Offline';

   return (
      <header className="grid h-12 grid-cols-[auto_1fr_auto] items-center gap-4 border-b bg-background px-4">
         <div className="relative">
            <button
               type="button"
               onClick={() => setIsWorkspaceMenuOpen((open) => !open)}
               className="flex items-center gap-2 rounded-xl border bg-card px-2.5 py-1 shadow-sm transition-colors hover:bg-muted"
            >
               {workspaceAvatar ? (
                  <img
                     src={workspaceAvatar}
                     alt={workspaceTitle}
                     className="size-7 rounded-md object-cover"
                  />
               ) : (
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
                     {getInitials(fullName)}
                  </div>
               )}
               <p className="text-xs font-semibold">{workspaceTitle}</p>
               <ChevronDown
                  className={
                     isWorkspaceMenuOpen
                        ? 'size-3.5 rotate-180 text-muted-foreground transition-transform'
                        : 'size-3.5 text-muted-foreground transition-transform'
                  }
               />
            </button>

            {isWorkspaceMenuOpen ? (
               <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-80 rounded-2xl border bg-card p-3 shadow-xl">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
                     {workspaceAvatar ? (
                        <img
                           src={workspaceAvatar}
                           alt={workspaceTitle}
                           className="size-11 rounded-xl object-cover"
                        />
                     ) : (
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 font-semibold text-primary">
                           {getInitials(fullName)}
                        </div>
                     )}
                     <div>
                        <p className="font-semibold">{workspaceTitle}</p>
                        <p className="text-sm text-muted-foreground">
                           {company?.name || 'Workspace'}
                        </p>
                     </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 p-4">
                     <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                           Current plan
                        </p>
                        <p className="mt-1 font-semibold">
                           {(company?.plan ?? 'free').toUpperCase()}
                        </p>
                     </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                     <Link
                        to="/app/settings"
                        onClick={() => setIsWorkspaceMenuOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                     >
                        <Settings className="size-4" />
                        Settings
                     </Link>

                     <Link
                        to="/people"
                        onClick={() => setIsWorkspaceMenuOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                     >
                        <UserRoundPlus className="size-4" />
                        People
                     </Link>
                  </div>
               </div>
            ) : null}
         </div>

         <div className="mx-auto w-full max-w-xl">
            <div className="relative">
               <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
               <Input
                  type="search"
                  placeholder="Search tasks later..."
                  className="h-8 rounded-full pl-9"
               />
            </div>
         </div>

         <div className="relative group">
            <button
               type="button"
               className="relative rounded-full p-0.5 transition-transform hover:scale-[1.02]"
            >
               {userAvatar ? (
                  <img
                     src={userAvatar}
                     alt={fullName}
                     className="size-8 rounded-full object-cover"
                  />
               ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                     {getInitials(fullName)}
                  </div>
               )}
               <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-green-500" />
            </button>

            <div className="invisible absolute right-0 top-[calc(100%+0.5rem)] z-30 w-80 rounded-2xl border bg-card p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
               <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-3">
                  {userAvatar ? (
                     <img
                        src={userAvatar}
                        alt={fullName}
                        className="size-10 rounded-full object-cover"
                     />
                  ) : (
                     <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {getInitials(fullName)}
                     </div>
                  )}
                  <div>
                     <p className="font-semibold">{workspaceTitle}</p>
                     <p className="text-sm text-muted-foreground">
                        {userStatus}
                     </p>
                  </div>
               </div>

               <div className="mt-3 space-y-1">
                  <div className="relative group/status">
                     <MenuRow className="cursor-default">
                        <span>Set status</span>
                        <span className="text-muted-foreground">›</span>
                     </MenuRow>
                     <div className="invisible absolute top-0 right-full mr-2 w-72 rounded-2xl border bg-card p-3 opacity-0 shadow-xl transition-all group-hover/status:visible group-hover/status:opacity-100">
                        <p className="mb-3 text-sm font-semibold">
                           For {workspaceTitle}
                        </p>
                        <div className="space-y-1">
                           <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                              <div>📆 In a meeting</div>
                              <div className="text-muted-foreground">
                                 — for an hour
                              </div>
                           </button>
                           <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                              <div>📚 Focusing</div>
                              <div className="text-muted-foreground">
                                 — until Saturday
                              </div>
                           </button>
                           <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                              <div>🤒 Sick</div>
                              <div className="text-muted-foreground">
                                 — OOO for Today
                              </div>
                           </button>
                           <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                              <div>🏖️ Vacation</div>
                              <div className="text-muted-foreground">
                                 — OOO until Saturday
                              </div>
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="relative group/mute">
                     <MenuRow className="cursor-default">
                        <span>Mute notifications</span>
                        <span className="text-muted-foreground">›</span>
                     </MenuRow>
                     <div className="invisible absolute top-0 right-full mr-2 w-64 rounded-2xl border bg-card p-3 opacity-0 shadow-xl transition-all group-hover/mute:visible group-hover/mute:opacity-100">
                        <p className="mb-3 text-sm font-semibold">
                           Mute notifications
                        </p>
                        <div className="space-y-1 text-sm">
                           {[
                              'Mute for 30 minutes',
                              'For 1 hour',
                              'For 2 hours',
                              'Until tomorrow',
                              'Until next week',
                              'Until I return',
                           ].map((option) => (
                              <button
                                 key={option}
                                 className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-muted"
                              >
                                 <span>{option}</span>
                                 <span className="text-muted-foreground">
                                    On
                                 </span>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <Link to="/app/settings">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <Settings className="size-4" />
                           Settings
                        </span>
                     </MenuRow>
                  </Link>

                  <button className="w-full text-left">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <Palette className="size-4" />
                           Themes
                        </span>
                     </MenuRow>
                  </button>

                  <Link to="/app/help">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <CircleHelp className="size-4" />
                           Help
                        </span>
                     </MenuRow>
                  </Link>
               </div>

               <div className="my-2 border-t" />

               <div className="space-y-1">
                  <button className="w-full text-left">
                     <MenuRow>Create task</MenuRow>
                  </button>
                  <button className="w-full text-left">
                     <MenuRow>My work</MenuRow>
                  </button>
                  <button className="w-full text-left">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <Clock3 className="size-4" />
                           Track time
                        </span>
                     </MenuRow>
                  </button>
                  <button className="w-full text-left">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <ClipboardCheck className="size-4" />
                           Notepad
                        </span>
                     </MenuRow>
                  </button>
                  <button className="w-full text-left">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <UserRoundPlus className="size-4" />
                           Create reminder
                        </span>
                     </MenuRow>
                  </button>
               </div>

               <div className="my-2 border-t" />

               <div className="space-y-1">
                  <button className="w-full text-left">
                     <MenuRow>
                        <span className="flex items-center gap-2">
                           <Trash2 className="size-4" />
                           Trash
                        </span>
                     </MenuRow>
                  </button>
                  <button
                     onClick={() => logout()}
                     disabled={isLoggingOut}
                     className="w-full text-left"
                  >
                     <MenuRow className="text-red-600">
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                     </MenuRow>
                  </button>
               </div>
            </div>
         </div>
      </header>
   );
}

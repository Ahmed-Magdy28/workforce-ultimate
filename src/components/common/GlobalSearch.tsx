'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User, Folder, CheckSquare, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';
import { getProjectsAPI } from '@/features/projects/api/projectApis';
import { getTasksAPI } from '@/features/tasks/api/taskApis';

export default function GlobalSearch() {
   const { companyId } = useAuth();
   const [query, setQuery] = useState('');
   const [isOpen, setIsOpen] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const { data: employees = [] } = useQuery({
      queryKey: ['company-employees', companyId],
      queryFn: getCurrentCompanyEmployeesAPI,
      enabled: Boolean(companyId) && isOpen,
   });

   const { data: projects = [] } = useQuery({
      queryKey: ['projects', companyId],
      queryFn: () => getProjectsAPI(companyId || undefined),
      enabled: Boolean(companyId) && isOpen,
   });

   const { data: tasks = [] } = useQuery({
      queryKey: ['tasks', companyId],
      queryFn: () => getTasksAPI({ companyId: companyId || undefined }),
      enabled: Boolean(companyId) && isOpen,
   });

   // Close on click outside
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Keyboard shortcut Ctrl/Cmd + K
   useEffect(() => {
      function handleKeyDown(event: KeyboardEvent) {
         if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            setIsOpen(true);
         }
         if (event.key === 'Escape') {
            setIsOpen(false);
         }
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   const cleanQuery = query.trim().toLowerCase();

   const filteredEmployees = cleanQuery
      ? employees
           .filter(
              (e) =>
                 e.full_name.toLowerCase().includes(cleanQuery) ||
                 (e.email && e.email.toLowerCase().includes(cleanQuery)) ||
                 e.role.toLowerCase().includes(cleanQuery) ||
                 (e.team?.team_name &&
                    e.team.team_name.toLowerCase().includes(cleanQuery)),
           )
           .slice(0, 4)
      : [];

   const filteredProjects = cleanQuery
      ? projects
           .filter(
              (p) =>
                 p.name.toLowerCase().includes(cleanQuery) ||
                 (p.description &&
                    p.description.toLowerCase().includes(cleanQuery)),
           )
           .slice(0, 4)
      : [];

   const filteredTasks = cleanQuery
      ? tasks
           .filter(
              (t) =>
                 t.title.toLowerCase().includes(cleanQuery) ||
                 (t.description &&
                    t.description.toLowerCase().includes(cleanQuery)),
           )
           .slice(0, 4)
      : [];

   const hasResults =
      filteredEmployees.length > 0 ||
      filteredProjects.length > 0 ||
      filteredTasks.length > 0;

   return (
      <div ref={containerRef} className="relative w-full max-w-md">
         <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
               type="search"
               placeholder="Search people, projects, tasks... (Ctrl+K)"
               value={query}
               onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
               }}
               onFocus={() => setIsOpen(true)}
               className="h-8 rounded-full pl-9 pr-8 text-xs bg-muted/40 hover:bg-muted/70 transition-colors"
            />
            {query && (
               <button
                  type="button"
                  onClick={() => {
                     setQuery('');
                     setIsOpen(false);
                  }}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
               >
                  <X className="size-3.5" />
               </button>
            )}
         </div>

         {isOpen && cleanQuery && (
            <div className="absolute top-[calc(100%+0.5rem)] left-0 z-50 w-full rounded-2xl border bg-card p-3 shadow-2xl backdrop-blur-md">
               {!hasResults ? (
                  <p className="p-3 text-center text-xs text-muted-foreground">
                     No matches found for &quot;{query}&quot;
                  </p>
               ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                     {/* Employees */}
                     {filteredEmployees.length > 0 && (
                        <div>
                           <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              People
                           </p>
                           <div className="space-y-1">
                              {filteredEmployees.map((emp) => (
                                 <Link
                                    key={emp.id}
                                    href="/people"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-muted transition-colors"
                                 >
                                    <div className="flex items-center gap-2">
                                       <User className="size-3.5 text-primary" />
                                       <span className="font-medium">
                                          {emp.full_name}
                                       </span>
                                       <span className="text-[10px] text-muted-foreground">
                                          ({emp.role})
                                       </span>
                                    </div>
                                    <ArrowRight className="size-3 text-muted-foreground" />
                                 </Link>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Projects */}
                     {filteredProjects.length > 0 && (
                        <div>
                           <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Projects
                           </p>
                           <div className="space-y-1">
                              {filteredProjects.map((p) => (
                                 <Link
                                    key={p.id}
                                    href="/planner"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-muted transition-colors"
                                 >
                                    <div className="flex items-center gap-2">
                                       <Folder className="size-3.5 text-blue-500" />
                                       <span className="font-medium">
                                          {p.name}
                                       </span>
                                    </div>
                                    <span className="text-[10px] capitalize text-muted-foreground">
                                       {p.status}
                                    </span>
                                 </Link>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Tasks */}
                     {filteredTasks.length > 0 && (
                        <div>
                           <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Tasks
                           </p>
                           <div className="space-y-1">
                              {filteredTasks.map((t) => (
                                 <Link
                                    key={t.id}
                                    href="/planner"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-muted transition-colors"
                                 >
                                    <div className="flex items-center gap-2">
                                       <CheckSquare className="size-3.5 text-emerald-500" />
                                       <span className="font-medium truncate max-w-[200px]">
                                          {t.title}
                                       </span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                       {t.status.replace('_', ' ')}
                                    </span>
                                 </Link>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

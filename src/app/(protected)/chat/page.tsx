import ChatView from '@/components/collaboration/ChatView';

export default function ChatPage() {
   return (
      <div className="space-y-4">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Communication</h1>
            <p className="text-sm text-muted-foreground">
               Real-time messaging, project discussions, and channels.
            </p>
         </div>
         <ChatView />
      </div>
   );
}


import { QueryClientProvider } from './contexts/query-client-provider';
import { AuthProvider } from './contexts/AuthProvider';
import { ApplicationRoutes } from './routes';
import { Toaster } from 'sonner';

export function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <ApplicationRoutes />

        <Toaster richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

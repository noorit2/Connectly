import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AppRoutes } from './routes/AppRoutes';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  const queryClient = new QueryClient();
  
  const routes = AppRoutes(queryClient) || [];
  const router = createBrowserRouter(routes);
  return (
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

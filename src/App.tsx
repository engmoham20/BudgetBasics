import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/app/router/AppRouter';
import { useStorageFallback } from '@/hooks/useStorageFallback';

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <StorageFallbackWarning />
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  );
}

function StorageFallbackWarning() {
  const { showWarning, message } = useStorageFallback();
  if (!showWarning) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-[70] bg-warning text-white text-sm text-center py-2 px-4">
      {message}
    </div>
  );
}

export default App;

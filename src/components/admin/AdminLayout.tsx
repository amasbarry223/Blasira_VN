import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { SkipLink } from '@/components/SkipLink';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-blasira-bg">
      <SkipLink href="#main-content" />
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6 bg-blasira-bg" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

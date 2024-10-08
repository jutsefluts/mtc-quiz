import React from 'react';
import AuthWrapper from './AuthWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="medical-layout">
      <AuthWrapper>
        <header className="medical-header">
          {/* AuthWrapper will handle the content here */}
        </header>
        <main className="medical-main">
          {children}
        </main>
      </AuthWrapper>
    </div>
  );
};

export default Layout;

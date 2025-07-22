import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthProvider';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

interface AuthLayoutProps extends React.PropsWithChildren {
  breadcrumbItems: {
    label: string;
    href?: string;
  }[];
}

export function AuthLayout({ breadcrumbItems, children }: AuthLayoutProps) {
  const navigate = useNavigate();

  const { auth } = useAuth();

  useEffect(() => {
    if (!auth) {
      navigate('/siscontrol/entrar');
    }
  }, [auth, navigate]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />

          <Separator orientation="vertical" className="mr-2 !h-6" />

          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => {
                const isLastIndex = index === breadcrumbItems.length - 1;

                return (
                  <React.Fragment key={item.label}>
                    <BreadcrumbItem>
                      {!isLastIndex || breadcrumbItems.length === 1 ? (
                        <BreadcrumbLink asChild>
                          <Link to={item?.href || '#'}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>

                    {!isLastIndex && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex min-h-[calc(100vh-64px)] w-full justify-center">
          <div className="h-fit w-full px-4 py-10 lg:max-w-[75%]">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

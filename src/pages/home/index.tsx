import { AuthLayout } from '@/layouts/auth-layout';

const breadcrumbItems = [{ label: 'Home', href: '/' }];
export function Home() {
  return (
    <AuthLayout breadcrumbItems={breadcrumbItems}>
      <h1>Home</h1>
    </AuthLayout>
  );
}

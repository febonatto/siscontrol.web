import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '@/contexts/AuthProvider';
import { PersonRoles } from '@/types';

export function useAccessControl(group: PersonRoles[]) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const credentialRole = auth?.pessoa.nivelPermissao ?? 0;
  const hasAccessModule = group.includes(credentialRole);

  useLayoutEffect(() => {
    if (!hasAccessModule) {
      navigate('/siscontrol');
    }
  }, [hasAccessModule, navigate]);

  return hasAccessModule;
}

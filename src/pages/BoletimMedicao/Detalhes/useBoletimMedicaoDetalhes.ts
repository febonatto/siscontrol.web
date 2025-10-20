import { useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useDetalhesBM } from '../api/useDetalhesBM';

import { useAccessControl } from '@/hooks/useAccessControl';
import { PersonRoles } from '@/types';

interface PageParams {
  idBm?: string;
  [key: string]: string | undefined;
}

const GROUP_ROLES = [
  PersonRoles.PMO_WITH_BI,
  PersonRoles.PMO_WITHOUT_BI,
  PersonRoles.BOAB_WITH_BI,
  PersonRoles.BOAB_WITHOUT_BI,
];

export function useBoletimMedicaoDetalhes() {
  const hasAccessModule = useAccessControl(GROUP_ROLES);
  const { idBm } = useParams<PageParams>();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!idBm) {
      navigate('/siscontrol/bm');
    }
  }, [idBm]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Boletim de Medição', href: '/siscontrol/boletim-medicao' },
    { label: 'Detalhes do Boletim de Medição' },
  ];

  const detalhes = useDetalhesBM(idBm);

  return { hasAccessModule, idBm, breadcrumbItems, ...detalhes };
}

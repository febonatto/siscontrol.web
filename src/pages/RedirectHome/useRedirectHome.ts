import { api } from '@/configs/httpClient';
import { useAuth } from '@/contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type RelatoryLink = {
  label: string;
  href: string;
};

type GetRelatoryLinksResponse = {
  data: RelatoryLink[];
};

function getRelatoryLinks(): Promise<GetRelatoryLinksResponse> {
  return api.get<RelatoryLink[]>('/autorizacoes/links');
}

export function useRedirectHome() {
  const { auth } = useAuth();

  const {
    isPending: isLoadingRelatoryLinks,
    isStale: isRelatoryLinksStale,
    data: relatoryLinksResponse,
  } = useQuery<GetRelatoryLinksResponse, AxiosError>({
    queryFn: () => getRelatoryLinks(),
    queryKey: ['relatory-links'],
    enabled: !!auth,
  });

  const relatoryLinks = relatoryLinksResponse?.data || [];

  return {
    isLoadingRelatoryLinks,
    isRelatoryLinksStale,
    relatoryLinks,
  };
}

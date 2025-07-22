import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router';
import engecorpImage from '@/assets/images/engecorp.jpeg';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';
import { useRedirectHome } from './useRedirectHome';
import { Loader } from 'lucide-react';

export function RedirectHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { isLoadingRelatoryLinks, isRelatoryLinksStale, relatoryLinks } =
    useRedirectHome();

  const linksSistemas = [
    { label: 'Processos CESG', href: 'https://bpm.hemeragestao.com/#list' },
    {
      label: 'Sistema de Controle',
      href: '/siscontrol',
    },
    {
      label: 'Gestão de Cronograma',
      href: 'https://verax.hemeragestao.com/login',
    },
    {
      label: 'Gestão de Documentos',
      href: 'https://gio.typsa.net/iris/AI1192/edicion?idTramitacionSaapo=INICIO',
    },
    {
      label: 'Supervisão de Obras',
      href: 'https://gio.typsa.net/iris/AI1192/edicion?idTramitacionSaapo=INICIO',
    },
  ];

  useEffect(() => {
    if (!auth) {
      navigate('/siscontrol/entrar');
    }
  }, []);

  return (
    <section className="mx-auto flex h-screen max-w-[75%] gap-4 py-10">
      <div className="flex min-w-[30%] flex-col space-y-4 py-4">
        <div>
          <h1 className="text-lg font-bold">Sistemas</h1>
          {linksSistemas.map((link) => (
            <div key={link.label} className="font-medium">
              <Link
                to={link.href}
                className="text-start text-sm text-gray-500 hover:text-gray-900"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {(isLoadingRelatoryLinks || isRelatoryLinksStale) && (
          <>
            <Separator orientation="horizontal" />

            <div className="flex items-center justify-center">
              <Loader className="inline h-4 w-4 animate-spin text-gray-500" />
            </div>
          </>
        )}

        {!isLoadingRelatoryLinks &&
          !isRelatoryLinksStale &&
          relatoryLinks.length > 0 && (
            <>
              <Separator orientation="horizontal" />

              <div>
                <h1 className="text-lg font-bold">Relatórios PowerBI</h1>
                {relatoryLinks.map((link) => (
                  <div key={link.label} className="font-medium">
                    <Link
                      to={link.href}
                      className="text-start text-sm text-gray-500 hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

        <Separator orientation="horizontal" />

        <button className="text-start">Galeria de Imagens</button>
        <button className="text-start">Portal CESG</button>
      </div>

      <Separator orientation="vertical" />

      <div className="h-full flex-1 overflow-hidden rounded-md py-4">
        <img
          src={engecorpImage}
          alt="Engecorp Picture"
          className="h-full w-full rounded-md object-cover"
        />
      </div>
    </section>
  );
}

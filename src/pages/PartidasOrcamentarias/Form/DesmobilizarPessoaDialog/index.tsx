import { Input } from '@/components/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type DesmobilizarPessoaDialogProps = {
  isVisible: boolean;
  onConfirm: (dataDesmobilizacaoReal: Date) => Promise<void>;
  onClose: () => void;
};

const desmobilizarPessoaSchema = z.object({
  dataDesmobilizacaoReal: z.date(),
});

type DesmobilizarPessoaForm = z.infer<typeof desmobilizarPessoaSchema>;

export function DesmobilizarPessoaDialog({
  isVisible,
  onConfirm,
  onClose,
}: DesmobilizarPessoaDialogProps) {
  const { control, handleSubmit } = useForm<DesmobilizarPessoaForm>({
    resolver: zodResolver(desmobilizarPessoaSchema),
    defaultValues: {
      dataDesmobilizacaoReal: new Date(),
    },
  });

  function onSubmit({ dataDesmobilizacaoReal }: DesmobilizarPessoaForm) {
    onConfirm(dataDesmobilizacaoReal);
    onClose();
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Data da desmobilização</DialogTitle>
          <DialogDescription>
            Selecione a data real em que o colaborador será desmobilizado.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <Input.Date
              control={control}
              name="dataDesmobilizacaoReal"
              label="Data de Desmobilização Real"
            />

            <DialogFooter>
              <Button type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button>Confirmar</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

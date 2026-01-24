import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useResumosBM } from '../../api/useResumosBM';
import {
  CreateBmResumoParams,
  useCreateResumoBM,
} from '../../api/useCreateResumoBM';
import { currency } from '@/validators/currency';

const baseBoletimSchema = z.object({
  nrBm: z
    .string()
    .min(1, '')
    .regex(
      /^-?\d+$/,
      'O número do boletim de medição deve conter apenas números',
    )
    .refine((value) => value !== '' && Number(value) > 0, {
      message: 'O número do boletim de medição deve ser positivo',
    }),
  periodoMedicaoFinal: z.date({ message: '' }).nullable(),
  qualidadeEntregaveis: currency({ optional: true }),
  revisaoQualidadeEntregavelProjeto: currency({ optional: true }),
  qualidadePrazoEntregaveis: currency({ optional: true }),
  qualidadeSupervisaoObra: currency({ optional: true }),
  qualidadeDfo: currency({ optional: true }),
  qualidadeSegurancaOperacional: currency({ optional: true }),
  qualidadeServico: currency({ optional: true }),
  indiceReajusteAcumulado: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+(\.\d+)?$/.test(value), {
      message: 'O índice de reajuste acumulado deve ser um número positivo',
    }),
});

type BoletimForm = z.infer<typeof baseBoletimSchema>;

export function useBoletimMedicaoResumosForm() {
  const { resumos } = useResumosBM();
  const { isCreatingResumo, handleCreateResumo } = useCreateResumoBM();

  const [showConfirmationDeletion, setShowConfirmationDeletion] =
    useState<boolean>(false);

  const bmResumoRef = useRef<CreateBmResumoParams | null>(null);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Boletim de Medição', href: '/siscontrol/boletim-medicao' },
    { label: 'Criar Boletim de Medição' },
  ];

  const boletimSchema = baseBoletimSchema.superRefine(
    ({ periodoMedicaoFinal }, ctx) => {
      if (!periodoMedicaoFinal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '',
          path: ['periodoMedicaoFinal'],
        });

        return;
      }

      const today = new Date();
      const canGenerateInCurrentMonth = today.getDate() >= 16;
      const isEqualMonth = today.getMonth() === periodoMedicaoFinal.getMonth();

      if (!canGenerateInCurrentMonth && isEqualMonth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'O mês vigênte ainda não atingiu a data necessária para gerar um boletim',
          path: ['periodoMedicaoFinal'],
        });

        return;
      }

      if (!isEqualMonth && periodoMedicaoFinal > today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'O período de medição final não deve ser maior que a data atual',
          path: ['periodoMedicaoFinal'],
        });

        return;
      }
    },
  );

  const { control, handleSubmit } = useForm<BoletimForm>({
    resolver: zodResolver(boletimSchema),
    values: {
      nrBm: '',
      periodoMedicaoFinal: null,
      qualidadeEntregaveis: '',
      revisaoQualidadeEntregavelProjeto: '',
      qualidadePrazoEntregaveis: '',
      qualidadeSupervisaoObra: '',
      qualidadeDfo: '',
      qualidadeSegurancaOperacional: '',
      qualidadeServico: '',
    },
  });

  function onSubmit(data: BoletimForm) {
    const { periodoMedicaoFinal } = data;

    if (!periodoMedicaoFinal) {
      return;
    }

    periodoMedicaoFinal.setDate(15);
    periodoMedicaoFinal.setHours(-3);

    const removeExistent = resumos.some(
      (resumo) =>
        resumo.periodoMedicaoFinal === periodoMedicaoFinal.toISOString(),
    );

    const {
      qualidadeEntregaveis,
      revisaoQualidadeEntregavelProjeto,
      qualidadePrazoEntregaveis,
      qualidadeSupervisaoObra,
      qualidadeDfo,
      qualidadeSegurancaOperacional,
      qualidadeServico,
    } = data;

    const { nrBm, indiceReajusteAcumulado } = data;

    if (!periodoMedicaoFinal) {
      return;
    }

    const resumo: CreateBmResumoParams = {
      numeroBm: parseInt(nrBm),
      dataReferencia: periodoMedicaoFinal,
      qualidadeEntregaveis,
      revisaoQualidadeEntregavelProjeto,
      qualidadePrazoEntregaveis,
      qualidadeSupervisaoObra,
      qualidadeDfo,
      qualidadeSegurancaOperacional,
      qualidadeServico,
      indiceReajusteAcumulado: indiceReajusteAcumulado
        ? parseFloat(indiceReajusteAcumulado)
        : undefined,
      removeExistent,
    };

    if (removeExistent) {
      bmResumoRef.current = resumo;
      setShowConfirmationDeletion(true);
      return;
    }

    handleCreateResumo(resumo);
  }

  function handleConfirmDeletion() {
    if (bmResumoRef.current) {
      handleCreateResumo(bmResumoRef.current);
    }
  }

  function handleCancelDeletion() {
    bmResumoRef.current = null;
    setShowConfirmationDeletion(false);
  }

  useEffect(() => {
    if (bmResumoRef.current && !isCreatingResumo) {
      bmResumoRef.current = null;
      setShowConfirmationDeletion(false);
    }
  }, [isCreatingResumo]);

  return {
    breadcrumbItems,
    control,
    isCreatingResumo,
    showConfirmationDeletion,
    handleSubmit,
    onSubmit,
    handleConfirmDeletion,
    handleCancelDeletion,
  };
}

import { useNavigate, useParams } from 'react-router';
import { useFindResumoBM } from '../../api/useFindResumoBM';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toDate } from '@/utils/dates';
import { coinMask } from '@/utils/masks';
import { useEffect, useRef, useState } from 'react';
import { useResumosBM } from '../../api/useResumosBM';
import {
  CreateBmResumoParams,
  useCreateResumoBM,
} from '../../api/useCreateResumoBM';

interface PageParams {
  id?: string;
  [key: string]: string | undefined;
}

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
  periodoMedicaoInicial: z.date({ message: '' }).optional(),
  periodoMedicaoFinal: z.date({ message: '' }).nullable(),
  vlTotalMedicaoSemPenalizacao: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor total da medição sem penalização deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor total da medição sem penalização deve ser positivo')
    .optional(),
  vlTotalMultaExperiencia: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor total da multa por experiência deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor total da multa por experiência deve ser positivo')
    .optional(),
  vlTotalMultaMobilizacao: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor total da multa por mobilização deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor total da multa por mobilização deve ser positivo')
    .optional(),
  qualidadeEntregaveis: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message: 'A qualidade dos entregáveis deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  revisaoQualidadeEntregavelProjeto: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message:
          'A revisão da qualidade dos entregáveis deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  qualidadePrazoEntregaveis: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message:
          'A qualidade do prazo dos entregáveis deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  qualidadeSupervisaoObra: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message: 'A qualidade da supervisão da obra deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  qualidadeDfo: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message: 'A qualidade do DFO deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  qualidadeSegurancaOperacional: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message:
          'A qualidade da segurança operacional deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  qualidadeServico: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/.test(value),
      {
        message: 'A qualidade do serviço deve conter apenas números',
      },
    )
    .transform((value) => value || undefined),
  vlTotalMedicaoComPenalizacao: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor total da medição com penalização deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor total da medição com penalização deve ser positivo')
    .optional(),
  indiceReajusteAcumulado: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+(\.\d+)?$/.test(value), {
      message: 'O índice de reajuste acumulado deve ser um número positivo',
    }),
  vlReajuste: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor do reajuste deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor do reajuste deve ser positivo')
    .optional(),
  vlMedicaoReajustado: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor da medição reajustada deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor da medição reajustada deve ser positivo')
    .optional(),
  vlRetencao: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor da retenção deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor da retenção deve ser positivo')
    .optional(),
  vlNotaFiscal: z
    .string()
    .min(1, '')
    .regex(
      /^R\$\s?\d{1,8}(\.\d{3})*(,\d{2})?$/,
      'O valor da nota fiscal deve conter apenas números',
    )
    .refine((value) => {
      const replacedValue = value
        .replace(/[R\$\s\u00A0]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
      return Number(replacedValue) > 0;
    }, 'O valor da nota fiscal deve ser positivo')
    .optional(),
});

type BoletimForm = z.infer<typeof baseBoletimSchema>;

export function useBoletimMedicaoResumosForm() {
  const { id } = useParams<PageParams>();
  const navigate = useNavigate();

  const { resumos } = useResumosBM();
  const { isCreatingResumo, handleCreateResumo } = useCreateResumoBM();

  const [showConfirmationDeletion, setShowConfirmationDeletion] =
    useState<boolean>(false);

  const bmResumoRef = useRef<CreateBmResumoParams | null>(null);

  const resumoId = id ? Number(id) : undefined;
  const isEditionPage = Boolean(resumoId);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Boletim de Medição', href: '/siscontrol/boletim-medicao' },
    { label: `${resumoId ? 'Atualizar' : 'Criar'} Boletim de Medição` },
  ];

  const { resumo, showFetchingResumo } = useFindResumoBM(resumoId);

  const boletimSchema = baseBoletimSchema.superRefine(
    ({ periodoMedicaoFinal }, ctx) => {
      if (!isEditionPage) {
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
        const isEqualMonth =
          today.getMonth() === periodoMedicaoFinal.getMonth();

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
      }
    },
  );

  const { control, handleSubmit } = useForm<BoletimForm>({
    resolver: zodResolver(boletimSchema),
    values: {
      nrBm: resumo ? resumo.nrBm.toString() : '',
      periodoMedicaoFinal: resumo ? toDate(resumo.periodoMedicaoFinal) : null,
      qualidadeEntregaveis: resumo
        ? coinMask(resumo.qualidadeEntregaveis.toFixed(2), true)
        : '',
      revisaoQualidadeEntregavelProjeto: resumo
        ? coinMask(resumo.revisaoQualidadeEntregavelProjeto.toFixed(2))
        : '',
      qualidadePrazoEntregaveis: resumo
        ? coinMask(resumo.qualidadePrazoEntregaveis.toFixed(2), true)
        : '',
      qualidadeSupervisaoObra: resumo
        ? coinMask(resumo.qualidadeSupervisaoObra.toFixed(2), true)
        : '',
      qualidadeDfo: resumo
        ? coinMask(resumo.qualidadeDfo.toFixed(2), true)
        : '',
      qualidadeSegurancaOperacional: resumo
        ? coinMask(resumo.qualidadeSegurancaOperacional.toFixed(2), true)
        : '',
      qualidadeServico: resumo
        ? coinMask(resumo.qualidadeServico.toFixed(2), true)
        : '',
      ...(resumo && {
        periodoMedicaoInicial: toDate(resumo.periodoMedicaoInicial),
        vlTotalMedicaoSemPenalizacao: coinMask(
          resumo.vlTotalMedicaoSemPenalizacao.toFixed(2),
          true,
        ),
        vlTotalMultaExperiencia: coinMask(
          resumo.vlTotalMultaExperiencia.toFixed(2),
          true,
        ),
        vlTotalMultaMobilizacao: coinMask(
          resumo.vlTotalMultaMobilizacao.toFixed(2),
          true,
        ),
        vlTotalMedicaoComPenalizacao: coinMask(
          resumo.vlTotalMedicaoComPenalizacao.toFixed(2),
          true,
        ),
        indiceReajusteAcumulado: (
          resumo.indiceReajusteAcumulado * 100
        ).toString(),
        vlReajuste: coinMask(resumo.vlReajuste.toFixed(2), true),
        vlMedicaoReajustado: coinMask(
          resumo.vlMedicaoReajustado.toFixed(2),
          true,
        ),
        vlRetencao: coinMask(resumo.vlRetencao.toFixed(2), true),
        vlNotaFiscal: coinMask(resumo.vlNotaFiscal.toFixed(2), true),
      }),
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

    if (!isEditionPage) {
      const { nrBm, periodoMedicaoFinal, indiceReajusteAcumulado } = data;

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
    if (isEditionPage && !resumo && !showFetchingResumo) {
      navigate('/siscontrol/boletim-medicao');
    }
  }, [resumo]);

  useEffect(() => {
    if (bmResumoRef.current && !isCreatingResumo) {
      bmResumoRef.current = null;
      setShowConfirmationDeletion(false);
    }
  }, [isCreatingResumo]);

  return {
    breadcrumbItems,
    control,
    isEditionPage,
    showFetchingResumo,
    isCreatingResumo,
    showConfirmationDeletion,
    handleSubmit,
    onSubmit,
    handleConfirmDeletion,
    handleCancelDeletion,
  };
}

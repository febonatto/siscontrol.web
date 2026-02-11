import { PersonRoles } from '@/types';
import { useResumosBM } from '../api/useResumosBM';
import { useAccessControl } from '@/hooks/useAccessControl';
import { useDeleteResumoBM } from '../api/useDeleteResumoBM';
import { useEffect, useRef, useState } from 'react';
import { useGenerateMeasurementReport } from '../api/useGenerateMeasurementReport';
import { ExcelTreeGenerator } from './helpers/excel-tree-generator';

const GROUP_ROLES = [
  PersonRoles.PMO_WITH_BI,
  PersonRoles.PMO_WITHOUT_BI,
  PersonRoles.BOAB_WITH_BI,
  PersonRoles.BOAB_WITHOUT_BI,
];

export function useBoletimMedicaoResumos() {
  const hasAccessModule = useAccessControl(GROUP_ROLES);

  const isFirstRenderRef = useRef<boolean>(true);
  const [resumoBeingDeleted, setResumoBeingDeleted] = useState<number | null>(
    null,
  );
  const [measurementReportNumber, setMeasurementReportNumber] = useState<
    number | null
  >(null);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Siscontrol', href: '/siscontrol' },
    { label: 'Boletim de Medição' },
  ];

  const getResumos = useResumosBM();
  const { isDeletingResumo, handleDeleteResumo } = useDeleteResumoBM();
  const { data, isFetching } = useGenerateMeasurementReport(
    measurementReportNumber,
  );

  function handleGenerateMeasurementReport(measurementReportNumber: number) {
    setMeasurementReportNumber(measurementReportNumber);
  }

  useEffect(() => {
    const { current: isFirstRender } = isFirstRenderRef;

    if (isFirstRender) {
      isFirstRenderRef.current = false;
      return;
    }

    if (!isFirstRender && !isDeletingResumo) {
      setResumoBeingDeleted(null);
    }
  }, [isDeletingResumo]);

  useEffect(() => {
    if (!isFetching) {
      setMeasurementReportNumber(null);
    }
    if (data) {
      ExcelTreeGenerator.generate(
        data,
        measurementReportNumber!,
        `Relatório de Medição ${measurementReportNumber}.xlsx`,
      );
    }
  }, [isFetching]);

  const handleResumoBeingDeleted = (id: number) => setResumoBeingDeleted(id);

  function handleConfirmDelete() {
    if (resumoBeingDeleted) handleDeleteResumo(resumoBeingDeleted);
  }

  const handleCancelDelete = () => setResumoBeingDeleted(null);

  return {
    hasAccessModule,
    breadcrumbItems,
    ...getResumos,
    shouldShowDeleteModal: Boolean(resumoBeingDeleted),
    isDeletingResumo,
    handleResumoBeingDeleted,
    handleConfirmDelete,
    handleCancelDelete,
    handleGenerateMeasurementReport,
  };
}

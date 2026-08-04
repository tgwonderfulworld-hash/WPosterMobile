import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { useTheme } from '@/theme';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Fixed snap points (e.g. ['50%']). Omit for content-driven height. */
  snapPoints?: (string | number)[];
}

/**
 * Themed wrapper over @gorhom/bottom-sheet. Controlled via `visible`. Requires a
 * <GestureHandlerRootView> ancestor (added in the root layout).
 */
export function BottomSheet({ visible, onClose, children, snapPoints }: BottomSheetProps) {
  const theme = useTheme();
  const ref = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (visible) ref.current?.expand();
    else ref.current?.close();
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  return (
    <GorhomBottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      enablePanDownToClose
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.colors.borderStrong }}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
    >
      <BottomSheetView style={{ padding: theme.spacing.xl, paddingBottom: theme.spacing['2xl'], gap: theme.spacing.md }}>
        {children}
      </BottomSheetView>
    </GorhomBottomSheet>
  );
}

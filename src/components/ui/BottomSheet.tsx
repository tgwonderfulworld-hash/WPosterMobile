import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, type ComponentType, type ReactElement, type ReactNode } from 'react';
import type { ListRenderItem } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

export interface BottomSheetListConfig<T> {
  data: readonly T[] | null | undefined;
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: ReactElement | ComponentType | null;
  /** BottomSheetFlashList's own recycling hint (gorhom's local FlashList shim, not @shopify/flash-list v2's API). */
  estimatedItemSize?: number;
}

export interface BottomSheetProps<T = never> {
  visible: boolean;
  onClose: () => void;
  /** Plain content. Ignored when `list` is set. */
  children?: ReactNode;
  /** Fixed snap points (e.g. ['50%']). Omit for content-driven height. */
  snapPoints?: (string | number)[];
  /**
   * Render a virtualized `BottomSheetFlashList` body instead of plain children
   * — for sheets whose content can be a large, unbounded list (e.g. a day's
   * worth of calendar posts). Optional header content renders above the list.
   */
  list?: BottomSheetListConfig<T>;
  header?: ReactNode;
  /** Scroll plain `children` (e.g. a filter sheet taller than its snap point). Ignored when `list` is set. */
  scrollable?: boolean;
}

/**
 * Themed wrapper over @gorhom/bottom-sheet. Controlled via `visible`. Requires a
 * <GestureHandlerRootView> ancestor (added in the root layout).
 */
export function BottomSheet<T = never>({
  visible,
  onClose,
  children,
  snapPoints,
  list,
  header,
  scrollable = false,
}: BottomSheetProps<T>) {
  const theme = useTheme();
  const ref = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (visible) ref.current?.expand();
    else ref.current?.close();
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      // Gorhom's own backdrop resets its pointerEvents via a Reanimated reaction
      // tied to the sheet's animated index — which can get interrupted (e.g. a
      // locale change re-rendering the tree in the same tick as picking a
      // language and closing the sheet), leaving a full-screen invisible view
      // that still intercepts every touch on the screen behind it. Driving
      // pointerEvents from our own plain `visible` state instead is immune to
      // that timing and always correct.
      <View pointerEvents={visible ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
      </View>
    ),
    [visible],
  );

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  // FlashList virtualizes by measuring against a bounded height, so a list
  // sheet always needs fixed snap points — dynamic (content-driven) sizing
  // only makes sense for plain, fully-rendered children.
  const effectiveSnapPoints = snapPoints ?? (list ? ['70%'] : undefined);

  return (
    <GorhomBottomSheet
      ref={ref}
      index={-1}
      snapPoints={effectiveSnapPoints}
      enableDynamicSizing={!effectiveSnapPoints}
      enablePanDownToClose
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.colors.borderStrong }}
      backgroundStyle={{ backgroundColor: theme.colors.card }}
    >
      {list ? (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl }}>
          {header ? (
            <View style={{ paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.md }}>{header}</View>
          ) : null}
          <BottomSheetFlashList
            data={list.data}
            renderItem={list.renderItem}
            keyExtractor={list.keyExtractor}
            ListEmptyComponent={list.ListEmptyComponent}
            estimatedItemSize={list.estimatedItemSize ?? 80}
            contentContainerStyle={{ paddingBottom: theme.spacing['2xl'] }}
          />
        </View>
      ) : scrollable ? (
        <BottomSheetScrollView
          contentContainerStyle={{ padding: theme.spacing.xl, paddingBottom: theme.spacing['2xl'], gap: theme.spacing.md }}
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView style={{ padding: theme.spacing.xl, paddingBottom: theme.spacing['2xl'], gap: theme.spacing.md }}>
          {children}
        </BottomSheetView>
      )}
    </GorhomBottomSheet>
  );
}

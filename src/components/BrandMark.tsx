import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/theme';

export interface BrandMarkProps {
  size?: number;
}

/**
 * Temporary WPoster brand mark: the blue → violet gradient "W" tile. Swap for
 * the final logo asset later; the gradient stops come from the theme.
 */
export function BrandMark({ size = 64 }: BrandMarkProps) {
  const theme = useTheme();
  const [start, , end] = theme.gradients.brand;
  const r = theme.radius.large;

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={start} />
            <Stop offset="1" stopColor={end} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="64" height="64" rx={r} fill="url(#brand)" />
        <SvgText
          x="32"
          y="44"
          fontSize="36"
          fontWeight="800"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          W
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});

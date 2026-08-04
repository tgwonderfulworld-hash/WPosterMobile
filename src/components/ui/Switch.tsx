import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

import { useTheme } from '@/theme';

export interface SwitchProps extends Omit<RNSwitchProps, 'trackColor' | 'thumbColor'> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Switch({ value, disabled, ...rest }: SwitchProps) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <RNSwitch
      value={value}
      disabled={disabled}
      trackColor={{ false: c.borderStrong, true: c.primary }}
      thumbColor={c.card}
      ios_backgroundColor={c.borderStrong}
      style={{ opacity: disabled ? 0.5 : 1 }}
      {...rest}
    />
  );
}

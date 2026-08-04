import { forwardRef, useState } from 'react';
import type { TextInput } from 'react-native';

import { Input, InputIconToggle, type InputProps } from './Input';

/** Password field with a built-in reveal toggle. */
export const PasswordInput = forwardRef<TextInput, Omit<InputProps, 'rightAccessory' | 'secureTextEntry'>>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        ref={ref}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        leftIcon={props.leftIcon ?? 'lock-closed-outline'}
        rightAccessory={
          <InputIconToggle
            active={visible}
            onToggle={() => setVisible((v) => !v)}
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          />
        }
        {...props}
      />
    );
  },
);

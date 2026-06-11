import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

export function Text(props: TextProps) {
  const getFontFamily = (weight: string | number | undefined) => {
    switch (String(weight)) {
      case '900':
      case '800':
        return 'PlusJakartaSans_800ExtraBold';
      case '700':
      case 'bold':
        return 'PlusJakartaSans_700Bold';
      case '600':
        return 'PlusJakartaSans_600SemiBold';
      case '500':
        return 'PlusJakartaSans_500Medium';
      default:
        return 'PlusJakartaSans_400Regular';
    }
  };

  const flattenStyle = StyleSheet.flatten(props.style || {});
  const fontFamily = getFontFamily(flattenStyle.fontWeight);
  
  // Create a new style object without fontWeight to prevent Android from falling back to system fonts
  const { fontWeight, ...styleWithoutWeight } = flattenStyle as any;

  return <RNText {...props} style={[styleWithoutWeight, { fontFamily }]} />;
}

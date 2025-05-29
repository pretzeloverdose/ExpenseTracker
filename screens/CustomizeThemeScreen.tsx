import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ColorPicker from 'react-native-wheel-color-picker';

// Helper functions to clamp lightness
function hexToHsl(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16).padStart(2, '0');
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clampLightness(hex: string, maxLightness: number = 170) {
  let [h, s, l] = hexToHsl(hex);
  const maxL = maxLightness / 255;
  if (l > maxL) l = maxL;
  return hslToHex(h, s, l);
}

const CustomizeThemeScreen = () => {
  const { primaryColor, setPrimaryColor } = useTheme();
  const [color, setColor] = useState(primaryColor);

  const handleColorChange = (input: string) => {
    const clamped = clampLightness(input, 170);
    setColor(clamped);
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        value={color}
        onChangeText={handleColorChange}
        placeholder="Enter hex color"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
      />
      <ColorPicker
        color={color}
        onColorChange={handleColorChange}
        thumbSize={30}
        sliderSize={30}
      />
      <TouchableOpacity onPress={() => setPrimaryColor(color)}>
        <Text style={{ backgroundColor: color, padding: 10, margin: 10, textAlign: 'center', color: '#fff', borderRadius: 5 }}>
          Set theme color
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomizeThemeScreen;
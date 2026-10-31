import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LanguageCode } from '../utils/colorNames';
import { getColorName } from '../services/colorService';

interface ColorLabelProps {
  colorRgb: { r: number; g: number; b: number } | null;
  language: LanguageCode;
}

export const ColorLabel: React.FC<ColorLabelProps> = ({ colorRgb, language }) => {
  if (!colorRgb) return null;

  const colorName = getColorName(colorRgb.r, colorRgb.g, colorRgb.b, language);
  const hexColor = `rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b})`;

  return (
    <View style={styles.container}>
      <View style={[styles.swatch, { backgroundColor: hexColor }]} />
      <View style={styles.textContainer}>
        <Text style={styles.labelText}>Color:</Text>
        <Text style={styles.colorName}>{colorName}</Text>
        <Text style={styles.rgbText}>{`RGB (${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b})`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  labelText: {
    color: '#aaa',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  colorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  rgbText: {
    color: '#ccc',
    fontSize: 9,
  },
});

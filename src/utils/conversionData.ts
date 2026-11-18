export interface UnitItem {
  id: string;
  label: string;
  symbol: string;
  toBase: number; // Multiply value by toBase to reach the category base unit
}

export interface UnitCategoryGroup {
  id: string;
  label: string;
  baseUnitLabel: string;
  units: UnitItem[];
}

export const LENGTH_UNITS: UnitItem[] = [
  { id: 'mm', label: 'Millimeter', symbol: 'mm', toBase: 0.001 },
  { id: 'cm', label: 'Centimeter', symbol: 'cm', toBase: 0.01 },
  { id: 'm', label: 'Meter', symbol: 'm', toBase: 1 },
  { id: 'km', label: 'Kilometer', symbol: 'km', toBase: 1000 },
  { id: 'in', label: 'Inch', symbol: 'in', toBase: 0.0254 },
  { id: 'ft', label: 'Foot', symbol: 'ft', toBase: 0.3048 },
  { id: 'yd', label: 'Yard', symbol: 'yd', toBase: 0.9144 },
  { id: 'mi', label: 'Mile', symbol: 'mi', toBase: 1609.344 },
  { id: 'nmi', label: 'Nautical Mile', symbol: 'nmi', toBase: 1852 },
];

export const WEIGHT_UNITS: UnitItem[] = [
  { id: 'mg', label: 'Milligram', symbol: 'mg', toBase: 0.000001 },
  { id: 'g', label: 'Gram', symbol: 'g', toBase: 0.001 },
  { id: 'kg', label: 'Kilogram', symbol: 'kg', toBase: 1 },
  { id: 't', label: 'Metric Ton', symbol: 't', toBase: 1000 },
  { id: 'oz', label: 'Ounce', symbol: 'oz', toBase: 0.028349523125 },
  { id: 'lb', label: 'Pound', symbol: 'lb', toBase: 0.45359237 },
  { id: 'st', label: 'Stone', symbol: 'st', toBase: 6.35029318 },
  { id: 'uston', label: 'US Short Ton', symbol: 'ton', toBase: 907.18474 },
];

export const TIME_UNITS: UnitItem[] = [
  { id: 'ms', label: 'Millisecond', symbol: 'ms', toBase: 0.001 },
  { id: 's', label: 'Second', symbol: 's', toBase: 1 },
  { id: 'min', label: 'Minute', symbol: 'min', toBase: 60 },
  { id: 'hr', label: 'Hour', symbol: 'hr', toBase: 3600 },
  { id: 'day', label: 'Day', symbol: 'd', toBase: 86400 },
  { id: 'wk', label: 'Week', symbol: 'wk', toBase: 604800 },
  { id: 'mo', label: 'Month (Avg)', symbol: 'mo', toBase: 2629746 },
  { id: 'yr', label: 'Year (Gregorian)', symbol: 'yr', toBase: 31556952 },
];

export const MULTI_UNIT_CATEGORIES: UnitCategoryGroup[] = [
  {
    id: 'area',
    label: 'Area',
    baseUnitLabel: 'Square Meter',
    units: [
      { id: 'sqmm', label: 'Square Millimeter', symbol: 'mm²', toBase: 1e-6 },
      { id: 'sqcm', label: 'Square Centimeter', symbol: 'cm²', toBase: 1e-4 },
      { id: 'sqm', label: 'Square Meter', symbol: 'm²', toBase: 1 },
      { id: 'ha', label: 'Hectare', symbol: 'ha', toBase: 10000 },
      { id: 'sqkm', label: 'Square Kilometer', symbol: 'km²', toBase: 1e6 },
      { id: 'sqin', label: 'Square Inch', symbol: 'in²', toBase: 0.00064516 },
      { id: 'sqft', label: 'Square Foot', symbol: 'ft²', toBase: 0.09290304 },
      { id: 'sqyd', label: 'Square Yard', symbol: 'yd²', toBase: 0.83612736 },
      { id: 'acre', label: 'Acre', symbol: 'ac', toBase: 4046.8564224 },
      { id: 'sqmi', label: 'Square Mile', symbol: 'mi²', toBase: 2589988.110336 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    baseUnitLabel: 'Liter',
    units: [
      { id: 'ml', label: 'Milliliter', symbol: 'mL', toBase: 0.001 },
      { id: 'l', label: 'Liter', symbol: 'L', toBase: 1 },
      { id: 'm3', label: 'Cubic Meter', symbol: 'm³', toBase: 1000 },
      { id: 'tsp', label: 'US Teaspoon', symbol: 'tsp', toBase: 0.00492892159375 },
      { id: 'tbsp', label: 'US Tablespoon', symbol: 'tbsp', toBase: 0.01478676478125 },
      { id: 'floz', label: 'US Fluid Ounce', symbol: 'fl oz', toBase: 0.0295735295625 },
      { id: 'cup', label: 'US Cup', symbol: 'cup', toBase: 0.2365882365 },
      { id: 'pt', label: 'US Pint', symbol: 'pt', toBase: 0.473176473 },
      { id: 'qt', label: 'US Quart', symbol: 'qt', toBase: 0.946352946 },
      { id: 'gal', label: 'US Gallon', symbol: 'gal', toBase: 3.785411784 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    baseUnitLabel: 'Meters per Second',
    units: [
      { id: 'mps', label: 'Meters per second', symbol: 'm/s', toBase: 1 },
      { id: 'kph', label: 'Kilometers per hour', symbol: 'km/h', toBase: 1 / 3.6 },
      { id: 'mph', label: 'Miles per hour', symbol: 'mph', toBase: 0.44704 },
      { id: 'fps', label: 'Feet per second', symbol: 'ft/s', toBase: 0.3048 },
      { id: 'knot', label: 'Knot', symbol: 'kn', toBase: 1852 / 3600 },
    ],
  },
  {
    id: 'data',
    label: 'Digital Storage',
    baseUnitLabel: 'Byte',
    units: [
      { id: 'bit', label: 'Bit', symbol: 'b', toBase: 0.125 },
      { id: 'byte', label: 'Byte', symbol: 'B', toBase: 1 },
      { id: 'kb', label: 'Kilobyte (Decimal)', symbol: 'KB', toBase: 1000 },
      { id: 'mb', label: 'Megabyte (Decimal)', symbol: 'MB', toBase: 1e6 },
      { id: 'gb', label: 'Gigabyte (Decimal)', symbol: 'GB', toBase: 1e9 },
      { id: 'tb', label: 'Terabyte (Decimal)', symbol: 'TB', toBase: 1e12 },
      { id: 'kib', label: 'Kibibyte (Binary)', symbol: 'KiB', toBase: 1024 },
      { id: 'mib', label: 'Mebibyte (Binary)', symbol: 'MiB', toBase: 1048576 },
      { id: 'gib', label: 'Gibibyte (Binary)', symbol: 'GiB', toBase: 1073741824 },
    ],
  },
  {
    id: 'pressure',
    label: 'Pressure',
    baseUnitLabel: 'Pascal',
    units: [
      { id: 'pa', label: 'Pascal', symbol: 'Pa', toBase: 1 },
      { id: 'kpa', label: 'Kilopascal', symbol: 'kPa', toBase: 1000 },
      { id: 'bar', label: 'Bar', symbol: 'bar', toBase: 100000 },
      { id: 'psi', label: 'PSI', symbol: 'psi', toBase: 6894.757293168 },
      { id: 'atm', label: 'Standard Atmosphere', symbol: 'atm', toBase: 101325 },
    ],
  },
  {
    id: 'energy',
    label: 'Energy',
    baseUnitLabel: 'Joule',
    units: [
      { id: 'j', label: 'Joule', symbol: 'J', toBase: 1 },
      { id: 'kj', label: 'Kilojoule', symbol: 'kJ', toBase: 1000 },
      { id: 'cal', label: 'Calorie (th)', symbol: 'cal', toBase: 4.184 },
      { id: 'kcal', label: 'Kilocalorie (Food)', symbol: 'kcal', toBase: 4184 },
      { id: 'wh', label: 'Watt-hour', symbol: 'Wh', toBase: 3600 },
      { id: 'kwh', label: 'Kilowatt-hour', symbol: 'kWh', toBase: 3600000 },
      { id: 'btu', label: 'BTU (IT)', symbol: 'BTU', toBase: 1055.05585262 },
    ],
  },
];

export function convertLinearUnit(value: number, fromUnit: UnitItem, toUnit: UnitItem): number {
  if (!Number.isFinite(value)) return 0;
  const baseValue = value * fromUnit.toBase;
  return baseValue / toUnit.toBase;
}

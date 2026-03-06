import {
  Coffee,
  ShoppingBag,
  Box,
  UtensilsCrossed,
  Sticker,
  Package,
  Wine,
  Cake,
  Pizza,
  Candy,
  IceCreamCone,
  Salad,
  Soup,
  Sandwich,
  Gift,
  Tag,
  Ribbon,
  Printer,
  Palette,
  Scissors,
  CircleDot,
  Square,
  Star,
  Heart,
  Leaf,
  Recycle,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  ShoppingBag,
  Box,
  UtensilsCrossed,
  Sticker,
  Package,
  Wine,
  Cake,
  Pizza,
  Candy,
  IceCreamCone,
  Salad,
  Soup,
  Sandwich,
  Gift,
  Tag,
  Ribbon,
  Printer,
  Palette,
  Scissors,
  CircleDot,
  Square,
  Star,
  Heart,
  Leaf,
  Recycle,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export { ICON_MAP };

export function getProductIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Package;
}

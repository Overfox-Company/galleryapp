import {
  Briefcase02Icon,
  Camera01Icon,
  CodeSquareIcon,
  Globe02Icon,
  Grid02Icon,
  PaintBrush01Icon,
  ShoppingBag02Icon,
  SmartPhone01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CategoryIconName } from "../constants/category-icons";

const icons: Record<CategoryIconName, IconSvgElement> = {
  design: PaintBrush01Icon,
  mobile: SmartPhone01Icon,
  web: Globe02Icon,
  commerce: ShoppingBag02Icon,
  productivity: Briefcase02Icon,
  code: CodeSquareIcon,
  media: Camera01Icon,
  other: Grid02Icon,
};

export function CategoryIcon({ name, size = 20 }: { name: string; size?: number }) {
  const icon = icons[name as CategoryIconName] ?? Grid02Icon;
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} />;
}

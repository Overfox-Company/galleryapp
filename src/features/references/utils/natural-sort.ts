const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export function naturalSort<T>(items: T[], getName: (item: T) => string) {
  return [...items].sort((left, right) => collator.compare(getName(left), getName(right)));
}

// src/lib/locale.ts

export function getNameFallback(row: {
  name_tr?: string | null;
  name_en?: string | null;
  key?: string | null;
  slug?: string | null;
}): string {
  return (
    row.name_tr ??
    row.name_en ??
    row.key ??
    row.slug ??
    "İsimsiz"
  );
}

export function getDescriptionFallback(row: {
  description_tr?: string | null;
  description_en?: string | null;
}): string | null {
  return row.description_tr ?? row.description_en ?? null;
}

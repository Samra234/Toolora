import { useMemo } from 'react';
import { CategorySlug } from '../data/categories';
import { TOOLS, ToolDefinition } from '../data/tools';

export function useToolSearch(query: string, category: CategorySlug | 'all' = 'all'): ToolDefinition[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (category !== 'all' && tool.category !== category) {
        return false;
      }
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
        tool.category.replace('-', ' ').includes(q)
      );
    });
  }, [query, category]);
}

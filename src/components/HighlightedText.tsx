import React, { useMemo } from 'react';
import { buildHighlightRegex } from '../utils/mnemonics';

interface HighlightedTextProps {
  text: string;
  extraKeywords?: string[];
  enabled: boolean;
  maxMatches?: number;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  extraKeywords = [],
  enabled,
  maxMatches = 1,
}) => {
  const regex = useMemo(
    () => (enabled ? buildHighlightRegex(extraKeywords) : null),
    [enabled, extraKeywords]
  );

  if (!enabled || !regex || maxMatches <= 0) {
    return <>{text}</>;
  }

  // Find at most `maxMatches` non-overlapping core keyword matches (preferring the first/longest)
  const matches = Array.from(text.matchAll(regex));
  if (matches.length === 0) {
    return <>{text}</>;
  }

  // Pick the longest decisive match if maxMatches === 1
  const chosen =
    maxMatches === 1
      ? [
          matches.reduce((best, cur) =>
            cur[0].length > best[0].length ? cur : best
          ),
        ]
      : matches.slice(0, maxMatches);

  chosen.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  chosen.forEach((m, idx) => {
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (start > cursor) {
      nodes.push(<React.Fragment key={`t-${idx}`}>{text.slice(cursor, start)}</React.Fragment>);
    }
    nodes.push(
      <mark
        key={`m-${idx}`}
        className="rounded-xs bg-amber-500/10 px-1 text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-4 dark:text-amber-100"
      >
        {m[0]}
      </mark>
    );
    cursor = end;
  });

  if (cursor < text.length) {
    nodes.push(<React.Fragment key="t-end">{text.slice(cursor)}</React.Fragment>);
  }

  return <>{nodes}</>;
};

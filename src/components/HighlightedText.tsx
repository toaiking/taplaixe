import React, { useMemo } from 'react';
import { buildHighlightRegex } from '../utils/mnemonics';

interface HighlightedTextProps {
  text: string;
  extraKeywords?: string[];
  enabled: boolean;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  extraKeywords = [],
  enabled,
}) => {
  const regex = useMemo(
    () => (enabled ? buildHighlightRegex(extraKeywords) : null),
    [enabled, extraKeywords]
  );

  if (!enabled || !regex) {
    return <>{text}</>;
  }

  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return (
            <mark
              key={idx}
              className="rounded bg-amber-200/80 px-1 py-0.5 font-semibold text-slate-900 dark:bg-amber-400/30 dark:text-amber-100"
            >
              {part}
            </mark>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};

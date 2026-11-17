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
              className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800 dark:bg-amber-400/25 dark:text-amber-200"
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

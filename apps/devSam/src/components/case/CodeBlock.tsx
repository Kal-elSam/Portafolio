import { useRef, useState } from 'react';

import { useJs } from './useCase';

import styles from './case.module.css';

/** Comment lines start with `#`; every other line is a command. */
export default function CodeBlock({
  lines,
  label,
}: {
  lines: string[];
  label: string;
}) {
  const js = useJs();
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  const raw = lines.join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`${styles.codeBlock} ${styles.cut}`}>
      <div className={styles.codeHead}>
        <span>
          <i aria-hidden="true" />
          {label}
        </span>
        {js ? (
          <button type="button" className={styles.copy} onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
      <pre>
        <code>
          {lines.map((line) => (
            <span
              key={line}
              className={styles.cl}
              data-cmd={line.startsWith('#') ? '0' : '1'}
              data-note={line.startsWith('#') ? '1' : '0'}
            >
              {line}
            </span>
          ))}
        </code>
      </pre>
      <span className={styles.srOnly} role="status">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  );
}

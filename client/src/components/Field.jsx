import { useId } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

/** Labelled input/textarea with an error message from the API's field codes. */
export default function Field({ label, error, multiline = false, className = '', ...props }) {
  const { t } = useLanguage();
  const id = useId();
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[12.5px] text-ink/80">
        {label}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        rows={multiline ? 5 : undefined}
        className={`mt-2 block w-full border-b bg-transparent py-2.5 text-[15px] transition-colors placeholder:text-muted/70 focus:border-forest focus:outline-none ${
          error ? 'border-red-600' : 'border-line'
        } ${multiline ? 'resize-y' : ''}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-red-700">
          {t(`errors.${error}`)}
        </p>
      )}
    </div>
  );
}

/** Hidden anti-spam field: humans never see it, bots fill it in. */
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

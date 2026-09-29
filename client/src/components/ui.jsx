import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { photo } from '../data/images.js';

export function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-5 md:px-8 ${className}`} {...props}>
      {children}
    </Tag>
  );
}

const buttonVariants = {
  solid: 'bg-forest text-white hover:bg-forest-dark',
  outline: 'border border-forest text-forest hover:bg-forest hover:text-white',
  light: 'border border-white/70 text-white hover:bg-white hover:text-ink',
  white: 'bg-white text-ink hover:bg-sand',
};

/** Button rendered as a router Link (`to`), an external link (`href`) or a <button>. */
export function Button({ to, href, variant = 'solid', arrow = true, className = '', children, ...props }) {
  const classes = `group inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[13px] tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}

/** Small underlined text link with an arrow ("Découvrir →"). */
export function TextLink({ to, href, className = '', children, ...props }) {
  const classes = `group inline-flex items-center gap-2 border-b border-current pb-1 text-[13px] tracking-wide text-forest transition-colors hover:text-forest-light ${className}`;
  const content = (
    <>
      {children}
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
    </>
  );
  return to ? (
    <Link to={to} className={classes} {...props}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  );
}

export function Eyebrow({ className = '', children }) {
  return <p className={`eyebrow text-muted ${className}`}>{children}</p>;
}

/** Display title; `lines` may be a string or an array rendered on separate lines. */
export function Title({ as: Tag = 'h2', lines, className = '' }) {
  const parts = Array.isArray(lines) ? lines : [lines];
  return (
    <Tag className={`font-display font-medium leading-[1.02] tracking-[-0.01em] ${className}`}>
      {parts.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </Tag>
  );
}

export function Img({ name, alt = '', sizes = '100vw', className = '', eager = false, ...props }) {
  const { src, srcSet } = photo(name);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`object-cover ${className}`}
      {...props}
    />
  );
}

/** Vertical stack of small caps words with a rule, used at image corners. */
export function AsideLabel({ words, className = '' }) {
  return (
    <div className={`eyebrow text-[10px] leading-[1.9] text-white/90 ${className}`}>
      {words.map((w) => (
        <span key={w} className="block">
          {w}
        </span>
      ))}
      <span className="mt-3 block h-px w-8 bg-white/70" />
    </div>
  );
}

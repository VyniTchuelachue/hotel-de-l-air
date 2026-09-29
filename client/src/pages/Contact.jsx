import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import Field, { Honeypot } from '../components/Field.jsx';
import Reveal from '../components/Reveal.jsx';
import { MapEmbed, PageHero } from '../components/sections.jsx';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons.jsx';
import { Button, Container, TextLink } from '../components/ui.jsx';
import { hotel } from '../data/hotel.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { api } from '../lib/api.js';
import { usePageTitle } from '../lib/usePageTitle.js';

const empty = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-4 border-b border-line py-6 first:pt-0">
      <Icon className="mt-1 size-5 shrink-0 text-forest" strokeWidth={1.25} />
      <div>
        <p className="eyebrow text-[10px] text-muted">{label}</p>
        <div className="mt-2 text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { t } = useLanguage();
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState(null);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const fieldError = (key) => error?.fields?.[key];

  async function submit(e) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      await api.contact(values);
      setStatus('sent');
      setValues(empty);
    } catch (err) {
      setError(err);
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start bg-white p-8 md:p-12" role="status">
        <CheckCircle2 className="size-10 text-forest" strokeWidth={1} />
        <p className="mt-5 font-display text-3xl leading-snug">{t('contactPage.form.success')}</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-8 text-[13px] text-forest underline underline-offset-4">
          {t('contactPage.form.another')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative bg-white p-8 md:p-12">
      <h2 className="font-display text-4xl">{t('contactPage.formTitle')}</h2>
      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        <Field label={t('contactPage.form.name')} value={values.name} onChange={set('name')} error={fieldError('name')} autoComplete="name" required />
        <Field
          label={t('contactPage.form.email')}
          type="email"
          value={values.email}
          onChange={set('email')}
          error={fieldError('email')}
          autoComplete="email"
          required
        />
        <Field label={t('contactPage.form.phone')} type="tel" value={values.phone} onChange={set('phone')} error={fieldError('phone')} autoComplete="tel" />
        <Field label={t('contactPage.form.subject')} value={values.subject} onChange={set('subject')} error={fieldError('subject')} />
        <Field
          label={t('contactPage.form.message')}
          multiline
          value={values.message}
          onChange={set('message')}
          error={fieldError('message')}
          className="sm:col-span-2"
          required
        />
      </div>
      <Honeypot value={values.website} onChange={(website) => setValues((v) => ({ ...v, website }))} />
      {error && (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {t(`errors.${error.code}`)}
        </p>
      )}
      <Button type="submit" className="mt-9" disabled={status === 'sending'}>
        {status === 'sending' ? t('contactPage.form.sending') : t('contactPage.form.submit')}
      </Button>
    </form>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  usePageTitle('contact');

  return (
    <>
      <PageHero image="lounge" {...t('contactPage.hero')} />

      <Container as="section" className="grid gap-12 py-20 md:py-24 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <Reveal>
          <h2 className="font-display text-4xl">{t('contactPage.infoTitle')}</h2>
          <div className="mt-8">
            <InfoRow icon={MapPin} label={t('contactPage.address')}>
              <p>
                {hotel.street}
                <br />
                {hotel.district}, {hotel.city} — {hotel.country}
              </p>
              <TextLink href={hotel.directionsUrl} target="_blank" rel="noreferrer" className="mt-3">
                {t('common.directions')}
              </TextLink>
            </InfoRow>
            <InfoRow icon={Phone} label={t('contactPage.phone')}>
              <a href={hotel.phoneHref} className="hover:text-forest">
                {hotel.phone}
              </a>
              <a
                href={hotel.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 text-[13.5px] text-forest hover:underline"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} /> {t('common.whatsapp')}
              </a>
            </InfoRow>
            <InfoRow icon={Mail} label={t('contactPage.email')}>
              <a href={`mailto:${hotel.email}`} className="break-all hover:text-forest">
                {hotel.email}
              </a>
            </InfoRow>
            <InfoRow icon={Clock} label={t('contactPage.reception')}>
              {t('footer.reception')}
            </InfoRow>
            <div className="flex items-center gap-4 pt-6">
              <p className="eyebrow text-[10px] text-muted">{t('contactPage.social')}</p>
              <a href={hotel.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-ink hover:text-forest">
                <InstagramIcon className="size-5" />
              </a>
              <a href={hotel.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-ink hover:text-forest">
                <FacebookIcon className="size-5" />
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </Container>

      <MapEmbed className="h-[420px] w-full" />
    </>
  );
}

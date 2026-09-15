'use client';

import Script from 'next/script';
import { createContext, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { ComponentProps, FormEvent, Ref } from 'react';
import { useLocale } from 'next-intl';

type TurnstileAPI = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileAPI } }

export type TurnstileFormHandle = { consumeToken: () => string; reset: () => void };
const Context = createContext<{
  actionName: string;
  setToken: (token: string) => void;
  setError: (error: string) => void;
  registerReset: (reset: (() => void) | null) => void;
} | null>(null);

type Props = Omit<ComponentProps<'form'>, 'onSubmit' | 'ref'> & {
  actionName: string;
  onSubmit: (event: FormEvent<HTMLFormElement>, token: string) => void | Promise<void>;
  ref?: Ref<TurnstileFormHandle>;
};

export function TurnstileForm({ actionName, onSubmit, children, ref, ...props }: Props) {
  const es = useLocale() === 'es';
  const [error, setError] = useState('');
  const token = useRef('');
  const busy = useRef(false);
  const resetWidget = useRef<(() => void) | null>(null);
  const setToken = useCallback((value: string) => { token.current = value; }, []);
  const registerReset = useCallback((reset: (() => void) | null) => { resetWidget.current = reset; }, []);
  const consumeToken = useCallback(() => {
    if (!token.current) throw new Error(es ? 'Completa la verificación de seguridad.' : 'Please complete the security check.');
    const value = token.current;
    token.current = '';
    return value;
  }, [es]);
  const reset = useCallback(() => { token.current = ''; resetWidget.current?.(); }, []);
  useImperativeHandle(ref, () => ({ consumeToken, reset }), [consumeToken, reset]);
  const context = useMemo(() => ({ actionName, setToken, setError, registerReset }), [actionName, setToken, registerReset]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    let response: string;
    try { response = consumeToken(); }
    catch (reason) { setError((reason as Error).message); return; }
    busy.current = true;
    setError('');
    try { await onSubmit(event, response); }
    catch { setError(es ? 'No se pudo enviar. Inténtalo de nuevo.' : 'Unable to submit. Please try again.'); }
    finally { busy.current = false; reset(); }
  }

  return <Context.Provider value={context}>
    <form {...props} onSubmit={submit}>
      {error && <p role="alert" className="text-sm text-pbs-red col-span-full basis-full">{error}</p>}
      {children}
    </form>
  </Context.Provider>;
}

export function TurnstileField() {
  const context = useContext(Context);
  if (!context) throw new Error('TurnstileField must be inside TurnstileForm');
  const { actionName, setToken, setError, registerReset } = context;
  const locale = useLocale();
  const [ready, setReady] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const unavailable = locale === 'es' ? 'No se pudo cargar la verificación. Recarga esta página.' : 'Security verification could not load. Reload this page.';
  useEffect(() => {
    if (!ready || !container.current || !window.turnstile || !sitekey) return;
    const api = window.turnstile;
    const id = api.render(container.current, {
      sitekey, action: actionName, theme: 'auto', size: 'flexible', language: locale,
      'response-field': false,
      callback: (value: string) => { setToken(value); setError(''); },
      'expired-callback': () => setToken(''),
      'timeout-callback': () => { setToken(''); api.reset(id); },
      'error-callback': () => { setToken(''); setError(unavailable); return true; },
    });
    registerReset(() => api.reset(id));
    return () => { setToken(''); registerReset(null); api.remove(id); };
  }, [ready, sitekey, actionName, locale, setToken, setError, registerReset, unavailable]);
  return <div className="min-w-0 w-full">
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setError(unavailable)} />
    <div ref={container} />
    {!sitekey && <p role="alert" className="text-sm text-pbs-red">{unavailable}</p>}
  </div>;
}

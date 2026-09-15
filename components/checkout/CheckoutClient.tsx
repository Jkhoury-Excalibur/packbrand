'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { ArrowRight, FileImage, ShoppingBag, Upload, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';
import { startShopifyCheckout } from '@/lib/actions/shopify-checkout';
import { TurnstileForm, TurnstileField, type TurnstileFormHandle } from '@/components/shared/TurnstileForm';

const subscribe = () => () => {};
const inputClass = 'w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm';
const panelClass = 'rounded-3xl border border-pbs-gray-200 dark:border-pbs-gray-800 p-6 space-y-4';

export function CheckoutClient() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const locale = useLocale();
  const es = locale === 'es';
  const items = useCartStore(s => s.items);
  const [note, setNote] = useState('');
  const [logoFiles, setLogoFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submittingRef = useRef(false);
  const security = useRef<TurnstileFormHandle>(null);
  const hasLegacyItems = items.some(item => !item.variantId);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const money = (amount: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);

  async function uploadLogos(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []).slice(0, 3 - logoFiles.length);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const token = security.current?.consumeToken();
      if (!token) throw new Error('Security verification required');
      const response = await fetch('/api/upload-logo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, files: files.map(file => ({ filename: file.name, contentType: file.type, fileSize: file.size })) }),
      });
      if (!response.ok) throw new Error('Upload failed');
      const { uploads } = await response.json();
      for (const [index, file] of files.entries()) {
        const data = uploads[index];
        const upload = await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
        if (!upload.ok) throw new Error('Upload failed');
        setLogoFiles(previous => [...previous, { name: file.name, url: data.publicUrl }]);
      }
    } catch {
      setError(es ? 'Completa la verificación de seguridad e intenta subir el archivo de nuevo.' : 'Complete the security check and try uploading the file again.');
    } finally { security.current?.reset(); setUploading(false); input.value = ''; }
  }

  async function checkout(event: React.FormEvent, token: string) {
    event.preventDefault();
    if (submittingRef.current || uploading || hasLegacyItems || !items.length) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError('');
    try {
      const result = await startShopifyCheckout({
        cartId: useCartStore.getState().cartId,
        lines: items.map(item => ({ id: item.id, revision: item.revision, variantId: item.variantId, quantity: item.qty })),
        note, logoUrls: logoFiles.map(file => file.url), locale: es ? 'es' : 'en',
      }, token);
      if ('error' in result) {
        const errors: Record<string, string> = {
          TURNSTILE_FAILED: es ? 'La verificación de seguridad falló. Inténtalo de nuevo.' : 'Security verification failed. Please try again.',
          INVALID_CART: es ? 'Revisa tu carrito y vuelve a añadir los productos desde el catálogo.' : 'Review your cart and re-add the products from the catalog.',
          UNAVAILABLE: es ? 'Un producto ya no está disponible. Revisa tu carrito antes de continuar.' : 'An item is no longer available. Review your cart before continuing.',
          QUANTITY: es ? 'La cantidad no cumple los límites actuales del producto. Vuelve a seleccionarla desde el catálogo.' : 'A quantity does not meet the current product limits. Select it again from the catalog.',
          CART_CHANGED: es ? 'La disponibilidad de tu carrito cambió. Revisa los productos antes de continuar.' : 'Your cart availability changed. Review the products before continuing.',
        };
        setError(errors[result.error] ?? (es ? 'No se pudo abrir el pago. Inténtalo de nuevo.' : 'Checkout could not be opened. Please try again.'));
        return;
      }
      // Opening checkout is not a completed order. Keep the local cart when buyers go back.
      useCartStore.getState().trackCheckout();
      window.location.assign(result.checkoutUrl);
    } catch {
      setError(es ? 'No se pudo conectar. Tu carrito sigue guardado. Inténtalo de nuevo.' : 'Unable to connect. Your cart is still saved. Please try again.');
    } finally { submittingRef.current = false; setSubmitting(false); }
  }

  if (!mounted) return null;
  if (!items.length) return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-24 flex flex-col items-center gap-6">
      <ShoppingBag className="h-16 w-16 text-pbs-gray-400" />
      <h1 className="text-2xl font-bold">{es ? 'Tu carrito está vacío' : 'Your cart is empty'}</h1>
      <Link href="/products"><Button>{es ? 'Ver productos' : 'Browse Products'}</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{es ? 'Finalizar compra' : 'Checkout'}</h1>
      <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mb-8">{es ? 'Añade los detalles de tu diseño y continúa al pago seguro. La dirección de envío y el pago se completan en el siguiente paso.' : 'Add your artwork details, then continue to secure checkout. Enter your shipping address and payment in the next step.'}</p>
      <TurnstileForm ref={security} actionName="checkout" onSubmit={checkout} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <fieldset disabled={submitting || uploading} className="lg:col-span-2 space-y-6 min-w-0">
          <div className={panelClass}>
            <label htmlFor="order-note" className="block font-semibold">{es ? 'Instrucciones de diseño (opcional)' : 'Artwork instructions (optional)'}</label>
            <textarea id="order-note" rows={5} maxLength={5000} value={note} onChange={event => setNote(event.target.value)} className={inputClass} placeholder={es ? 'Colores, detalles del logotipo o solicitudes especiales…' : 'Colors, logo details, or special requests…'} />
          </div>
          <div className={panelClass}>
            <h2 className="font-semibold">{es ? 'Tu logotipo (opcional)' : 'Your logo (optional)'}</h2>
            <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">{es ? 'Hasta 3 archivos, 10 MB cada uno: PNG, JPG, SVG, WebP o PDF. También puedes enviarlos por correo más tarde.' : 'Up to 3 files, 10 MB each: PNG, JPG, SVG, WebP, or PDF. You can also email them later.'}</p>
            {logoFiles.map((file, index) => <div key={file.url} className="flex items-center gap-3 text-sm">
              <FileImage className="h-4 w-4 shrink-0" /><span className="truncate flex-1">{file.name}</span>
              <button type="button" aria-label={`${es ? 'Eliminar' : 'Remove'} ${file.name}`} onClick={() => setLogoFiles(previous => previous.filter((_, i) => i !== index))}><X className="h-4 w-4" /></button>
            </div>)}
            {logoFiles.length < 3 && <label className="flex items-center justify-center gap-2 border-2 border-dashed border-pbs-gray-300 dark:border-pbs-gray-600 rounded-xl p-4 cursor-pointer">
              <Upload className="h-4 w-4" />{uploading ? (es ? 'Subiendo…' : 'Uploading…') : (es ? 'Elegir archivos' : 'Choose files')}
              <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp,.pdf" multiple className="sr-only" onChange={uploadLogos} />
            </label>}
          </div>
        </fieldset>
        <div className={`${panelClass} lg:sticky lg:top-24`}>
          <h2 className="font-semibold">{es ? 'Resumen del pedido' : 'Order summary'}</h2>
          {items.map(item => <div key={item.id} className="flex justify-between gap-3 text-sm">
            <div><p className="font-medium">{item.name}</p><p className="text-pbs-gray-500 dark:text-pbs-gray-400">{item.size !== 'Standard' ? item.size : ''} · {item.qtyLabel}</p></div>
            <span className="shrink-0">{money(item.lineTotal)}</span>
          </div>)}
          <div className="border-t border-pbs-gray-200 dark:border-pbs-gray-800 pt-4 flex justify-between font-semibold"><span>{es ? 'Subtotal estimado' : 'Estimated subtotal'}</span><span>{money(subtotal)}</span></div>
          <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{es ? 'Los precios finales, el envío, los impuestos y los descuentos se calculan en el pago.' : 'Final prices, shipping, taxes, and discounts are calculated at checkout.'}</p>
          {hasLegacyItems && <p role="alert" className="text-sm text-pbs-red">{es ? 'Tu carrito contiene productos del catálogo anterior. Elimínalos y añade sus versiones actuales antes de pagar.' : 'Your cart contains products from the previous catalog. Remove them and add their current versions before checkout.'}</p>}
          {error && <p role="alert" className="text-sm text-pbs-red">{error}</p>}
          <TurnstileField />
          <Button type="submit" size="lg" className="w-full" disabled={submitting || uploading || hasLegacyItems}>
            {submitting ? (es ? 'Abriendo pago…' : 'Opening checkout…') : (es ? 'Continuar al pago seguro' : 'Continue to secure checkout')}<ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Link href="/cart" className="block text-center text-sm text-pbs-red">{es ? 'Editar carrito' : 'Edit cart'}</Link>
        </div>
      </TurnstileForm>
    </div>
  );
}

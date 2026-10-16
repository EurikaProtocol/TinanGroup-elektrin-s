import { validateQuote, buildSummary, mailtoLink } from './validate.js';
import { COMPANY } from '../config.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function formData(form) {
  const d = Object.fromEntries(new FormData(form).entries());
  d.consent = form.elements.consent ? form.elements.consent.checked : true;
  return d;
}

/** Validates, shows per-field errors and an honest "not sent" enquiry summary with mailto link. */
export function bindQuoteForm(form, { getEstimate } = {}) {
  const out = form.querySelector('[data-result]');
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    form.querySelectorAll('[data-error]').forEach((n) => (n.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
    const d = formData(form);
    const errors = validateQuote(d);
    const keys = Object.keys(errors);
    keys.forEach((k) => {
      const slot = form.querySelector(`[data-error="${k}"]`);
      if (slot) slot.textContent = errors[k];
      const el = form.elements[k];
      if (el && el.setAttribute) el.setAttribute('aria-invalid', 'true');
    });
    if (keys.length) {
      out.innerHTML = '';
      const first = form.elements[keys[0]];
      if (first && first.focus) first.focus();
      return;
    }
    const summary = buildSummary(d, getEstimate ? getEstimate() : null);
    out.innerHTML = `<div class="notice ok" role="status">
      <strong>Užklausa dar neišsiųsta.</strong> Ši svetainė neturi el. pašto siuntimo serverio, todėl užklausa
      nebuvo perduota automatiškai. Atidarykite savo el. pašto programą arba nusiųskite santrauką adresu
      <a href="mailto:${COMPANY.email}">${COMPANY.email}</a> ar skambinkite <a href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a>.
      <textarea readonly rows="9" aria-label="Užklausos santrauka">${esc(summary)}</textarea>
      <div class="row"><a class="btn btn-primary" href="${mailtoLink(summary)}">Atidaryti el. paštą</a>
      <button type="button" class="btn btn-outline" data-copy>Kopijuoti santrauką</button></div></div>`;
    out.querySelector('[data-copy]').addEventListener('click', async (e) => {
      try {
        await navigator.clipboard.writeText(summary);
        e.target.textContent = 'Nukopijuota';
      } catch {
        out.querySelector('textarea').select();
      }
    });
  });
}

import { createI18n } from '@sehv-oss/i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
      subtitle: 'Current locale: {$locale}',
      items: `.match {$count :number}
one {{You have {$count} item}}
*   {{You have {$count} items}}`,
    },
    'pt-BR': {
      greeting: 'Olá, {$name}!',
      subtitle: 'Idioma atual: {$locale}',
      items: `.match {$count :number}
one {{Você tem {$count} item}}
*   {{Você tem {$count} itens}}`,
    },
    es: {
      greeting: '¡Hola, {$name}!',
      subtitle: 'Idioma actual: {$locale}',
      items: `.match {$count :number}
one {{Tienes {$count} elemento}}
*   {{Tienes {$count} elementos}}`,
    },
  },
});

const fruits: Record<string, string[]> = {
  en: ['apple', 'banana', 'orange'],
  'pt-BR': ['maçã', 'banana', 'laranja'],
  es: ['manzana', 'plátano', 'naranja'],
};

function render() {
  const locale = i18n.getLocale();
  const now = new Date();

  document.getElementById('subtitle')!.textContent = i18n.translate('subtitle', { locale });
  document.getElementById('greeting')!.textContent = i18n.translate('greeting', { name: 'World' });
  document.getElementById('items-one')!.textContent = i18n.translate('items', { count: 1 });
  document.getElementById('items-many')!.textContent = i18n.translate('items', { count: 5 });

  document.getElementById('number')!.textContent = i18n.formatNumber(1234567.89);

  document.getElementById('currency-usd')!.textContent = i18n.formatCurrency(1499.99, 'USD');
  document.getElementById('currency-brl')!.textContent = i18n.formatCurrency(1499.99, 'BRL');

  document.getElementById('date-long')!.textContent = i18n.formatDate(now, { dateStyle: 'long' });
  document.getElementById('date-short')!.textContent = i18n.formatDate(now, { dateStyle: 'short' });

  document.getElementById('list')!.textContent = i18n.formatList(fruits[locale] ?? fruits['en']!);

  document.getElementById('relative-past')!.textContent = i18n.formatRelativeTime(-2, 'days');
  document.getElementById('relative-future')!.textContent = i18n.formatRelativeTime(3, 'hours');
}

document.querySelectorAll('.locale-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const locale = (btn as HTMLElement).dataset['locale']!;
    i18n.setLocale(locale);

    document.querySelectorAll('.locale-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    render();
  });
});

render();

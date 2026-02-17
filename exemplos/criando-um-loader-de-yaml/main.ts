import { createI18n } from '@sehv-oss/i18n';
import { YamlLoader } from './yaml-loader';

const yamlLoader = new YamlLoader();

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  loaders: [yamlLoader],
});

let currentRawYaml = '';

async function loadLocale(locale: string) {
  const url = `/locales/${locale}.yaml`;

  const response = await fetch(url);
  const content = await response.text();

  currentRawYaml = content;

  const messages = yamlLoader.parse(content);
  i18n.loadMessages(locale, messages);
  i18n.setLocale(locale);

  render();
}

function render() {
  const locale = i18n.getLocale();

  document.getElementById('subtitle')!.textContent = i18n.translate(
    'subtitle',
    { locale }
  );
  document.getElementById('greeting')!.textContent = i18n.translate(
    'greeting',
    { name: 'World' }
  );
  document.getElementById('items-one')!.textContent = i18n.translate('items', {
    count: 1,
  });
  document.getElementById('items-many')!.textContent = i18n.translate('items', {
    count: 5,
  });
  document.getElementById('farewell')!.textContent = i18n.translate(
    'farewell',
    { name: 'World' }
  );
  document.getElementById('raw-yaml')!.textContent = currentRawYaml;
}

document.querySelectorAll('.locale-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const locale = (btn as HTMLElement).dataset['locale']!;

    document
      .querySelectorAll('.locale-btn')
      .forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    loadLocale(locale);
  });
});

loadLocale('en');

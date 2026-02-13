import { createI18n } from '@sehv-oss/i18n';

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      greeting: 'Hello, {$name}!',
      welcome: 'Welcome to the React example',
      items: `.match {$count :number}
one {{You have {$count} item in your cart}}
*   {{You have {$count} items in your cart}}`,
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.contact': 'Contact',
    },
    'pt-BR': {
      greeting: 'Olá, {$name}!',
      welcome: 'Bem-vindo ao exemplo React',
      items: `.match {$count :number}
one {{Você tem {$count} item no carrinho}}
*   {{Você tem {$count} itens no carrinho}}`,
      'nav.home': 'Início',
      'nav.about': 'Sobre',
      'nav.contact': 'Contato',
    },
    es: {
      greeting: '¡Hola, {$name}!',
      welcome: 'Bienvenido al ejemplo React',
      items: `.match {$count :number}
one {{Tienes {$count} elemento en el carrito}}
*   {{Tienes {$count} elementos en el carrito}}`,
      'nav.home': 'Inicio',
      'nav.about': 'Acerca de',
      'nav.contact': 'Contacto',
    },
  },
});

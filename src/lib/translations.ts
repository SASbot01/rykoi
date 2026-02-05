export type Lang = 'es' | 'en';

export const translations = {
  // Nav
  'nav.enter': { es: 'Entrar', en: 'Sign In' },
  'nav.exit': { es: 'Salir', en: 'Logout' },

  // Hero
  'hero.badge': { es: 'Directos en @s4sf__', en: 'Live on @s4sf__' },
  'hero.desc': { es: 'Abre sobres desde tu casa en', en: 'Open packs from home' },
  'hero.desc.live': { es: 'directo', en: 'live' },
  'hero.desc.end': { es: 'cada viernes.', en: 'every Friday.' },
  'hero.cta.packs': { es: 'Abrir Sobres', en: 'Open Packs' },
  'hero.cta.pokeballs': { es: 'Conseguir Pokeballs', en: 'Get Pokeballs' },

  // Stats
  'stats.breakers': { es: 'Breakers', en: 'Breakers' },
  'stats.packs': { es: 'Sobres Disponibles', en: 'Available Packs' },
  'stats.opened': { es: 'Total Abierto', en: 'Total Opened' },

  // How it works
  'how.step1.title': { es: '1. Apoya las Cajas', en: '1. Support the Boxes' },
  'how.step1.desc': { es: 'Por cada 8€ que aportes al crowdfunding, recibes 6 pokeballs y 2€ van a la caja.', en: 'For every €8 you contribute to crowdfunding, you get 6 pokeballs and €2 goes to the box.' },
  'how.step2.title': { es: '2. Compra Sobres', en: '2. Buy Packs' },
  'how.step2.desc': { es: 'Usa tus pokeballs para comprar sobres. Los abriremos en directo y las cartas son tuyas.', en: 'Use your pokeballs to buy packs. We open them live and the cards are yours.' },
  'how.step3.title': { es: '3. Cajas para el Canal', en: '3. Boxes for the Channel' },
  'how.step3.desc': { es: 'Cuando una caja llega al 100%, la abro en directo para crear contenido. ¡Gracias por apoyar!', en: 'When a box reaches 100%, I open it live to create content. Thanks for the support!' },

  // Boxes section
  'boxes.tag': { es: 'Crowdfunding', en: 'Crowdfunding' },
  'boxes.title': { es: 'Apoya las', en: 'Support the' },
  'boxes.title.highlight': { es: 'Cajas', en: 'Boxes' },
  'boxes.subtitle': { es: 'Contribuye al crowdfunding y consigue pokeballs para abrir tus sobres.', en: 'Contribute to crowdfunding and get pokeballs to open your packs.' },
  'boxes.info.foreach': { es: 'Por cada', en: 'For each' },
  'boxes.info.foryou': { es: 'para ti', en: 'for you' },
  'boxes.info.tobox': { es: 'a la caja', en: 'to the box' },

  // Box card
  'box.supporters': { es: 'supporters', en: 'supporters' },
  'box.contribute': { es: 'Apoyar y Conseguir Pokeballs', en: 'Support & Get Pokeballs' },
  'box.choose': { es: 'Elige cuánto quieres aportar', en: 'Choose how much to contribute' },
  'box.custom': { es: 'o personaliza', en: 'or customize' },
  'box.custom.title': { es: 'Cantidad personalizada', en: 'Custom amount' },
  'box.custom.receive': { es: 'Tú recibes:', en: 'You receive:' },
  'box.custom.tobox': { es: 'A la caja:', en: 'To the box:' },
  'box.custom.contribute': { es: 'Aportar', en: 'Contribute' },
  'box.custom.caja': { es: 'caja', en: 'box' },
  'box.stripe': { es: 'El pago se procesa con Stripe de forma segura', en: 'Payment is securely processed by Stripe' },
  'box.ready': { es: '¡Lista para abrir!', en: 'Ready to open!' },
  'box.live': { es: 'Ver en Directo', en: 'Watch Live' },
  'box.badge.active': { es: 'Activa', en: 'Active' },
  'box.badge.ready': { es: 'Lista', en: 'Ready' },
  'box.badge.live': { es: 'En Directo', en: 'Live' },
  'box.badge.completed': { es: 'Completada', en: 'Completed' },
  'box.contributed': { es: 'aportó', en: 'contributed' },
  'box.soon': { es: 'Pronto', en: 'Soon' },

  // Packs section
  'packs.tag': { es: 'Sobres Disponibles', en: 'Available Packs' },
  'packs.title': { es: 'Elige tu', en: 'Choose Your' },
  'packs.title.highlight': { es: 'Sobre', en: 'Pack' },
  'packs.use': { es: 'Usa tus pokeballs para comprar sobres.', en: 'Use your pokeballs to buy packs.' },
  'packs.live.friday': { es: '¡Los abrimos en directo el viernes!', en: 'We open them live on Friday!' },
  'packs.balance': { es: 'Tu saldo:', en: 'Your balance:' },
  'packs.getmore': { es: 'Conseguir más', en: 'Get more' },

  // Pack opening
  'pack.purchase': { es: 'Comprar Sobre', en: 'Buy Pack' },
  'pack.cancel': { es: 'Cancelar', en: 'Cancel' },
  'pack.live.info': { es: 'Apertura en directo', en: 'Live opening' },
  'pack.live.desc': { es: 'Tu sobre se abrirá en directo. ¡No te lo pierdas!', en: "Your pack will be opened live. Don't miss it!" },
  'pack.processing': { es: 'Procesando...', en: 'Processing...' },
  'pack.processing.desc': { es: 'Confirmando tu compra', en: 'Confirming your purchase' },
  'pack.success': { es: '¡Sobre Reservado!', en: 'Pack Reserved!' },
  'pack.success.desc': { es: 'Tu sobre de', en: 'Your pack of' },
  'pack.success.ready': { es: 'está listo', en: 'is ready' },
  'pack.success.open': { es: 'Tu sobre se abrirá', en: 'Your pack will be opened' },
  'pack.success.follow': { es: 'Seguir en Instagram', en: 'Follow on Instagram' },
  'pack.success.notify': { es: 'Recibirás una notificación antes del directo', en: "You'll be notified before the stream" },
  'pack.success.ok': { es: 'Entendido', en: 'Got it' },
  'pack.time.spain': { es: '(España)', en: '(Spain)' },

  // Sales section
  'sales.want': { es: '¿Quieres vender tus cartas?', en: 'Want to sell your cards?' },
  'sales.desc': { es: 'Si te toca una carta que no quieres quedarte, podemos venderla por ti. La pondremos en tu perfil al precio que nos indiques.', en: "If you get a card you don't want to keep, we can sell it for you. We'll list it on your profile at the price you set." },
  'sales.only': { es: 'Solo cartas obtenidas en nuestros directos', en: 'Only cards from our streams' },
  'sales.commission': { es: 'Comisión:', en: 'Commission:' },
  'sales.shipping': { es: '+ gastos de envío', en: '+ shipping costs' },
  'sales.noexternal': { es: 'No se aceptan cartas externas', en: 'External cards not accepted' },

  // Auth
  'auth.login': { es: 'Iniciar Sesión', en: 'Sign In' },
  'auth.register': { es: 'Crear Cuenta', en: 'Create Account' },
  'auth.login.desc': { es: 'Accede a tu cuenta de ryōiki', en: 'Access your ryōiki account' },
  'auth.register.desc': { es: 'Únete a la comunidad', en: 'Join the community' },
  'auth.username': { es: 'Usuario de Instagram', en: 'Instagram Username' },
  'auth.username.placeholder': { es: '@tu_usuario_instagram', en: '@your_instagram_username' },
  'auth.username.warning': { es: '¡IMPORTANTE! Usa tu usuario de Instagram exacto', en: 'IMPORTANT! Use your exact Instagram username' },
  'auth.username.why': { es: 'Lo necesitamos para verificar tu identidad y abrir tus sobres en directo.', en: 'We need it to verify your identity and open your packs live.' },
  'auth.email': { es: 'Email', en: 'Email' },
  'auth.password': { es: 'Contraseña', en: 'Password' },
  'auth.submit.login': { es: 'Entrar', en: 'Sign In' },
  'auth.submit.register': { es: 'Crear Cuenta', en: 'Create Account' },
  'auth.toggle.login': { es: '¿No tienes cuenta?', en: "Don't have an account?" },
  'auth.toggle.register': { es: '¿Ya tienes cuenta?', en: 'Already have an account?' },
  'auth.toggle.login.link': { es: 'Regístrate', en: 'Sign Up' },
  'auth.toggle.register.link': { es: 'Inicia sesión', en: 'Sign In' },
  'auth.processing': { es: 'Procesando...', en: 'Processing...' },
  'auth.error.email': { es: 'Introduce tu email', en: 'Enter your email' },
  'auth.error.password': { es: 'Introduce tu contraseña', en: 'Enter your password' },
  'auth.error.password.min': { es: 'La contraseña debe tener al menos 6 caracteres', en: 'Password must be at least 6 characters' },
  'auth.error.username': { es: 'Introduce tu nombre de usuario', en: 'Enter your username' },
  'auth.error.registered': { es: 'Este email ya está registrado', en: 'This email is already registered' },
  'auth.error.invalid': { es: 'Email o contraseña incorrectos', en: 'Invalid email or password' },
  'auth.error.connection': { es: 'Error de conexión. Inténtalo de nuevo.', en: 'Connection error. Try again.' },
  'auth.sales.title': { es: 'Venta de cartas', en: 'Card Sales' },
  'auth.sales.desc': { es: 'Solo puedes vender cartas que hayas obtenido en nuestros directos. Las pondremos en tu perfil al precio que nos indiques.', en: 'You can only sell cards obtained from our streams. We will list them on your profile at the price you specify.' },
  'auth.sales.commission': { es: 'Comisión: 1% + gastos de envío', en: 'Commission: 1% + shipping costs' },

  // Footer
  'footer.terms': { es: 'Términos', en: 'Terms' },
  'footer.privacy': { es: 'Privacidad', en: 'Privacy' },

  // Success page
  'success.verifying': { es: 'Verificando pago...', en: 'Verifying payment...' },
  'success.title': { es: '¡Pago Completado!', en: 'Payment Complete!' },
  'success.thanks': { es: 'Gracias por tu aportación de', en: 'Thank you for your contribution of' },
  'success.pokeballs': { es: 'Pokeballs añadidas a tu cuenta', en: 'Pokeballs added to your account' },
  'success.luck': { es: '¡Mucha suerte en las aperturas!', en: 'Good luck with the openings!' },
  'success.discord': { es: 'Únete a nuestra comunidad de Discord', en: 'Join our Discord community' },
  'success.back': { es: 'Volver a la web', en: 'Back to website' },
  'success.email': { es: 'Recibirás un email de confirmación con los detalles', en: "You'll receive a confirmation email with the details" },

  // Email confirmation page
  'confirm.title': { es: '¡Email Confirmado!', en: 'Email Confirmed!' },
  'confirm.desc': { es: 'Tu cuenta ha sido verificada correctamente. Ya puedes disfrutar de todas las funciones de Ryōiki.', en: 'Your account has been verified. You can now enjoy all Ryōiki features.' },
  'confirm.redirect': { es: 'Redirigiendo en', en: 'Redirecting in' },
  'confirm.seconds': { es: 'segundos...', en: 'seconds...' },
  'confirm.go': { es: 'Ir a Ryōiki ahora', en: 'Go to Ryōiki now' },

  // Guide popup
  'guide.title': { es: '¿Cómo funciona Ryōiki?', en: 'How does Ryōiki work?' },
  'guide.subtitle': { es: 'Tu guía paso a paso', en: 'Your step-by-step guide' },
  'guide.step1.title': { es: 'Crea tu cuenta', en: 'Create your account' },
  'guide.step1.desc': { es: 'Regístrate con tu usuario exacto de Instagram y tu email. Necesitamos tu @ de Instagram para verificarte cuando abramos tus sobres en directo.', en: 'Sign up with your exact Instagram username and email. We need your Instagram @ to verify you when we open your packs live.' },
  'guide.step2.title': { es: 'Apoya las cajas', en: 'Support the boxes' },
  'guide.step2.desc': { es: 'Contribuye al crowdfunding de cajas de Pokémon TCG. Por cada 8€ que aportes, recibes 6 Pokeballs para comprar sobres y 2€ van al fondo de la caja. El pago se hace con Stripe de forma segura.', en: 'Contribute to Pokémon TCG box crowdfunding. For every €8 you contribute, you get 6 Pokeballs to buy packs and €2 goes to the box fund. Payment is securely processed via Stripe.' },
  'guide.step3.title': { es: 'Compra sobres', en: 'Buy packs' },
  'guide.step3.desc': { es: 'Usa tus Pokeballs para reservar sobres de diferentes colecciones. Cada sobre tiene un precio en Pokeballs que varía según la colección y la rareza.', en: 'Use your Pokeballs to reserve packs from different collections. Each pack has a Pokeball price that varies by collection and rarity.' },
  'guide.step4.title': { es: 'Apertura en directo', en: 'Live opening' },
  'guide.step4.desc': { es: 'Todos los viernes a las 20:00h (España) abrimos tus sobres en directo por Instagram (@s4sf__). ¡Conéctate para ver qué cartas te tocan!', en: 'Every Friday at 8PM (Spain) we open your packs live on Instagram (@s4sf__). Tune in to see what cards you get!' },
  'guide.step5.title': { es: 'Las cartas son tuyas', en: 'The cards are yours' },
  'guide.step5.desc': { es: 'Todas las cartas de tu sobre son tuyas. Te las enviamos a casa. Si prefieres, podemos venderlas por ti en tu perfil con solo un 1% de comisión + gastos de envío.', en: 'All cards from your pack are yours. We ship them to you. If you prefer, we can sell them for you on your profile with just 1% commission + shipping costs.' },
  'guide.step6.title': { es: 'Cajas para el canal', en: 'Boxes for the channel' },
  'guide.step6.desc': { es: 'Cuando una caja llega al 100% de crowdfunding, la compramos y la abrimos en directo para crear contenido. ¡Gracias por hacer posible la comunidad!', en: 'When a box reaches 100% crowdfunding, we buy it and open it live to create content. Thanks for making the community possible!' },
  'guide.got.it': { es: '¡Entendido!', en: 'Got it!' },
  'guide.nav': { es: '¿Cómo funciona?', en: 'How it works?' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] || key;
}

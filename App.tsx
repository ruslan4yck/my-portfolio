import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Layers,
  Bot,
  Globe,
  Check,
  Plus,
  Minus,
  Sun,
  Moon,
  Move,
  Calculator,
  X,
  Clock,
  ChevronRight,
  PhoneCall,
  Menu,
} from 'lucide-react';

// ============================================================================
// CONSTANTS & WHATSAPP HELPER
// ============================================================================
const WHATSAPP_NUMBER = '77472413655';

const buildWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Snappy Neo-Brutalist Spring Physics
const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
};

// Stagger Reveal Variants
const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 35, rotate: 2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 24 },
  },
};

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================
export interface PortfolioItem {
  id: string;
  category: 'web' | 'cards' | 'bots' | string;
  catLabel: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  metrics: string;
  timeTag: string;
  priceTag: string;
  accent: string;
  deliverables: string[];
}

export interface PricingCard {
  id: string;
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  isHit: boolean;
  waMsg: string;
}

export interface WebOption {
  id: string;
  label: string;
  price: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
}

export interface WhyCard {
  num: string;
  title: string;
  desc: string;
  accent: 'lime' | 'pink' | 'blue';
}

export interface Sticker {
  id: string;
  text: string;
  color: 'lime' | 'pink' | 'blue';
}

export interface TranslationData {
  nav: {
    works: string;
    pricing: string;
    calculator: string;
    process: string;
    faq: string;
    cta: string;
    ctaMsg: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    dragHint: string;
    stickers: Sticker[];
    btnWorks: string;
    btnCalc: string;
    marquee: string;
  };
  why: {
    tag: string;
    title: string;
    subtitle: string;
    cards: WhyCard[];
  };
  portfolio: {
    tag: string;
    title: string;
    filters: Record<string, string>;
    viewCase: string;
    modalDeliverables: string;
    modalOrderSimilar: string;
    items: PortfolioItem[];
  };
  pricing: {
    tag: string;
    title: string;
    subtitle: string;
    hitBadge: string;
    orderBtn: string;
    cards: PricingCard[];
  };
  calculator: {
    tag: string;
    title: string;
    subtitle: string;
    webLabel: string;
    webOptions: WebOption[];
    slidesLabel: string;
    slidesUnit: string;
    discountBadge: string;
    botLabel: string;
    botPrice: string;
    urgentLabel: string;
    urgentPrice: string;
    summaryTitle: string;
    totalLabel: string;
    emptyHint: string;
    sendBtn: string;
    waHeader: string;
    waWeb: string;
    waSlides: string;
    waDiscount: string;
    waBot: string;
    waUrgent: string;
    waTotal: string;
  };
  process: {
    tag: string;
    title: string;
    steps: ProcessStep[];
  };
  faq: {
    tag: string;
    title: string;
    items: FaqItem[];
  };
  footer: {
    ctaTag: string;
    ctaTitle: string;
    ctaSub: string;
    waButton: string;
    rights: string;
  };
}

export type Language = 'ru' | 'kz' | 'en';

// ============================================================================
// MULTI-LANGUAGE DICTIONARY (RU / KZ / EN)
// ============================================================================
const TRANSLATIONS: Record<Language, TranslationData> = {
  ru: {
    nav: {
      works: 'Работы',
      pricing: 'Услуги и Цены',
      calculator: 'Калькулятор',
      process: 'Процесс',
      faq: 'FAQ',
      cta: 'Написать в WhatsApp',
      ctaMsg: 'Привет! Хочу обсудить разработку проекта.',
    },
    hero: {
      badge: 'ПРЯМОЙ ИСПОЛНИТЕЛЬ // БЕЗ АГЕНТСКИХ НАЦЕНОК',
      titleLine1: 'ДЕЛАЮ ДИДЖИТАЛ,',
      titleHighlight: 'КОТОРЫЙ ПРОДАЕТ,',
      titleLine2: 'А НЕ ПРОСТО ВИСИТ В СЕТИ',
      subtitle:
        'Сайты под ключ, продающая инфографика для маркетплейсов (Kaspi / WB / Ozon) и автоматизация заявок по самым честным ценам на рынке.',
      dragHint: '✦ тащи стикеры мышкой / пальцем',
      stickers: [
        { id: 's1', text: 'Сайты от 30 000 ₸', color: 'lime' },
        { id: 's2', text: 'Карточки от 1 500 ₸', color: 'pink' },
        { id: 's3', text: 'Сдача от 1 дня', color: 'blue' },
      ],
      btnWorks: 'Смотреть работы',
      btnCalc: 'Рассчитать стоимость',
      marquee:
        'САЙТЫ ОТ 30 000 ₸ // КАРТОЧКИ KASPI & WB ОТ 1 500 ₸ // АВТОМАТИЗАЦИЯ ПРОДАЖ // БЫСТРЫЙ ЗАПУСК БЕЗ ВОДЫ // ',
    },
    why: {
      tag: 'АНТИ-СТУДИЙНЫЙ МАНИФЕСТ',
      title: 'ПОЧЕМУ БЕЗ КОНСКИХ НАЦЕНОК?',
      subtitle:
        'Вы платите исключительно за твердый результат, чистую инженерию и продуманную коммерческую упаковку.',
      cards: [
        {
          num: '01',
          title: 'Отточенная система и чистый код',
          desc: 'Собственная база проверенных архитектурных решений и кастомных модулей позволяет собирать быстрые проекты за 2–3 дня вместо месяца.',
          accent: 'lime',
        },
        {
          num: '02',
          title: 'Никаких менеджеров и раздутых студий',
          desc: 'Вы не оплачиваете аренду чужого стеклянного офиса и цепочку посредников — работа идет напрямую с разработчиком и дизайнером.',
          accent: 'pink',
        },
        {
          num: '03',
          title: 'Фокус на конверсии и цифрах',
          desc: 'Каждый блок сайта и каждый слайд карточки проектируются под главную задачу — приносить вам реальные заявки, клики и заказы.',
          accent: 'blue',
        },
      ],
    },
    portfolio: {
      tag: 'КЕЙСЫ И РЕЗУЛЬТАТЫ',
      title: 'ПРИМЕРЫ РАБОТ',
      filters: {
        all: 'Все проекты',
        web: 'Сайты',
        cards: 'Карточки товаров',
        bots: 'Автоматизация',
      },
      viewCase: 'Открыть кейс',
      modalDeliverables: 'Что было сделано:',
      modalOrderSimilar: 'Хочу такой же проект в WhatsApp',
      items: [
        {
          id: 'w1',
          category: 'web',
          catLabel: 'Сайт под ключ',
          title: 'Лендинг детейлинг-центра «APEX DETAIL»',
          shortDesc: 'Дерзкий темный лендинг с калькулятором услуг и мгновенной записью в WhatsApp.',
          fullDesc:
            'Разработан высококонверсионный одностраничник для локального детейлинг-бизнеса в Алматы. Внедрен интерактивный выбор пакета полировки и бронирования пленкой с прямой отправкой заявки в мессенджер.',
          metrics: 'Конверсия в заявку 8.4%',
          timeTag: 'Срок: 3 дня',
          priceTag: 'Цена: 35 000 ₸',
          accent: '#CCFF00',
          deliverables: [
            'Проектирование продающей структуры (7 блоков)',
            'Адаптивная верстка под все смартфоны',
            'Калькулятор выбора комплекса услуг',
            'Прямая связка форм с WhatsApp администратора',
          ],
        },
        {
          id: 'c1',
          category: 'cards',
          catLabel: 'Инфографика Kaspi / WB',
          title: 'Селлер-пак из 5 слайдов: Беспроводной пылесос Dyson-style',
          shortDesc: 'Сочная 3D-композиция, разбор мощности всасывания и насадок для ТОП выдачи Kaspi.kz.',
          fullDesc:
            'Проведен анализ 15 конкурентов в первой строчке Kaspi Магазина. Сделан акцент на реальную мощность в Ваттах, комплектацию из 4 насадок и гарантию 1 год на первом главном слайде.',
          metrics: 'CTR в выдаче +45%',
          timeTag: 'Срок: 1 день',
          priceTag: '1 500 ₸ / слайд',
          accent: '#FF3366',
          deliverables: [
            'Кликабельная обложка с высоким контрастом',
            'Слайд со схемой комплектации и размерами',
            'Сравнение с обычными пылесосами',
            'Подготовка под техтребования Kaspi и Wildberries',
          ],
        },
        {
          id: 'w2',
          category: 'web',
          catLabel: 'E-commerce Каталог',
          title: 'Интернет-витрина брендовой одежды «KULT STREET»',
          shortDesc: 'Быстрый онлайн-каталог с корзиной, фильтрами размеров и оформлением заказа за 15 секунд.',
          fullDesc:
            'Полноценная витрина для локального стритвир-бренда. Клиент выбирает размер, складывает худи и кроссовки в корзину и одним нажатием отправляет сформированный чек менеджеру в WhatsApp.',
          metrics: '+62% к среднему чеку',
          timeTag: 'Срок: 4 дня',
          priceTag: 'Цена: 50 000 ₸',
          accent: '#00F0FF',
          deliverables: [
            'Каталог товаров с фильтрацией по категориям',
            'Интерактивная корзина с автоматическим подсчетом',
            'Молниеносная загрузка фотографий (99/100 Speed)',
            'Формирование готового списка покупок в WhatsApp',
          ],
        },
        {
          id: 'c2',
          category: 'cards',
          catLabel: 'Инфографика Wildberries',
          title: 'Серия карточек корейской сыворотки с До/После',
          shortDesc: 'Визуальная воронка из 6 слайдов с разбором состава, текстуры и наглядным эффектом.',
          fullDesc:
            'Для ниши уходовой косметики на WB ключевым триггером стало доверие и разбор активных компонентов (Ниацинамид 10% + Цинк). Создана чистая, эстетичная серия слайдов с макро-текстурой.',
          metrics: 'Рост заказов в 2.3 раза',
          timeTag: 'Срок: 1 день',
          priceTag: '6 500 ₸ / 5 слайдов',
          accent: '#CCFF00',
          deliverables: [
            'Главная карточка с выделением ключевого актива',
            'Наглядная инфографика «До / После 14 дней»',
            'Пошаговая схема нанесения и совместимости',
            'Исходники и готовые JPG/PNG без потери качества',
          ],
        },
        {
          id: 'w3',
          category: 'web',
          catLabel: 'Корпоративный сайт',
          title: 'Платформа логистической компании «TRANS KAZAKHSTAN»',
          shortDesc: 'Строгий корпоративный веб-сайт с расчетом кубатуры грузов из Китая и СНГ.',
          fullDesc:
            'Разработан солидный веб-ресурс для B2B логистического оператора. Встроен модуль предварительного просчета веса и объема карго, блок отслеживания маршрутов и каталог тарифов.',
          metrics: '40+ B2B лидов в месяц',
          timeTag: 'Срок: 5 дней',
          priceTag: 'Цена: 45 000 ₸',
          accent: '#FF3366',
          deliverables: [
            'Многоблочная B2B структура с тарифами',
            'Интерактивный калькулятор доставки по весу/объему',
            'Мультиязычная адаптация (RU / KZ / EN)',
            'Подключение домена .KZ и SSL-сертификата',
          ],
        },
        {
          id: 'c3',
          category: 'bots',
          catLabel: 'Карточки Ozon + Автоворонка',
          title: 'Упаковка Умной Яндекс/Tuya розетки + Бот техподдержки',
          shortDesc: 'Инфографика для Ozon + Telegram/WhatsApp бот для выдачи инструкции и сбора отзывов.',
          fullDesc:
            'Комплексный проект для селлера электроники: разработана серия из 5 продающих карточек для Ozon и настроен умный бот, который по QR-коду из коробки выдает видеоинструкцию по подключению.',
          metrics: 'Рейтинг товара 4.9 ★',
          timeTag: 'Срок: 2 дня',
          priceTag: 'Комплекс: 21 500 ₸',
          accent: '#00F0FF',
          deliverables: [
            '5 слайдов инфографики со схемой умного дома',
            'Настройка чат-бота выдачи инструкций 24/7',
            'Автоматический фильтр негатива и сбор 5★ отзывов',
            'Уведомления о обращениях в личный чат владельца',
          ],
        },
      ],
    },
    pricing: {
      tag: 'ЧЕСТНЫЕ ТАРИФЫ В ТЕНГЕ',
      title: 'ПРАЙС БЕЗ СКРЫТЫХ ПЛАТЕЖЕЙ',
      subtitle: 'Фиксируем стоимость на старте. Никаких внезапных доплат в процессе.',
      hitBadge: 'ХИТ ПРОДАЖ ДЛЯ СЕЛЛЕРОВ',
      orderBtn: 'Заказать в WhatsApp',
      cards: [
        {
          id: 'p1',
          name: 'Карточка товара (Инфографика)',
          price: '1 500 ₸',
          unit: '/ слайд',
          desc: 'Идеально для точечного обновления обложки или теста нового товара на маркетплейсе.',
          features: [
            'Анализ конкурентов в выдаче',
            'Сочный визуал для Kaspi / WB / Ozon',
            'Сильные смысловые триггеры',
            'Цветокоррекция и обтравка фото',
            'Правки включены до утверждения',
          ],
          isHit: false,
          waMsg: 'Привет! Хочу заказать инфографику для карточки товара (по 1 500 ₸ / слайд).',
        },
        {
          id: 'p2',
          name: 'Селлер-Пак (Под ключ)',
          price: '6 500 ₸',
          unit: 'за 5 слайдов',
          desc: 'Полная воронка продаж внутри карточки товара. Выгода 1 000 ₸ на каждом комплекте!',
          features: [
            'Кликабельная обложка с высоким CTR',
            '4 слайда преимуществ, размеров и деталей',
            'Проработка сценария удержания внимания',
            'Адаптация под размеры Kaspi и WB',
            'Сдача готового пака за 24 часа',
          ],
          isHit: true,
          waMsg: 'Привет! Хочу заказать ХИТ «Селлер-Пак» (5 слайдов за 6 500 ₸).',
        },
        {
          id: 'p3',
          name: 'Сайт под ключ (Лендинг / Визитка)',
          price: 'от 30 000 ₸',
          unit: 'за проект',
          desc: 'Быстрый современный сайт, созданный чтобы превращать трафик из рекламы в звонки и заявки.',
          features: [
            'Уникальный дерзкий или строгий дизайн',
            'Идеальная мобильная адаптация',
            'Мгновенная загрузка без тормозов',
            'Привязка заявок к WhatsApp / Telegram',
            'Помощь с покупкой и привязкой домена',
          ],
          isHit: false,
          waMsg: 'Привет! Интересует разработка Сайта под ключ (от 30 000 ₸).',
        },
        {
          id: 'p4',
          name: 'Автоматизация и Боты для бизнеса',
          price: 'от 15 000 ₸',
          unit: 'под ключ',
          desc: 'Освободите время от рутинных переписок — бот квалифицирует клиента и примет заявку 24/7.',
          features: [
            'Умные чат-боты для ответов клиентам 24/7',
            'Автоворонки продаж в мессенджерах',
            'Выдача прайсов, каталогов и запись на услуги',
            'Мгновенная пересылка лидов менеджеру',
            'Интеграция заявок в вашу таблицу / CRM',
          ],
          isHit: false,
          waMsg: 'Привет! Хочу обсудить внедрение Чат-бота и автоматизацию (от 15 000 ₸).',
        },
      ],
    },
    calculator: {
      tag: 'ИНТЕРАКТИВНЫЙ КОНФИГУРАТОР',
      title: 'КАЛЬКУЛЯТОР ЗАКАЗА',
      subtitle: 'Соберите нужный пакет услуг и отправьте готовый расчет в WhatsApp в один клик.',
      webLabel: '1. Выберите тип сайта:',
      webOptions: [
        { id: 'none', label: 'Сайт не нужен', price: 0 },
        { id: 'landing', label: 'Лендинг под ключ', price: 30000 },
        { id: 'catalog', label: 'Многостраничник / Каталог', price: 50000 },
      ],
      slidesLabel: '2. Количество слайдов инфографики (Kaspi / WB / Ozon):',
      slidesUnit: 'слайдов по 1 500 ₸',
      discountBadge: '🔥 СКИДКА 10% НА ОБЪЕМ (10+ СЛАЙДОВ)',
      botLabel: '3. Подключить чат-бота / автоматизацию заявок',
      botPrice: '+15 000 ₸',
      urgentLabel: '4. Срочный запуск за 24 часа (приоритет в очереди)',
      urgentPrice: '+20% к смете',
      summaryTitle: 'ВАША СМЕТА ПРОЕКТА',
      totalLabel: 'ИТОГО К ОПЛАТЕ:',
      emptyHint: 'Выберите хотя бы одну услугу слева для расчета',
      sendBtn: 'Отправить расчет в WhatsApp',
      waHeader: 'Привет! Я собрал заказ в калькуляторе на сайте:',
      waWeb: '• Сайт:',
      waSlides: '• Карточки товаров:',
      waDiscount: '(со скидкой 10%)',
      waBot: '• Чат-бот и автоматизация: Да (+15 000 ₸)',
      waUrgent: '• Срочный запуск за 24ч: Да (+20%)',
      waTotal: 'ИТОГОВАЯ СУММА:',
    },
    process: {
      tag: 'ПРОЗРАЧНЫЙ ВОРКФЛОУ',
      title: 'ЭТАПЫ РАБОТЫ — 4 ПРОСТЫХ ШАГА',
      steps: [
        {
          num: '01',
          title: 'Пишете в WhatsApp',
          desc: 'Обсуждаем задачу голосом или текстом за 10 минут без скучных брифов на 20 страниц.',
        },
        {
          num: '02',
          title: 'Прототип и структура',
          desc: 'Утверждаем концепт, ключевые продающие смыслы и визуальный стиль проекта.',
        },
        {
          num: '03',
          title: 'Разработка и дизайн',
          desc: 'Собираю проект, верстаю сайт или рендерю карточки и докручиваю каждую деталь.',
        },
        {
          num: '04',
          title: 'Запуск и передача',
          desc: 'Передаю все доступы, исходники, подключаю заявки и запускаем ваш трафик.',
        },
      ],
    },
    faq: {
      tag: 'ОТВЕТЫ НА ВОПРОСЫ',
      title: 'ЧАСТЫЕ ВОПРОСЫ',
      items: [
        {
          q: 'Почему сайт стоит всего от 30 000 ₸, в чем подвох?',
          a: 'Никакого подвоха нет. В классических веб-студиях до 70% вашего чека уходит на аренду офиса, зарплату проджект-менеджеров, арт-директора и налоги раздутого штата. Вы работаете со мной напрямую без посредников, а благодаря собственной базе проверенных кодовых наработок я собираю сайты в 4 раза быстрее без потери качества.',
        },
        {
          q: 'Что нужно от меня, чтобы заказать карточку для Kaspi или WB?',
          a: 'Достаточно прислать фотографии товара (даже снятые на телефон при хорошем свете) или ссылку на товар у поставщика, плюс кратко перечислить главные характеристики. Анализ конкурентов и продающий текст для слайдов я беру на себя.',
        },
        {
          q: 'Сколько времени занимает разработка сайта и карточек?',
          a: 'Карточки товаров (пак из 5 слайдов) сдаются в течение 1 дня (24 часов). Разработка лендинга под ключ занимает от 2 до 3 дней, а интернет-каталога — до 5 дней.',
        },
        {
          q: 'Как происходит оплата и сколько правок включено?',
          a: 'Работа строится максимально безопасно: 50% предоплата перед стартом и 50% после того, как вы увидите и утвердите готовый результат. Два круга комплексных правок уже включены в стоимость каждого тарифа.',
        },
      ],
    },
    footer: {
      ctaTag: 'ХВАТИТ ТЕРЯТЬ КЛИЕНТОВ',
      ctaTitle: 'ГОТОВЫ УПАКОВАТЬ ВАШ ПРОДУКТ?',
      ctaSub: 'Напишите прямо сейчас — отвечу за 5 минут и предложу лучшее решение под ваш бюджет.',
      waButton: 'Написать в WhatsApp сейчас',
      rights: '© 2025 KAZ.DIGITAL. Честный диджитал без воды.',
    },
  },

  // ==========================================================================
  // KAZAKH TRANSLATION (KZ)
  // ==========================================================================
  kz: {
    nav: {
      works: 'Жұмыстар',
      pricing: 'Қызметтер мен Баға',
      calculator: 'Калькулятор',
      process: 'Кезеңдер',
      faq: 'Сұрақтар',
      cta: 'WhatsApp-қа жазу',
      ctaMsg: 'Сәлеметсіз бе! Жоба жасату бойынша ақылдасқым келеді.',
    },
    hero: {
      badge: 'ТІКЕЛЕЙ ОРЫНДАУШЫ // АГЕНТТІК ҮСТЕМЕСІЗ',
      titleLine1: 'ЖӘЙ ТҰРАТЫН ЕМЕС,',
      titleHighlight: 'НАҚТЫ САТАТЫН',
      titleLine2: 'ДИДЖИТАЛ ЖАСАЙМЫН',
      subtitle:
        'Толықтай дайын сайттар, Kaspi / WB / Ozon маркетплейстеріне арналған сатылымды инфографика және бизнесті автоматтандыру нарықтағы ең әділ бағамен.',
      dragHint: '✦ стикерлерді жылжытып көріңіз',
      stickers: [
        { id: 's1', text: 'Сайттар 30 000 ₸ бастап', color: 'lime' },
        { id: 's2', text: 'Карточкалар 1 500 ₸ бастап', color: 'pink' },
        { id: 's3', text: '1 күнде тапсыру', color: 'blue' },
      ],
      btnWorks: 'Жұмыстарды көру',
      btnCalc: 'Бағасын есептеу',
      marquee:
        'САЙТТАР 30 000 ₸ БАСТАП // KASPI ЖӘНЕ WB КАРТОЧКАЛАРЫ 1 500 ₸ // САТЫЛЫМДЫ АВТОМАТТАНДЫРУ // ЖЫЛДАМ ІСКЕ ҚОСУ // ',
    },
    why: {
      tag: 'АНТИ-СТУДИЯЛЫҚ МАНИФЕСТ',
      title: 'НЕГЕ БАҒАМЫЗ АРТЫҚ ҮСТЕМЕСІЗ?',
      subtitle:
        'Сіз тек нақты нәтижеге, таза кодқа және сатылым әкелетін сапалы дизайнға ғана төлейсіз.',
      cards: [
        {
          num: '01',
          title: 'Жүйелі архитектура және таза код',
          desc: 'Дайын әрі тексерілген кодтық шешімдер базасы жобаларды бір айдың орнына 2–3 күнде жоғары сапада жинауға мүмкіндік береді.',
          accent: 'lime',
        },
        {
          num: '02',
          title: 'Менеджерлер мен делдалдар жоқ',
          desc: 'Сіз өзгенің кеңсесінің жалдау ақысын және делдалдар тізбегін төлемейсіз — жұмыс тікелей орындаушымен жүреді.',
          accent: 'pink',
        },
        {
          num: '03',
          title: 'Конверсия мен табысқа фокус',
          desc: 'Сайттың әр блогы мен карточканың әр слайды басты мақсатқа — сізге нақты тапсырыстар мен өтінімдер әкелуге бағытталған.',
          accent: 'blue',
        },
      ],
    },
    portfolio: {
      tag: 'КЕЙСТЕР МЕН НӘТИЖЕЛЕР',
      title: 'ЖҰМЫС ҮЛГІЛЕРІ',
      filters: {
        all: 'Барлығы',
        web: 'Сайттар',
        cards: 'Тауар карточкалары',
        bots: 'Автоматтандыру',
      },
      viewCase: 'Кейсті ашу',
      modalDeliverables: 'Атқарылған жұмыстар:',
      modalOrderSimilar: 'WhatsApp арқылы осындай жобаға тапсырыс беру',
      items: [
        {
          id: 'w1',
          category: 'web',
          catLabel: 'Кілтпен тапсырылатын сайт',
          title: '«APEX DETAIL» детейлинг орталығының лендингі',
          shortDesc: 'Қызмет құнын есептегіші және WhatsApp-қа тікелей жазылуы бар заманауи лендинг.',
          fullDesc:
            'Алматыдағы детейлинг орталығына арналған жоғары конверсиялы сайт. Клиенттер пленкамен қаптау немесе полировка пакетін таңдап, бір батырмамен WhatsApp-қа өтінім жібереді.',
          metrics: 'Конверсия 8.4%',
          timeTag: 'Мерзімі: 3 күн',
          priceTag: 'Бағасы: 35 000 ₸',
          accent: '#CCFF00',
          deliverables: [
            'Сатылымды құрылымды жобалау (7 блок)',
            'Барлық смартфондарға бейімделген верстка',
            'Қызметтер кешенін таңдау калькуляторы',
            'Өтінімдерді тікелей WhatsApp-қа байланыстыру',
          ],
        },
        {
          id: 'c1',
          category: 'cards',
          catLabel: 'Kaspi / WB Инфографикасы',
          title: '5 слайдтан тұратын Селлер-пак: Сымсыз шаңсорғыш',
          shortDesc: 'Kaspi.kz ТОП тізіміне шығуға арналған жарқын 3D-композиция және сипаттамалар.',
          fullDesc:
            'Kaspi Дүкеніндегі алғашқы 15 бәсекелеске талдау жасалды. Бірінші слайдта нақты қуаттылық, 4 қондырма жиынтығы және 1 жылдық кепілдік айқын көрсетілді.',
          metrics: 'CTR +45% өсті',
          timeTag: 'Мерзімі: 1 күн',
          priceTag: '1 500 ₸ / слайд',
          accent: '#FF3366',
          deliverables: [
            'Назар аудартатын жоғары контрастты мұқаба',
            'Жиынтық пен өлшемдер көрсетілген слайд',
            'Кәдімгі шаңсорғыштармен салыстыру кестесі',
            'Kaspi және Wildberries талаптарына толық сәйкестік',
          ],
        },
        {
          id: 'w2',
          category: 'web',
          catLabel: 'E-commerce Каталог',
          title: '«KULT STREET» киім брендінің интернет-дүкені',
          shortDesc: 'Себеті, өлшем сүзгілері және 15 секундта тапсырыс беру мүмкіндігі бар каталог.',
          fullDesc:
            'Жергілікті киім брендіне арналған онлайн-витрина. Сатып алушы өлшемді таңдап, тауарларды себетке салады және дайын тізімді WhatsApp-тағы менеджерге жібереді.',
          metrics: 'Орташа чек +62%',
          timeTag: 'Мерзімі: 4 күн',
          priceTag: 'Бағасы: 50 000 ₸',
          accent: '#00F0FF',
          deliverables: [
            'Санаттар бойынша сүзгісі бар тауар каталогы',
            'Автоматты есептейтін интерактивті себет',
            'Фотосуреттердің лезде жүктелуі (99/100 Speed)',
            'WhatsApp-қа дайын чек тізімін қалыптастыру',
          ],
        },
        {
          id: 'c2',
          category: 'cards',
          catLabel: 'Wildberries Инфографикасы',
          title: 'Кореялық сарысуға арналған Дейін/Кейін карточкалар топтамасы',
          shortDesc: 'Құрамы, текстурасы және нақты нәтижесі көрсетілген 6 слайдтық визуалды воронка.',
          fullDesc:
            'WB-дегі косметика саласында басты триггер — сенім мен белсенді компоненттерді (Ниацинамид 10% + Мырыш) көрсету. Эстетикалық таза слайдтар сериясы жасалды.',
          metrics: 'Тапсырыс 2.3 есе өсті',
          timeTag: 'Мерзімі: 1 күн',
          priceTag: '6 500 ₸ / 5 слайд',
          accent: '#CCFF00',
          deliverables: [
            'Негізгі компоненті ерекшеленген басқы слайд',
            '«14 күнге дейін / кейін» көрнекі инфографикасы',
            'Қолдану тәсілінің қадамдық сызбасы',
            'Сапасы жоғалмаған дайын JPG/PNG файлдар',
          ],
        },
        {
          id: 'w3',
          category: 'web',
          catLabel: 'Корпоративтік сайт',
          title: '«TRANS KAZAKHSTAN» логистикалық компаниясының платформасы',
          shortDesc: 'Қытай мен ТМД елдерінен жүк көлемін есептейтін корпоративтік веб-сайт.',
          fullDesc:
            'B2B логистикалық операторға арналған салмақты веб-ресурс. Жүктің салмағы мен көлемін алдын ала есептеу модулі және тарифтер каталогы енгізілді.',
          metrics: 'Айына 40+ B2B лид',
          timeTag: 'Мерзімі: 5 күн',
          priceTag: 'Бағасы: 45 000 ₸',
          accent: '#FF3366',
          deliverables: [
            'Тарифтері бар көпблокты B2B құрылым',
            'Салмақ пен көлем бойынша жеткізу калькуляторы',
            'Үш тілді бейімдеу (RU / KZ / EN)',
            '.KZ домені мен SSL-сертификатын қосу',
          ],
        },
        {
          id: 'c3',
          category: 'bots',
          catLabel: 'Ozon Карточкалары + Автоворонка',
          title: 'Ақылды розетка қаптамасы + Техникалық қолдау боты',
          shortDesc: 'Ozon-ға арналған инфографика + нұсқаулық беретін және пікір жинайтын бот.',
          fullDesc:
            'Электроника сатушысына арналған кешенді жоба: Ozon үшін 5 сатылымды карточка жасалды және қораптағы QR-код арқылы видео-нұсқаулық беретін чат-бот бапталды.',
          metrics: 'Тауар рейтингі 4.9 ★',
          timeTag: 'Мерзімі: 2 күн',
          priceTag: 'Кешен: 21 500 ₸',
          accent: '#00F0FF',
          deliverables: [
            'Ақылды үй сызбасы бар 5 инфографика слайды',
            '24/7 нұсқаулық беретін чат-ботты баптау',
            '5★ пікірлерді жинау сценарийі',
            'Иесінің жеке чатына хабарламаларды жіберу',
          ],
        },
      ],
    },
    pricing: {
      tag: 'ТЕҢГЕМЕН БЕКІТІЛГЕН АШЫҚ БАҒАЛАР',
      title: 'ЖАСЫРЫН ТӨЛЕМСІЗ ТАРИФТЕР',
      subtitle: 'Бағаны басында бекітеміз. Жұмыс барысында ешқандай қосымша төлем болмайды.',
      hitBadge: 'СЕЛЛЕРЛЕР ҮШІН ХИТ',
      orderBtn: 'WhatsApp-та тапсырыс беру',
      cards: [
        {
          id: 'p1',
          name: 'Тауар карточкасы (Инфографика)',
          price: '1 500 ₸',
          unit: '/ слайд',
          desc: 'Мұқабаны жаңартуға немесе жаңа тауарды маркетплейсте тестілеуге таптырмас шешім.',
          features: [
            'Бәсекелестерді талдау',
            'Kaspi / WB / Ozon-ға арналған жарқын дизайн',
            'Сатылымды арттыратын триггерлер',
            'Фотоны өңдеу және фоннан қию',
            'Түзетулер бағаға кіреді',
          ],
          isHit: false,
          waMsg: 'Сәлеметсіз бе! Тауар карточкасына инфографика (1 500 ₸ / слайд) жасатқым келеді.',
        },
        {
          id: 'p2',
          name: 'Селлер-Пак (Кілтпен)',
          price: '6 500 ₸',
          unit: '5 слайдқа',
          desc: 'Тауар карточкасының ішіндегі толық сатылым воронкасы. Әр жиынтықтан 1 000 ₸ үнемдейсіз!',
          features: [
            'Жоғары CTR беретін басты мұқаба',
            'Артықшылықтар мен өлшемдер көрсетілген 4 слайд',
            'Клиент назарын ұстап тұру сценарийі',
            'Kaspi және WB өлшемдеріне бейімдеу',
            'Дайын пакті 24 сағатта тапсыру',
          ],
          isHit: true,
          waMsg: 'Сәлеметсіз бе! ХИТ «Селлер-Пак» (5 слайд 6 500 ₸) пакетіне тапсырыс бергім келеді.',
        },
        {
          id: 'p3',
          name: 'Толықтай дайын сайт (Лендинг)',
          price: '30 000 ₸ бастап',
          unit: 'жобаға',
          desc: 'Жарнамадан келген трафикті қоңырау мен тапсырысқа айналдыратын жылдам заманауи сайт.',
          features: [
            'Бірегей стильді дизайн',
            'Мобильді телефондарға 100% бейімделген',
            'Жоғары жылдамдықпен ашылу',
            'Өтінімдерді WhatsApp / Telegram-ға қосу',
            'Домен сатып алуға және қосуға көмек',
          ],
          isHit: false,
          waMsg: 'Сәлеметсіз бе! Кілтпен тапсырылатын сайт (30 000 ₸ бастап) жасату қызықтырады.',
        },
        {
          id: 'p4',
          name: 'Бизнесті автоматтандыру және Боттар',
          price: '15 000 ₸ бастап',
          unit: 'кілтпен',
          desc: 'Күнделікті хат алмасудан уақыт үнемдеңіз — бот клиентке жауап беріп, тапсырысты 24/7 қабылдайды.',
          features: [
            'Клиенттерге 24/7 жауап беретін ақылды боттар',
            'Мессенджерлердегі автоворонкалар',
            'Прайс, каталог беру және қызметке жазу',
            'Дайын лидтерді менеджерге лезде жіберу',
            'Өтінімдерді кестеге / CRM-ге біріктіру',
          ],
          isHit: false,
          waMsg: 'Сәлеметсіз бе! Чат-бот пен автоматтандыруды (15 000 ₸ бастап) енгізуді талқылағым келеді.',
        },
      ],
    },
    calculator: {
      tag: 'ИНТЕРАКТИВТІ КОНФИГУРАТОР',
      title: 'ТАПСЫРЫС КАЛЬКУЛЯТОРЫ',
      subtitle: 'Қажетті қызметтерді таңдап, дайын есепті бір батырмамен WhatsApp-қа жіберіңіз.',
      webLabel: '1. Сайт түрін таңдаңыз:',
      webOptions: [
        { id: 'none', label: 'Сайт қажет емес', price: 0 },
        { id: 'landing', label: 'Толықтай дайын Лендинг', price: 30000 },
        { id: 'catalog', label: 'Көпбеттік сайт / Каталог', price: 50000 },
      ],
      slidesLabel: '2. Инфографика слайдтарының саны (Kaspi / WB / Ozon):',
      slidesUnit: 'слайд (1 500 ₸ / дана)',
      discountBadge: '🔥 10% ЖЕҢІЛДІК ІСКЕ ҚОСЫЛДЫ (10+ СЛАЙД)',
      botLabel: '3. Чат-бот / өтінімдерді автоматтандыруды қосу',
      botPrice: '+15 000 ₸',
      urgentLabel: '4. 24 сағат ішінде жедел орындау (кезектен тыс)',
      urgentPrice: '+20% сметаға',
      summaryTitle: 'ЖОБАНЫҢ ЕСЕПТІК ҚҰНЫ',
      totalLabel: 'ЖАЛПЫ СОМАСЫ:',
      emptyHint: 'Есептеу үшін сол жақтан кемінде бір қызметті таңдаңыз',
      sendBtn: 'Есепті WhatsApp-қа жіберу',
      waHeader: 'Сәлеметсіз бе! Мен сайттағы калькулятордан тапсырыс жинадым:',
      waWeb: '• Сайт:',
      waSlides: '• Тауар карточкалары:',
      waDiscount: '(10% жеңілдікпен)',
      waBot: '• Чат-бот және автоматтандыру: Иә (+15 000 ₸)',
      waUrgent: '• 24 сағатта жедел іске қосу: Иә (+20%)',
      waTotal: 'ҚОРЫТЫНДЫ СОМА:',
    },
    process: {
      tag: 'АШЫҚ ЖҰМЫС БАРЫСЫ',
      title: 'ЖҰМЫС КЕЗЕҢДЕРІ — 4 ҚАРАПАЙЫМ ҚАДАМ',
      steps: [
        {
          num: '01',
          title: 'WhatsApp-қа жазасыз',
          desc: 'Ұзын-сонар сауалнамасыз 10 минут ішінде тапсырманы талқылаймыз.',
        },
        {
          num: '02',
          title: 'Прототип және құрылым',
          desc: 'Жобаның концепциясын, сатылым триггерлерін және визуалды стилін бекітеміз.',
        },
        {
          num: '03',
          title: 'Әзірлеу және дизайн',
          desc: 'Сайтты версткалаймын немесе карточкаларды дайындап, әр бөлшегін жетілдіремін.',
        },
        {
          num: '04',
          title: 'Іске қосу және тапсыру',
          desc: 'Барлық рұқсаттар мен бастапқы файлдарды тапсырып, трафикті іске қосамыз.',
        },
      ],
    },
    faq: {
      tag: 'СҰРАҚТАР МЕН ЖАУАПТАР',
      title: 'ЖИІ ҚОЙЫЛАТЫН СҰРАҚТАР',
      items: [
        {
          q: 'Неліктен сайт бағасы небәрі 30 000 ₸ басталады, құпиясы неде?',
          a: 'Ешқандай құпия жоқ. Әдеттегі веб-студияларда төлемнің 70%-ы кеңсе жалдауға, менеджерлердің жалақысына кетеді. Сіз менімен делдалсыз тікелей жұмыс істейсіз, ал дайын архитектуралық базамның арқасында сайттарды сапасын жоғалтпай 4 есе жылдам жинаймын.',
        },
        {
          q: 'Kaspi немесе WB-ге карточкаға тапсырыс беру үшін менен не керек?',
          a: 'Тауардың фотосуреттерін (тіпті жарық жерде телефонға түсірілген болса да) немесе жеткізушідегі сілтемесін және негізгі сипаттамаларын жіберсеңіз жеткілікті.',
        },
        {
          q: 'Сайт пен карточкаларды жасау қанша уақыт алады?',
          a: 'Тауар карточкалары (5 слайд) 1 күн ішінде дайын болады. Лендинг әзірлеу 2–3 күнді, ал интернет-каталог 5 күнге дейін уақыт алады.',
        },
        {
          q: 'Төлем қалай жүргізіледі және қанша түзету кіреді?',
          a: 'Жұмыс барынша қауіпсіз: бастамас бұрын 50% алдын ала төлем және дайын нәтижені көріп бекіткен соң қалған 50% төленеді. Түзетулердің екі толық кезеңі бағаға кіреді.',
        },
      ],
    },
    footer: {
      ctaTag: 'КЛИЕНТТЕРДІ ЖОҒАЛТУДЫ ТОҚТАТЫҢЫЗ',
      ctaTitle: 'ӨНІМІҢІЗДІ ҚАПТАУҒА ДАЙЫНСЫЗ БА?',
      ctaSub: 'Дәл қазір жазыңыз — 5 минутта жауап беріп, бюджетіңізге сай ең тиімді шешімді ұсынамын.',
      waButton: 'WhatsApp-қа қазір жазу',
      rights: '© 2025 KAZ.DIGITAL. Артық сөзсіз адал диджитал.',
    },
  },

  // ==========================================================================
  // ENGLISH TRANSLATION (EN)
  // ==========================================================================
  en: {
    nav: {
      works: 'Works',
      pricing: 'Pricing',
      calculator: 'Calculator',
      process: 'Process',
      faq: 'FAQ',
      cta: 'Chat on WhatsApp',
      ctaMsg: 'Hi! I would like to discuss a digital project.',
    },
    hero: {
      badge: 'DIRECT CREATOR // ZERO AGENCY BLOAT',
      titleLine1: 'I BUILD DIGITAL',
      titleHighlight: 'THAT ACTUALLY SELLS,',
      titleLine2: 'NOT JUST SITS ONLINE',
      subtitle:
        'Turnkey websites, high-converting marketplace infographics (Kaspi / WB / Ozon), and custom business automation at the most honest rates on the market.',
      dragHint: '✦ grab & drag the stickers around',
      stickers: [
        { id: 's1', text: 'Websites from 30,000 ₸', color: 'lime' },
        { id: 's2', text: 'Product Cards 1,500 ₸', color: 'pink' },
        { id: 's3', text: 'Delivery from 1 Day', color: 'blue' },
      ],
      btnWorks: 'Explore Portfolio',
      btnCalc: 'Calculate Cost',
      marquee:
        'WEBSITES FROM 30,000 ₸ // KASPI & WB CARDS FROM 1,500 ₸ // SALES AUTOMATION // FAST TURNKEY LAUNCH // ',
    },
    why: {
      tag: 'ANTI-AGENCY MANIFESTO',
      title: 'WHY ZERO INFLATED MARKUPS?',
      subtitle:
        'You pay strictly for tangible commercial output, clean engineering, and conversion-focused packaging.',
      cards: [
        {
          num: '01',
          title: 'Streamlined Engineering & Clean Code',
          desc: 'A proprietary library of battle-tested architectural components allows assembling rock-solid projects in 2–3 days instead of a month.',
          accent: 'lime',
        },
        {
          num: '02',
          title: 'Zero Middlemen or Bloated Studios',
          desc: 'You never pay for someone else’s downtown office rent or account managers — you work directly one-on-one with the builder.',
          accent: 'pink',
        },
        {
          num: '03',
          title: 'Relentless Focus on Conversion',
          desc: 'Every website section and every marketplace slide is engineered around one metric — generating real leads, clicks, and orders.',
          accent: 'blue',
        },
      ],
    },
    portfolio: {
      tag: 'SELECTED CASE STUDIES',
      title: 'RECENT WORKS',
      filters: {
        all: 'All Works',
        web: 'Websites',
        cards: 'Marketplace Cards',
        bots: 'Automation',
      },
      viewCase: 'Inspect Case',
      modalDeliverables: 'Key Deliverables:',
      modalOrderSimilar: 'Order Similar Project via WhatsApp',
      items: [
        {
          id: 'w1',
          category: 'web',
          catLabel: 'Turnkey Website',
          title: 'Landing Page for "APEX DETAIL" Auto Studio',
          shortDesc: 'Bold dark-mode landing page with an interactive service package picker and WhatsApp booking.',
          fullDesc:
            'Built a high-converting single-page platform for an automotive detailing studio in Almaty. Features an interactive ceramic coating & PPF calculator that sends pre-filled bookings straight to WhatsApp.',
          metrics: '8.4% Lead Conversion',
          timeTag: 'Time: 3 Days',
          priceTag: 'Cost: 35,000 ₸',
          accent: '#CCFF00',
          deliverables: [
            'Conversion-focused 7-section architecture',
            'Mobile-first responsive layout',
            'Interactive detailing package estimator',
            'Direct WhatsApp booking integration',
          ],
        },
        {
          id: 'c1',
          category: 'cards',
          catLabel: 'Kaspi / WB Infographics',
          title: '5-Slide Seller Pack: Cordless Vacuum Cleaner',
          shortDesc: 'High-contrast 3D visual breakdown of suction power and attachments for Kaspi.kz TOP ranking.',
          fullDesc:
            'Analyzed top 15 competitors on Kaspi Marketplace. Emphasized wattage specs, 4 included nozzles, and 1-year warranty badge right on the cover slide to maximize search click-through.',
          metrics: 'Search CTR +45%',
          timeTag: 'Time: 1 Day',
          priceTag: '1,500 ₸ / slide',
          accent: '#FF3366',
          deliverables: [
            'High-contrast click-magnet cover slide',
            'Dimensions & kit contents schematic slide',
            'Competitor comparison breakdown',
            'Exported to exact Kaspi & Wildberries specs',
          ],
        },
        {
          id: 'w2',
          category: 'web',
          catLabel: 'E-commerce Catalog',
          title: 'Online Storefront for "KULT STREET" Apparel',
          shortDesc: 'Fast product catalog with size filtering, cart drawer, and 15-second WhatsApp checkout.',
          fullDesc:
            'Custom web storefront for an independent streetwear label. Shoppers filter sizes, add hoodies and sneakers to their bag, and send a formatted order receipt directly to the sales manager on WhatsApp.',
          metrics: '+62% Average Order Value',
          timeTag: 'Time: 4 Days',
          priceTag: 'Cost: 50,000 ₸',
          accent: '#00F0FF',
          deliverables: [
            'Category & size filterable product grid',
            'Live shopping cart with automatic KZT total',
            '99/100 Google PageSpeed optimization',
            'One-click formatted WhatsApp order receipt',
          ],
        },
        {
          id: 'c2',
          category: 'cards',
          catLabel: 'Wildberries Infographics',
          title: 'Korean Skincare Serum Set with Before/After',
          shortDesc: '6-slide visual funnel highlighting active ingredients, macro texture, and proven results.',
          fullDesc:
            'Designed an aesthetic, high-trust infographic funnel for Wildberries beauty category. Focused on Niacinamide 10% + Zinc callouts and clear 14-day before/after comparisons.',
          metrics: '2.3x Order Growth',
          timeTag: 'Time: 1 Day',
          priceTag: '6,500 ₸ / 5 slides',
          accent: '#CCFF00',
          deliverables: [
            'Hero slide spotlighting active ingredients',
            'Before / After 14-day visual proof slide',
            'Step-by-step routine application chart',
            'Lossless PNG/JPG exports ready for upload',
          ],
        },
        {
          id: 'w3',
          category: 'web',
          catLabel: 'Corporate Platform',
          title: 'B2B Portal for "TRANS KAZAKHSTAN" Logistics',
          shortDesc: 'Authoritative corporate web platform featuring a cargo volume & weight rate estimator.',
          fullDesc:
            'Engineered a clean B2B web presence for an international freight operator. Includes an interactive cargo CBM/weight calculator, transit route maps, and tariff tables.',
          metrics: '40+ B2B Leads / Month',
          timeTag: 'Time: 5 Days',
          priceTag: 'Cost: 45,000 ₸',
          accent: '#FF3366',
          deliverables: [
            'Multi-section B2B corporate structure',
            'Interactive freight weight & volume calculator',
            'Tri-lingual interface (RU / KZ / EN)',
            '.KZ domain setup & SSL security',
          ],
        },
        {
          id: 'c3',
          category: 'bots',
          catLabel: 'Ozon Cards + Chatbot Funnel',
          title: 'Smart Wi-Fi Plug Packaging + 24/7 Support Bot',
          shortDesc: 'Ozon infographic pack paired with an automated Telegram/WhatsApp setup guide bot.',
          fullDesc:
            'End-to-end launch for an electronics seller: created a 5-slide Ozon visual funnel plus an automated chatbot triggered via box QR code that delivers video setup guides and collects 5-star reviews.',
          metrics: '4.9 ★ Product Rating',
          timeTag: 'Time: 2 Days',
          priceTag: 'Bundle: 21,500 ₸',
          accent: '#00F0FF',
          deliverables: [
            '5 Ozon infographic slides with smart-home diagram',
            '24/7 automated setup guide chatbot',
            'Automated customer support & 5★ review funnel',
            'Instant owner alerts for support tickets',
          ],
        },
      ],
    },
    pricing: {
      tag: 'TRANSPARENT RATES IN KZT',
      title: 'PRICING WITHOUT HIDDEN FEES',
      subtitle: 'Locked-in upfront pricing. Zero surprise add-ons mid-project.',
      hitBadge: 'BESTSELLER FOR SELLERS',
      orderBtn: 'Order on WhatsApp',
      cards: [
        {
          id: 'p1',
          name: 'Product Card (Infographic)',
          price: '1,500 ₸',
          unit: '/ slide',
          desc: 'Ideal for refreshing a main cover image or testing a new SKU on Kaspi, WB, or Ozon.',
          features: [
            'Marketplace competitor analysis',
            'High-contrast visual for Kaspi / WB / Ozon',
            'Conversion-driven copywriting triggers',
            'Photo retouching & background removal',
            'Revisions included until approved',
          ],
          isHit: false,
          waMsg: 'Hi! I want to order Marketplace Product Cards (1,500 ₸ / slide).',
        },
        {
          id: 'p2',
          name: 'Seller Pack (Turnkey)',
          price: '6,500 ₸',
          unit: 'for 5 slides',
          desc: 'Complete visual sales funnel inside your product listing. Save 1,000 ₸ on every bundle!',
          features: [
            'High-CTR main cover slide',
            '4 slides of benefits, specs & dimensions',
            'Visual storytelling flow that converts',
            'Formatted for Kaspi & WB dimensions',
            '24-hour turnkey delivery',
          ],
          isHit: true,
          waMsg: 'Hi! I want to order the BESTSELLER "Seller Pack" (5 slides for 6,500 ₸).',
        },
        {
          id: 'p3',
          name: 'Turnkey Website (Landing Page)',
          price: 'from 30,000 ₸',
          unit: 'per project',
          desc: 'Fast, custom-coded website engineered to turn ad traffic into direct WhatsApp inquiries.',
          features: [
            'Custom Neo-Brutalist or clean corporate UI',
            'Flawless mobile responsiveness',
            'Instant load speed optimization',
            'Direct WhatsApp / Telegram lead routing',
            'Domain & hosting setup assistance',
          ],
          isHit: false,
          waMsg: 'Hi! I am interested in a Turnkey Website (from 30,000 ₸).',
        },
        {
          id: 'p4',
          name: 'Business Automation & Chatbots',
          price: 'from 15,000 ₸',
          unit: 'turnkey',
          desc: 'Eliminate repetitive manual replies — custom bots qualify leads and capture orders 24/7.',
          features: [
            'Smart 24/7 customer response bots',
            'Automated messenger sales funnels',
            'Instant price list & catalog delivery',
            'Real-time lead forwarding to your phone',
            'Google Sheets / CRM order integration',
          ],
          isHit: false,
          waMsg: 'Hi! I want to discuss Business Automation & Custom Chatbots (from 15,000 ₸).',
        },
      ],
    },
    calculator: {
      tag: 'INTERACTIVE BUNDLE BUILDER',
      title: 'PROJECT COST CALCULATOR',
      subtitle: 'Configure your custom package and send the exact estimate to WhatsApp in one tap.',
      webLabel: '1. Select Website Type:',
      webOptions: [
        { id: 'none', label: 'No Website Needed', price: 0 },
        { id: 'landing', label: 'Turnkey Landing Page', price: 30000 },
        { id: 'catalog', label: 'Multi-Page / Catalog Site', price: 50000 },
      ],
      slidesLabel: '2. Marketplace Infographic Slides (Kaspi / WB / Ozon):',
      slidesUnit: 'slides @ 1,500 ₸ each',
      discountBadge: '🔥 10% BULK DISCOUNT APPLIED (10+ SLIDES)',
      botLabel: '3. Add Custom Business Chatbot / Lead Automation',
      botPrice: '+15,000 ₸',
      urgentLabel: '4. Urgent 24-Hour Express Turnaround',
      urgentPrice: '+20% to total',
      summaryTitle: 'YOUR LIVE ESTIMATE',
      totalLabel: 'ESTIMATED TOTAL:',
      emptyHint: 'Select at least one service on the left to calculate',
      sendBtn: 'Send Estimate to WhatsApp',
      waHeader: 'Hi! I configured a custom bundle on your website calculator:',
      waWeb: '• Website:',
      waSlides: '• Product Cards:',
      waDiscount: '(with 10% bulk discount)',
      waBot: '• Chatbot & Automation: Yes (+15,000 ₸)',
      waUrgent: '• Express 24h Delivery: Yes (+20%)',
      waTotal: 'TOTAL ESTIMATE:',
    },
    process: {
      tag: 'NO-NONSENSE WORKFLOW',
      title: 'HOW WE WORK — 4 SIMPLE STEPS',
      steps: [
        {
          num: '01',
          title: 'Message on WhatsApp',
          desc: 'We align on your goals in 10 minutes via voice or text — zero 20-page corporate briefs.',
        },
        {
          num: '02',
          title: 'Structure & Concept',
          desc: 'We lock in the layout prototype, core selling angles, and visual direction.',
        },
        {
          num: '03',
          title: 'Build & Design',
          desc: 'I code the site or design your product cards, refining every visual detail.',
        },
        {
          num: '04',
          title: 'Launch & Handover',
          desc: 'Full handover of source files, credentials, and live lead routing ready for traffic.',
        },
      ],
    },
    faq: {
      tag: 'FREQUENT QUESTIONS',
      title: 'STRAIGHT ANSWERS (FAQ)',
      items: [
        {
          q: 'Why do websites start at just 30,000 ₸? What is the catch?',
          a: 'There is no catch. Traditional agencies spend up to 70% of your invoice on office rent, project managers, and bloated overhead. With me, you work directly with the engineer, and my custom library of proven code modules lets me ship in days instead of months.',
        },
        {
          q: 'What do I need to provide to order Kaspi or Wildberries cards?',
          a: 'Just send photos of your product (even clean smartphone shots work) or a supplier link, plus a short list of key specs. I handle competitor research and sales copywriting.',
        },
        {
          q: 'How long does website and product card production take?',
          a: 'A 5-slide Seller Pack is delivered within 24 hours. A turnkey landing page takes 2–3 days, and an e-commerce catalog takes up to 5 days.',
        },
        {
          q: 'How does payment work and how many revisions are included?',
          a: '50% upfront deposit to start, and 50% upon final approval. Two comprehensive revision rounds are included in every package at no extra charge.',
        },
      ],
    },
    footer: {
      ctaTag: 'STOP LOSING ORDERS TO COMPETITORS',
      ctaTitle: 'READY TO UPGRADE YOUR DIGITAL?',
      ctaSub: 'Drop a message on WhatsApp right now — I reply within 5 minutes with a clear action plan.',
      waButton: 'Start Chat on WhatsApp',
      rights: '© 2025 KAZ.DIGITAL. High-converting digital without agency bloat.',
    },
  },
};

// ============================================================================
// REUSABLE TACTILE NEO-BRUTALIST BUTTON
// ============================================================================
interface BrutalistButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'lime' | 'pink' | 'blue' | 'surface';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isDark?: boolean;
}

const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'lime',
  size = 'md',
  className = '',
  isDark = true,
}) => {
  const shadowColor = isDark ? '#FFFFFF' : '#000000';
  const borderClass = isDark ? 'border-white' : 'border-black';

  const variantClasses = {
    lime: 'bg-[#CCFF00] text-[#0D0D0D]',
    pink: 'bg-[#FF3366] text-white',
    blue: 'bg-[#00F0FF] text-[#0D0D0D]',
    surface: isDark ? 'bg-[#171717] text-white' : 'bg-white text-[#0D0D0D]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs sm:text-sm',
    md: 'px-6 py-3.5 text-sm sm:text-base',
    lg: 'px-8 py-4 text-base sm:text-lg',
  };

  const sharedClasses = `inline-flex items-center justify-center gap-2.5 font-bold uppercase tracking-wider border-[3px] ${borderClass} ${variantClasses[variant]} ${sizeClasses[size]} cursor-pointer select-none ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        whileHover={{
          x: -3,
          y: -3,
          boxShadow: `9px 9px 0px ${shadowColor}`,
        }}
        whileTap={{
          x: 4,
          y: 4,
          boxShadow: `0px 0px 0px ${shadowColor}`,
        }}
        transition={springTransition}
        style={{
          boxShadow: `6px 6px 0px ${shadowColor}`,
        }}
        className={sharedClasses}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        x: -3,
        y: -3,
        boxShadow: `9px 9px 0px ${shadowColor}`,
      }}
      whileTap={{
        x: 4,
        y: 4,
        boxShadow: `0px 0px 0px ${shadowColor}`,
      }}
      transition={springTransition}
      style={{
        boxShadow: `6px 6px 0px ${shadowColor}`,
      }}
      className={sharedClasses}
    >
      {children}
    </motion.button>
  );
};

// ============================================================================
// ANIMATED NUMBER COUNTER FOR CALCULATOR
// ============================================================================
const AnimatedPrice: React.FC<{ value: number }> = ({ value }) => {
  const spring = useSpring(value, { stiffness: 260, damping: 28 });
  const display = useTransform(spring, (current: number) =>
    Math.round(current)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};

// ============================================================================
// CUSTOM SVG MOCKUP GENERATOR FOR PORTFOLIO ITEMS
// ============================================================================
const PortfolioVisualMockup: React.FC<{ item: PortfolioItem; isDark: boolean }> = ({ item }) => {
  if (item.category === 'web') {
    return (
      <div className="w-full h-56 relative overflow-hidden bg-[#111111] border-b-[3px] border-current p-4 flex flex-col justify-between">
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#FF3366] border border-black inline-block" />
            <span className="w-3 h-3 bg-[#CCFF00] border border-black inline-block" />
            <span className="w-3 h-3 bg-[#00F0FF] border border-black inline-block" />
          </div>
          <span className="font-mono-code text-[10px] text-neutral-400 px-2 py-0.5 bg-neutral-900 border border-neutral-700">
            https://{item.id === 'w1' ? 'apex-detail.kz' : item.id === 'w2' ? 'kult-street.kz' : 'trans-cargo.kz'}
          </span>
          <Globe className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        {/* Mock Website Hero Grid */}
        <div className="my-auto py-2 grid grid-cols-12 gap-2 items-center">
          <div className="col-span-7 space-y-2">
            <div
              className="inline-block px-2 py-0.5 text-[10px] font-mono-code font-bold text-black"
              style={{ backgroundColor: item.accent }}
            >
              CONVERSION UI
            </div>
            <div className="h-3.5 w-11/12 bg-white" />
            <div className="h-3.5 w-3/4 bg-neutral-400" />
            <div className="pt-1 flex gap-2">
              <div
                className="h-6 w-20 border border-black"
                style={{ backgroundColor: item.accent }}
              />
              <div className="h-6 w-14 border border-neutral-600 bg-neutral-800" />
            </div>
          </div>
          <div className="col-span-5 h-24 border-2 border-white bg-neutral-900 flex flex-col items-center justify-center p-2 relative">
            <span
              className="font-display text-lg font-black"
              style={{ color: item.accent }}
            >
              99%
            </span>
            <span className="font-mono-code text-[9px] text-neutral-300 uppercase">
              SPEED SCORE
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono-code text-neutral-300">
          <span>RESPONSIVE: 100%</span>
          <span className="text-[#CCFF00] font-bold">{item.metrics}</span>
        </div>
      </div>
    );
  }

  if (item.category === 'cards') {
    return (
      <div className="w-full h-56 relative overflow-hidden bg-[#161616] border-b-[3px] border-current p-4 flex items-center justify-center gap-3">
        {/* Main Marketplace Slide */}
        <div className="w-36 h-44 bg-[#0D0D0D] border-2 border-white p-2.5 flex flex-col justify-between relative shadow-[4px_4px_0px_#FF3366]">
          <div className="flex justify-between items-start">
            <span className="bg-[#FF3366] text-white font-mono-code text-[9px] font-bold px-1.5 py-0.5">
              TOP KASPI / WB
            </span>
            <span className="font-mono-code text-[9px] text-[#CCFF00] font-bold">
              01/05
            </span>
          </div>
          <div className="my-auto border border-dashed border-neutral-600 h-20 flex flex-col items-center justify-center bg-neutral-900/80">
            <Sparkles className="w-6 h-6 text-[#CCFF00] mb-1" />
            <span className="font-display text-[10px] text-white tracking-wider">
              3D PRODUCT
            </span>
          </div>
          <div className="bg-[#CCFF00] text-black font-mono-code text-[10px] font-extrabold text-center py-0.5">
            {item.metrics}
          </div>
        </div>

        {/* Secondary Slide Stack */}
        <div className="hidden sm:flex flex-col gap-2 w-24">
          <div className="h-20 bg-neutral-900 border-2 border-neutral-600 p-2 flex flex-col justify-between">
            <span className="font-mono-code text-[9px] text-[#00F0FF]">
              + ТРИГГЕРЫ
            </span>
            <div className="h-2 w-full bg-neutral-700" />
            <div className="h-2 w-2/3 bg-[#00F0FF]" />
          </div>
          <div className="h-20 bg-neutral-900 border-2 border-neutral-600 p-2 flex flex-col justify-between">
            <span className="font-mono-code text-[9px] text-[#CCFF00]">
              + ИНФОГРАФИКА
            </span>
            <div className="h-2 w-full bg-neutral-700" />
            <div className="h-2 w-4/5 bg-[#CCFF00]" />
          </div>
        </div>
      </div>
    );
  }

  // Automation / Bots visual
  return (
    <div className="w-full h-56 relative overflow-hidden bg-[#121212] border-b-[3px] border-current p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 bg-[#00F0FF] text-black font-mono-code text-[10px] font-bold">
          WHATSAPP / TG FUNNEL 24/7
        </span>
        <Bot className="w-5 h-5 text-[#00F0FF]" />
      </div>

      <div className="space-y-2 my-auto">
        <div className="bg-neutral-800 border border-neutral-600 p-2 text-xs text-neutral-200 max-w-[80%] font-mono-code">
          Клиент: Здравствуйте! Как подключить устройство?
        </div>
        <div className="bg-[#CCFF00] text-black border-2 border-black p-2 text-xs font-bold max-w-[85%] ml-auto font-mono-code shadow-[3px_3px_0px_#FFF]">
          Бот (0.2 сек): Вот видеоинструкция + бонус за отзыв 5★!
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] font-mono-code text-[#00F0FF]">
        <span>АВТООТВЕТ: 24/7</span>
        <span className="font-bold">{item.metrics}</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<PortfolioItem | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Interactive Calculator State
  const [calcWeb, setCalcWeb] = useState<string>('landing');
  const [calcSlides, setCalcSlides] = useState<number>(5);
  const [calcBot, setCalcBot] = useState<boolean>(false);
  const [calcUrgent, setCalcUrgent] = useState<boolean>(false);

  const heroConstraintRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  // Calculate Live Price in KZT (₸)
  const webPriceObj = t.calculator.webOptions.find((o) => o.id === calcWeb);
  const webCost = webPriceObj ? webPriceObj.price : 0;

  const rawSlidesCost = calcSlides * 1500;
  const hasSlideDiscount = calcSlides >= 10;
  const slidesCost = hasSlideDiscount ? Math.round(rawSlidesCost * 0.9) : rawSlidesCost;

  const botCost = calcBot ? 15000 : 0;
  const subtotal = webCost + slidesCost + botCost;
  const totalCost = calcUrgent ? Math.round(subtotal * 1.2) : subtotal;

  // Build Dynamic Calculator WhatsApp Message
  const getCalculatorWhatsAppUrl = () => {
    const lines = [t.calculator.waHeader, ''];
    if (webCost > 0 && webPriceObj) {
      lines.push(`${t.calculator.waWeb} ${webPriceObj.label} (${webCost.toLocaleString()} ₸)`);
    }
    if (calcSlides > 0) {
      lines.push(
        `${t.calculator.waSlides} ${calcSlides} шт. = ${slidesCost.toLocaleString()} ₸ ${
          hasSlideDiscount ? t.calculator.waDiscount : ''
        }`
      );
    }
    if (calcBot) {
      lines.push(t.calculator.waBot);
    }
    if (calcUrgent) {
      lines.push(t.calculator.waUrgent);
    }
    lines.push('');
    lines.push(`${t.calculator.waTotal} ${totalCost.toLocaleString()} ₸`);
    return buildWhatsAppUrl(lines.join('\n'));
  };

  // Filtered Portfolio Items
  const filteredPortfolio =
    activeCategory === 'all'
      ? t.portfolio.items
      : t.portfolio.items.filter((item) => item.category === activeCategory);

  // Theme Styling Helpers
  const borderCol = isDark ? 'border-white' : 'border-black';
  const surfaceBg = isDark ? 'bg-[#171717]' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-[#0D0D0D]';
  const textMuted = isDark ? 'text-neutral-300' : 'text-neutral-700';
  const hardShadow = isDark ? 'shadow-[6px_6px_0px_#FFFFFF]' : 'shadow-[6px_6px_0px_#000000]';
  const limeShadow = 'shadow-[6px_6px_0px_#CCFF00]';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-brutalist-grid-dark text-white'
          : 'light-mode bg-brutalist-grid-light text-[#0D0D0D]'
      }`}
    >
      {/* ===================================================================
          1. STICKY BRUTALIST NAVBAR
      =================================================================== */}
      <header
        className={`sticky top-0 z-40 border-b-[3px] ${borderCol} ${
          isDark ? 'bg-[#0D0D0D]/95' : 'bg-[#F4F0EA]/95'
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#"
            className={`font-mono-code font-extrabold text-lg sm:text-xl px-3 py-1.5 border-[3px] ${borderCol} bg-[#CCFF00] text-[#0D0D0D] shadow-[4px_4px_0px_#FF3366] flex items-center gap-2 shrink-0`}
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>KAZ.DIGITAL</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono-code text-sm font-bold">
            <a href="#portfolio" className="hover:text-[#CCFF00] transition-colors">
              {t.nav.works}
            </a>
            <a href="#pricing" className="hover:text-[#CCFF00] transition-colors">
              {t.nav.pricing}
            </a>
            <a href="#calculator" className="hover:text-[#CCFF00] transition-colors">
              {t.nav.calculator}
            </a>
            <a href="#process" className="hover:text-[#CCFF00] transition-colors">
              {t.nav.process}
            </a>
            <a href="#faq" className="hover:text-[#CCFF00] transition-colors">
              {t.nav.faq}
            </a>
          </nav>

          {/* Controls: Language Switcher + Theme Toggle + CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher with Framer Motion layoutId Pill */}
            <div
              className={`flex items-center border-[3px] ${borderCol} ${surfaceBg} p-0.5 font-mono-code text-xs font-bold`}
            >
              {(['ru', 'kz', 'en'] as Language[]).map((code) => {
                const active = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={`relative px-2.5 py-1 uppercase transition-colors z-10 cursor-pointer ${
                      active ? 'text-[#0D0D0D]' : textMain
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="langPill"
                        transition={springTransition}
                        className="absolute inset-0 bg-[#CCFF00] -z-10"
                      />
                    )}
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle Button */}
            <motion.button
              type="button"
              onClick={() => setIsDark(!isDark)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92, rotate: 20 }}
              aria-label="Toggle Theme"
              className={`p-2.5 border-[3px] ${borderCol} ${surfaceBg} cursor-pointer`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-[#CCFF00]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[#FF3366]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Desktop WhatsApp CTA */}
            <div className="hidden sm:block">
              <BrutalistButton
                href={buildWhatsAppUrl(t.nav.ctaMsg)}
                variant="lime"
                size="sm"
                isDark={isDark}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.nav.cta}</span>
              </BrutalistButton>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 border-[3px] ${borderCol} ${surfaceBg} cursor-pointer`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`lg:hidden overflow-hidden border-t-[3px] ${borderCol} ${surfaceBg}`}
            >
              <div className="px-4 py-5 flex flex-col gap-4 font-mono-code font-bold text-base">
                <a href="#portfolio" onClick={() => setMobileMenuOpen(false)}>
                  → {t.nav.works}
                </a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  → {t.nav.pricing}
                </a>
                <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>
                  → {t.nav.calculator}
                </a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)}>
                  → {t.nav.process}
                </a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
                  → {t.nav.faq}
                </a>
                <BrutalistButton
                  href={buildWhatsAppUrl(t.nav.ctaMsg)}
                  variant="lime"
                  size="md"
                  isDark={isDark}
                  className="w-full mt-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.nav.cta}</span>
                </BrutalistButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===================================================================
          2. HERO SECTION + DRAGGABLE STICKERS + INFINITE MARQUEE
      =================================================================== */}
      <section ref={heroConstraintRef} className="relative overflow-hidden pt-10 pb-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Kinetic Headline & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springTransition}
              className="lg:col-span-8 space-y-6"
            >
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 border-[3px] ${borderCol} ${surfaceBg} font-mono-code text-xs sm:text-sm font-bold`}
              >
                <span className="w-2.5 h-2.5 bg-[#FF3366] inline-block animate-ping" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight uppercase">
                <span className="block">{t.hero.titleLine1}</span>
                <span className="inline-block bg-[#CCFF00] text-[#0D0D0D] px-3 py-1 my-1.5 border-[3px] border-black shadow-[6px_6px_0px_#FF3366] -rotate-1">
                  {t.hero.titleHighlight}
                </span>
                <span className="block">{t.hero.titleLine2}</span>
              </h1>

              <p className={`text-base sm:text-xl max-w-2xl font-medium leading-relaxed ${textMuted}`}>
                {t.hero.subtitle}
              </p>

              {/* Main Hero Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-4">
                <BrutalistButton
                  href="#portfolio"
                  variant="lime"
                  size="lg"
                  isDark={isDark}
                >
                  <span>{t.hero.btnWorks}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </BrutalistButton>

                <BrutalistButton
                  href="#calculator"
                  variant="surface"
                  size="lg"
                  isDark={isDark}
                >
                  <Calculator className="w-5 h-5 text-[#FF3366]" />
                  <span>{t.hero.btnCalc}</span>
                </BrutalistButton>
              </div>
            </motion.div>

            {/* Right Column: Interactive Draggable Brutalist Stickers */}
            <div className="lg:col-span-4 relative">
              <div
                className={`p-6 border-[3px] ${borderCol} ${surfaceBg} ${hardShadow} relative min-h-[290px] flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between border-b-2 border-dashed border-current pb-3">
                  <span className="font-mono-code text-xs font-bold uppercase text-[#FF3366]">
                    {t.hero.dragHint}
                  </span>
                  <Move className="w-4 h-4 opacity-70" />
                </div>

                {/* Draggable Sticker Badges */}
                <div className="my-auto py-4 flex flex-col gap-4 items-center">
                  {t.hero.stickers.map((sticker, index) => {
                    const bgMap = {
                      lime: 'bg-[#CCFF00] text-[#0D0D0D]',
                      pink: 'bg-[#FF3366] text-white',
                      blue: 'bg-[#00F0FF] text-[#0D0D0D]',
                    };
                    const rotations = ['-rotate-3', 'rotate-2', '-rotate-1'];
                    return (
                      <motion.div
                        key={sticker.id}
                        drag
                        dragConstraints={heroConstraintRef}
                        whileHover={{ scale: 1.05 }}
                        whileDrag={{ scale: 1.14, rotate: 6, zIndex: 50 }}
                        transition={springTransition}
                        className={`cursor-grab active:cursor-grabbing select-none px-5 py-3 border-[3px] border-black font-mono-code font-extrabold text-sm sm:text-base shadow-[5px_5px_0px_#000000] flex items-center gap-2 ${bgMap[sticker.color]} ${rotations[index]}`}
                      >
                        <Move className="w-4 h-4 shrink-0 opacity-75" />
                        <span>{sticker.text}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="text-right font-mono-code text-[11px] opacity-70">
                  KASPI.KZ // WILDBERRIES // OZON // WEB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Infinite Framer Motion Marquee Tape */}
        <div className="mt-16 border-y-[3px] border-black bg-[#CCFF00] text-[#0D0D0D] py-3.5 overflow-hidden select-none">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
            className="flex whitespace-nowrap font-display font-black text-sm sm:text-lg tracking-wider"
          >
            <span className="mx-4">{t.hero.marquee.repeat(4)}</span>
            <span className="mx-4">{t.hero.marquee.repeat(4)}</span>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          3. WHY SO AFFORDABLE? (ANTI-AGENCY MANIFESTO)
      =================================================================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3">
            <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-3 py-1 bg-[#FF3366] text-white border-2 border-black">
              {t.why.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase">
              {t.why.title}
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl ${textMuted}`}>
              {t.why.subtitle}
            </p>
          </div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {t.why.cards.map((card, idx) => {
              const badgeColor =
                card.accent === 'lime'
                  ? 'bg-[#CCFF00] text-black'
                  : card.accent === 'pink'
                  ? 'bg-[#FF3366] text-white'
                  : 'bg-[#00F0FF] text-black';

              const icons = [
                <Layers key="i1" className="w-6 h-6" />,
                <ShieldCheck key="i2" className="w-6 h-6" />,
                <TrendingUp key="i3" className="w-6 h-6" />,
              ];

              return (
                <motion.div
                  key={card.num}
                  variants={cardReveal}
                  whileHover={{ y: -6 }}
                  transition={springTransition}
                  className={`p-7 border-[3px] ${borderCol} ${surfaceBg} ${hardShadow} flex flex-col justify-between gap-6`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono-code font-extrabold text-xl px-3.5 py-1.5 border-[3px] border-black ${badgeColor}`}
                    >
                      {card.num}
                    </span>
                    <div className="p-2.5 border-2 border-current">{icons[idx]}</div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl leading-snug">
                      {card.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${textMuted}`}>
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          4. INTERACTIVE PORTFOLIO SHOWCASE + SHARED-LAYOUT MODAL
      =================================================================== */}
      <section id="portfolio" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-3 py-1 bg-[#CCFF00] text-black border-2 border-black">
                {t.portfolio.tag}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase">
                {t.portfolio.title}
              </h2>
            </div>

            {/* Category Filter Tabs with Sliding layoutId Pill */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(t.portfolio.filters).map(([key, label]) => {
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`relative px-4 py-2.5 font-mono-code text-xs sm:text-sm font-bold uppercase border-[3px] ${borderCol} transition-colors z-10 cursor-pointer ${
                      isActive ? 'text-[#0D0D0D]' : `${surfaceBg} ${textMain}`
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        transition={springTransition}
                        className="absolute inset-0 bg-[#CCFF00] -z-10"
                      />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Portfolio Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((item) => (
                <motion.div
                  layout
                  layoutId={`case-card-${item.id}`}
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={springTransition}
                  onClick={() => setSelectedCase(item)}
                  className={`border-[3px] ${borderCol} ${surfaceBg} ${hardShadow} flex flex-col justify-between cursor-pointer group overflow-hidden`}
                >
                  <div>
                    {/* Crisp SVG Visual Mockup */}
                    <PortfolioVisualMockup item={item} isDark={isDark} />

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-code text-xs font-extrabold px-2.5 py-0.5 bg-[#FF3366] text-white border border-black">
                          {item.catLabel}
                        </span>
                        <span className="font-mono-code text-xs font-bold px-2.5 py-0.5 bg-[#CCFF00] text-black border border-black">
                          {item.metrics}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg leading-snug group-hover:text-[#CCFF00] transition-colors">
                        {item.title}
                      </h3>

                      <p className={`text-sm leading-relaxed ${textMuted}`}>
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Tags */}
                  <div className="px-6 pb-6 pt-3 border-t-2 border-dashed border-neutral-600/50 flex items-center justify-between font-mono-code text-xs font-bold">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                        {item.timeTag}
                      </span>
                      <span className="text-[#CCFF00]">{item.priceTag}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 underline">
                      {t.portfolio.viewCase} <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Lightbox Case Study Modal with Shared Layout */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto"
            >
              <motion.div
                layoutId={`case-card-${selectedCase.id}`}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-2xl border-[3px] ${borderCol} ${surfaceBg} ${limeShadow} overflow-hidden my-8`}
              >
                <div className="flex items-center justify-between px-6 py-4 bg-[#CCFF00] text-black border-b-[3px] border-black">
                  <span className="font-mono-code font-extrabold text-sm uppercase">
                    {selectedCase.catLabel} // {selectedCase.metrics}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="p-1 bg-black text-white border-2 border-black hover:bg-[#FF3366] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <PortfolioVisualMockup item={selectedCase} isDark={isDark} />

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap gap-3 font-mono-code text-xs font-bold">
                    <span className="px-3 py-1 bg-[#FF3366] text-white border-2 border-black">
                      {selectedCase.timeTag}
                    </span>
                    <span className="px-3 py-1 bg-[#00F0FF] text-black border-2 border-black">
                      {selectedCase.priceTag}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl sm:text-2xl">
                    {selectedCase.title}
                  </h3>

                  <p className={`text-sm sm:text-base leading-relaxed ${textMuted}`}>
                    {selectedCase.fullDesc}
                  </p>

                  <div className="space-y-2.5">
                    <h4 className="font-mono-code font-bold text-sm uppercase text-[#CCFF00]">
                      {t.portfolio.modalDeliverables}
                    </h4>
                    <ul className="space-y-2">
                      {selectedCase.deliverables.map((del, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <BrutalistButton
                      href={buildWhatsAppUrl(
                        `Привет! Мне понравился кейс «${selectedCase.title}» (${selectedCase.priceTag}). Хочу заказать похожий проект!`
                      )}
                      variant="lime"
                      size="lg"
                      isDark={isDark}
                      className="w-full"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>{t.portfolio.modalOrderSimilar}</span>
                    </BrutalistButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ===================================================================
          5. TRANSPARENT PRICING & PACKAGES
      =================================================================== */}
      <section id="pricing" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3">
            <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-3 py-1 bg-[#00F0FF] text-black border-2 border-black">
              {t.pricing.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase">
              {t.pricing.title}
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl ${textMuted}`}>
              {t.pricing.subtitle}
            </p>
          </div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 items-stretch"
          >
            {t.pricing.cards.map((pkg) => {
              const isHit = pkg.isHit;
              return (
                <motion.div
                  key={pkg.id}
                  variants={cardReveal}
                  whileHover={{ y: -8 }}
                  transition={springTransition}
                  className={`relative p-6 border-[3px] flex flex-col justify-between ${
                    isHit
                      ? 'bg-[#CCFF00] text-[#0D0D0D] border-black shadow-[8px_8px_0px_#FF3366]'
                      : `${surfaceBg} ${textMain} ${borderCol} ${hardShadow}`
                  }`}
                >
                  {isHit && (
                    <div className="absolute -top-4 right-4 bg-[#FF3366] text-white font-mono-code font-extrabold text-xs px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000]">
                      ★ {t.pricing.hitBadge}
                    </div>
                  )}

                  <div className="space-y-5">
                    <h3 className="font-display font-extrabold text-lg leading-snug">
                      {pkg.name}
                    </h3>

                    <div className="pb-4 border-b-2 border-current">
                      <div className="font-mono-code font-black text-3xl sm:text-4xl">
                        {pkg.price}
                      </div>
                      <div
                        className={`font-mono-code text-xs font-bold mt-1 ${
                          isHit ? 'text-neutral-900' : 'text-[#00F0FF]'
                        }`}
                      >
                        {pkg.unit}
                      </div>
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${
                        isHit ? 'text-neutral-900 font-medium' : textMuted
                      }`}
                    >
                      {pkg.desc}
                    </p>

                    <ul className="space-y-2.5 pt-2">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isHit ? 'text-black stroke-[3]' : 'text-[#CCFF00]'
                            }`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <BrutalistButton
                      href={buildWhatsAppUrl(pkg.waMsg)}
                      variant={isHit ? 'pink' : 'lime'}
                      size="md"
                      isDark={isHit ? false : isDark}
                      className="w-full"
                    >
                      <span>{t.pricing.orderBtn}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </BrutalistButton>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          6. INTERACTIVE COST CALCULATOR + DIRECT WHATSAPP CHECKOUT
      =================================================================== */}
      <section id="calculator" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3">
            <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-3 py-1 bg-[#FF3366] text-white border-2 border-black">
              {t.calculator.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase">
              {t.calculator.title}
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl ${textMuted}`}>
              {t.calculator.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls Box */}
            <div
              className={`lg:col-span-7 p-6 sm:p-8 border-[3px] ${borderCol} ${surfaceBg} ${hardShadow} space-y-8`}
            >
              {/* 1. Website Selector */}
              <div className="space-y-3">
                <label className="block font-mono-code font-bold text-sm sm:text-base uppercase">
                  {t.calculator.webLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {t.calculator.webOptions.map((opt) => {
                    const selected = calcWeb === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCalcWeb(opt.id)}
                        className={`p-3.5 border-[3px] text-left font-mono-code transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#CCFF00] text-[#0D0D0D] border-black shadow-[4px_4px_0px_#FF3366] -translate-y-0.5'
                            : `${borderCol} hover:border-[#CCFF00]`
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                        <div className="text-xs opacity-80 mt-1 font-extrabold">
                          {opt.price === 0 ? '0 ₸' : `${opt.price.toLocaleString()} ₸`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Marketplace Infographic Range Slider */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-mono-code font-bold text-sm sm:text-base uppercase">
                    {t.calculator.slidesLabel}
                  </label>
                  <span className="px-3 py-1 bg-[#00F0FF] text-black font-mono-code font-black text-sm border-2 border-black">
                    {calcSlides} {t.calculator.slidesUnit}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={calcSlides}
                  onChange={(e) => setCalcSlides(Number(e.target.value))}
                  className="brutalist-slider"
                />

                <div className="flex justify-between font-mono-code text-xs opacity-75">
                  <span>0</span>
                  <span>5 (Селлер-Пак)</span>
                  <span>10 (-10%)</span>
                  <span>20</span>
                  <span>30 слайдов</span>
                </div>

                {/* Pop-in 10% Bulk Discount Badge */}
                <AnimatePresence>
                  {hasSlideDiscount && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -8 }}
                      transition={springTransition}
                      className="inline-block px-3.5 py-1.5 bg-[#FF3366] text-white font-mono-code font-extrabold text-xs border-2 border-black shadow-[4px_4px_0px_#CCFF00]"
                    >
                      {t.calculator.discountBadge}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Chatbot Toggle */}
              <div
                onClick={() => setCalcBot(!calcBot)}
                className={`p-4 border-[3px] ${borderCol} flex items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                  calcBot ? 'bg-[#00F0FF] text-[#0D0D0D] border-black' : ''
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-mono-code font-bold text-sm sm:text-base">
                    {t.calculator.botLabel}
                  </div>
                  <div className="font-mono-code text-xs font-extrabold text-[#FF3366]">
                    {t.calculator.botPrice}
                  </div>
                </div>
                <div
                  className={`w-12 h-7 border-[3px] border-black p-0.5 flex items-center ${
                    calcBot ? 'bg-[#CCFF00] justify-end' : 'bg-neutral-700 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    transition={springTransition}
                    className="w-4 h-4 bg-black"
                  />
                </div>
              </div>

              {/* 4. Urgent 24h Delivery Toggle */}
              <div
                onClick={() => setCalcUrgent(!calcUrgent)}
                className={`p-4 border-[3px] ${borderCol} flex items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                  calcUrgent ? 'bg-[#FF3366] text-white border-black' : ''
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-mono-code font-bold text-sm sm:text-base">
                    {t.calculator.urgentLabel}
                  </div>
                  <div className="font-mono-code text-xs font-extrabold">
                    {t.calculator.urgentPrice}
                  </div>
                </div>
                <div
                  className={`w-12 h-7 border-[3px] border-black p-0.5 flex items-center ${
                    calcUrgent ? 'bg-[#CCFF00] justify-end' : 'bg-neutral-700 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    transition={springTransition}
                    className="w-4 h-4 bg-black"
                  />
                </div>
              </div>
            </div>

            {/* Right Live Receipt Summary Box */}
            <div
              className={`lg:col-span-5 p-6 sm:p-8 border-[3px] border-black bg-[#CCFF00] text-[#0D0D0D] shadow-[8px_8px_0px_#FF3366] space-y-6 sticky top-28`}
            >
              <div className="flex items-center justify-between border-b-[3px] border-black pb-4">
                <span className="font-display font-black text-lg uppercase">
                  {t.calculator.summaryTitle}
                </span>
                <Calculator className="w-6 h-6" />
              </div>

              {/* Selected Line Items */}
              <div className="space-y-3 font-mono-code text-sm">
                {webCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span>{webPriceObj?.label}</span>
                    <span className="font-bold">{webCost.toLocaleString()} ₸</span>
                  </div>
                )}

                {calcSlides > 0 && (
                  <div className="flex justify-between items-center">
                    <span>
                      Инфографика ({calcSlides} слайдов)
                      {hasSlideDiscount && ' -10%'}
                    </span>
                    <span className="font-bold">{slidesCost.toLocaleString()} ₸</span>
                  </div>
                )}

                {calcBot && (
                  <div className="flex justify-between items-center">
                    <span>Чат-бот и автоматизация</span>
                    <span className="font-bold">15 000 ₸</span>
                  </div>
                )}

                {calcUrgent && subtotal > 0 && (
                  <div className="flex justify-between items-center text-[#FF3366] font-bold">
                    <span>Срочный запуск (24ч)</span>
                    <span>+20%</span>
                  </div>
                )}

                {totalCost === 0 && (
                  <div className="py-4 text-center text-xs font-bold opacity-75">
                    {t.calculator.emptyHint}
                  </div>
                )}
              </div>

              {/* Animated Live Total Price in KZT */}
              <div className="pt-4 border-t-[3px] border-black">
                <div className="font-mono-code text-xs font-bold uppercase">
                  {t.calculator.totalLabel}
                </div>
                <div className="font-display font-black text-4xl sm:text-5xl tracking-tight mt-1">
                  <AnimatedPrice value={totalCost} /> ₸
                </div>
              </div>

              <BrutalistButton
                href={getCalculatorWhatsAppUrl()}
                variant="pink"
                size="lg"
                isDark={false}
                className="w-full"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t.calculator.sendBtn}</span>
              </BrutalistButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. HOW WE WORK (4 SIMPLE STEPS)
      =================================================================== */}
      <section id="process" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3">
            <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-3 py-1 bg-[#CCFF00] text-black border-2 border-black">
              {t.process.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase">
              {t.process.title}
            </h2>
          </div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {t.process.steps.map((step) => (
              <motion.div
                key={step.num}
                variants={cardReveal}
                whileHover={{ y: -5 }}
                className={`p-6 border-[3px] ${borderCol} ${surfaceBg} ${hardShadow} flex flex-col justify-between gap-6`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-3xl text-[#CCFF00] bg-black px-3 py-1 border-2 border-white">
                    {step.num}
                  </span>
                  <ChevronRight className="w-6 h-6 text-[#FF3366]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg">{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${textMuted}`}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          8. FAQ ACCORDION
      =================================================================== */}
      <section id="faq" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3 text-center">
            <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-3 py-1 bg-[#00F0FF] text-black border-2 border-black">
              {t.faq.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase">
              {t.faq.title}
            </h2>
          </div>

          <div className="space-y-4">
            {t.faq.items.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border-[3px] ${borderCol} ${surfaceBg} ${hardShadow}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-display font-bold text-base sm:text-lg">
                      {item.q}
                    </span>
                    <div
                      className={`p-1.5 border-2 border-black shrink-0 ${
                        isOpen ? 'bg-[#FF3366] text-white' : 'bg-[#CCFF00] text-black'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-5 sm:px-6 pb-6 pt-2 border-t-2 border-dashed border-neutral-600/50 text-sm sm:text-base leading-relaxed ${textMuted}`}
                        >
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          9. BRUTALIST FOOTER & FLOATING WHATSAPP ACTION
      =================================================================== */}
      <footer className={`border-t-[3px] ${borderCol} ${surfaceBg} pt-16 pb-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 border-[3px] border-black bg-[#CCFF00] text-[#0D0D0D] shadow-[8px_8px_0px_#FF3366] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-block font-mono-code text-xs font-extrabold uppercase px-2.5 py-1 bg-black text-[#CCFF00]">
                {t.footer.ctaTag}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase leading-tight">
                {t.footer.ctaTitle}
              </h2>
              <p className="text-sm sm:text-base font-medium text-neutral-900">
                {t.footer.ctaSub}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto shrink-0">
              <a
                href={buildWhatsAppUrl(t.nav.ctaMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-code font-black text-xl sm:text-2xl px-6 py-4 bg-black text-[#CCFF00] border-[3px] border-black shadow-[5px_5px_0px_#FFFFFF] hover:bg-[#FF3366] hover:text-white transition-colors flex items-center justify-center gap-3"
              >
                <PhoneCall className="w-6 h-6" />
                <span>+7 747 241 36 55</span>
              </a>

              <BrutalistButton
                href={buildWhatsAppUrl(t.nav.ctaMsg)}
                variant="pink"
                size="lg"
                isDark={false}
                className="w-full"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t.footer.waButton}</span>
              </BrutalistButton>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-neutral-700/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs opacity-80">
            <span>{t.footer.rights}</span>
            <span>KASPI // WILDBERRIES // OZON // FULLSTACK WEB</span>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-Right WhatsApp Action Button */}
      <motion.a
        href={buildWhatsAppUrl(t.nav.ctaMsg)}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        transition={springTransition}
        aria-label="WhatsApp Direct Chat"
        className="fixed bottom-6 right-6 z-40 p-4 bg-[#CCFF00] text-[#0D0D0D] border-[3px] border-black shadow-[5px_5px_0px_#FF3366] flex items-center gap-2 font-mono-code font-extrabold text-xs sm:text-sm"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] animate-ping" />
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp 24/7</span>
      </motion.a>
    </div>
  );
}

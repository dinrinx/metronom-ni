import type { DemoStepId } from "@/domain/types";

export type DailyCycleScenarioStep =
  | "risk_detail"
  | "risk_one_action"
  | "risk_compare"
  | "risk_done"
  | "risk_bridge"
  | "invoice_new"
  | "invoice_clarify"
  | "invoice_legal"
  | "invoice_draft"
  | "invoice_safe_date"
  | "invoice_done"
  | "backers_progress"
  | "backers_done"
  | "backers_growth"
  | "invest_prompt"
  | "invest_variants"
  | "invest_plan"
  | "fundraise_intro"
  | "fundraise_recommend"
  | "fundraise_compare";

type ScenarioTone = "green" | "amber" | "dark" | "red";

export type ScenarioAction =
  | { type: "step"; step: DemoStepId }
  | { type: "toast"; message: string }
  | { type: "link"; href: string };

export type ScenarioEntryCard = {
  step: DailyCycleScenarioStep;
  title: string;
  sub: string;
  tone: ScenarioTone;
};

export type ScenarioRow = {
  label: string;
  value?: string;
  sub?: string;
  tick?: boolean;
  valueTone?: "default" | "muted" | "amber";
};

type ScenarioVariant = {
  id?: string;
  name: string;
  meta: string;
  tag: string;
  featured?: boolean;
};

type ScenarioMatrixRow = {
  name: string;
  risk: string;
  riskTone: "default" | "amber";
  cost: string;
  debt: string;
  impact: string;
};

type ScenarioLadderRow = {
  index: string;
  name: string;
  meta: string;
  accent?: boolean;
};

export type DailyCycleScenarioConfig = {
  title: string;
  sub?: string;
  align?: "left" | "center";
  badge?: {
    label: string;
    tone: ScenarioTone;
  };
  check?: {
    tone: "green" | "dark";
  };
  stat?: {
    value: string;
    sub: string;
    progressWidth?: string;
  };
  rows?: ScenarioRow[];
  actionCard?: {
    title: string;
    sub: string;
  };
  compare?: ScenarioVariant[];
  matrix?: ScenarioMatrixRow[];
  ladder?: ScenarioLadderRow[];
  draft?: {
    text: string;
  };
  legal?: {
    text: string;
    actions: Array<{
      label: string;
      variant: "primary" | "secondary";
      action: ScenarioAction;
    }>;
    footLeft: string;
    footRight: string;
  };
  choice?: {
    question: string;
    options: Array<{
      id: string;
      label: string;
    }>;
  };
  note?: string;
  cta?: {
    label: string;
    action: ScenarioAction;
    requiresChoice?: boolean;
  };
  secondary?: {
    label: string;
    action: ScenarioAction;
  };
  foot?: string;
};

export const DAILY_CYCLE_ENTRY_CARDS: ScenarioEntryCard[] = [
  {
    step: "invoice_new",
    title: "Новый счёт от поставщика",
    sub: "Юр-проверка счёта и безопасная дата оплаты",
    tone: "red",
  },
  {
    step: "backers_progress",
    title: "Исполнение rewards",
    sub: "Автоматическое закрытие обязательств перед бэкерами",
    tone: "green",
  },
  {
    step: "invest_prompt",
    title: "Разрешение вложиться",
    sub: "Посчитать безопасную закупку до реальной траты",
    tone: "amber",
  },
  {
    step: "risk_detail",
    title: "Падение спроса",
    sub: "Риск заранее и одно безопасное действие",
    tone: "amber",
  },
  {
    step: "fundraise_intro",
    title: "Нужен ли новый сбор",
    sub: "Сравнение с кредитом и своими средствами",
    tone: "dark",
  },
];

export const DAILY_CYCLE_SCENARIOS: Record<DailyCycleScenarioStep, DailyCycleScenarioConfig> = {
  risk_detail: {
    title: "Резерва может не хватить",
    sub: "Заметил заранее — сейчас удобный момент разобраться, а не когда деньги закончились.",
    badge: { label: "Есть риск", tone: "amber" },
    rows: [
      { label: "Поступления за 3 дня", value: "−18%", sub: "ниже прогноза: отмены записей" },
      { label: "К 20 августа не хватит", value: "42 000 ₽", sub: "на аренду и зарплаты" },
      { label: "Запас времени", value: "8 дней", sub: "до критической даты" },
    ],
    cta: { label: "Посмотреть варианты →", action: { type: "step", step: "risk_one_action" } },
  },
  risk_one_action: {
    title: "Одно действие",
    sub: "Сравнил четыре пути и выбрал самый безопасный для ближайших обязательств.",
    actionCard: {
      title: "Перенести вторую часть поставки материалов с 18 на 22 августа",
      sub: "Запасов хватит, аренда и зарплаты обеспечены, страховой резерв и овердрафт не потребуются.",
    },
    rows: [
      { label: "Аренда и зарплаты", value: "обеспечены", sub: "20 августа", tick: true },
      { label: "Страховой запас", value: "не тронут", sub: "остаётся 18 000 ₽", tick: true },
      { label: "Дополнительное финансирование", value: "не нужно", tick: true },
    ],
    cta: { label: "Подтвердить перенос", action: { type: "step", step: "risk_done" } },
    secondary: { label: "Сравнить 4 варианта", action: { type: "step", step: "risk_compare" } },
    foot: "Перенос будет создан черновиком и уйдёт поставщику только после подтверждения",
  },
  risk_compare: {
    title: "Сравнение вариантов",
    sub: "Считал по четырём осям: риск, стоимость, долговая нагрузка, влияние на бизнес.",
    compare: [
      {
        id: "delay_supply",
        name: "Перенести некритичную поставку",
        meta: "Риск низкий · стоимость 0 ₽ · долговая нагрузка не растёт",
        tag: "Рекомендую",
        featured: true,
      },
      {
        id: "cut_order",
        name: "Сократить заказ на 30%",
        meta: "Риск средний · экономит 26 000 ₽ · возможна нехватка материалов к концу месяца",
        tag: "Возможен",
      },
      {
        id: "use_reserve",
        name: "Использовать страховой запас",
        meta: "Риск средний · бесплатно · резерв обнулится и будет копиться заново 3 недели",
        tag: "Менее выгоден сейчас",
      },
      {
        id: "overdraft",
        name: "Подключить овердрафт Альфы",
        meta: "Доступен, лимит 150 000 ₽ · платный · добавит долговую нагрузку при решаемой ситуации",
        tag: "Менее выгоден сейчас",
      },
    ],
    cta: { label: "Вернуться к рекомендации", action: { type: "step", step: "risk_one_action" } },
    secondary: { label: "Если этого не хватит — что дальше", action: { type: "step", step: "risk_bridge" } },
  },
  risk_done: {
    title: "Всё снова под контролем",
    align: "center",
    check: { tone: "green" },
    rows: [
      { label: "Закупка перенесена", value: "22 августа", tick: true },
      { label: "Аренда и зарплаты", value: "обеспечены", tick: true },
      { label: "Доп. финансирование", value: "не потребовалось", tick: true },
    ],
    cta: { label: "На главный", action: { type: "step", step: "safe_to_spend" } },
    foot: "План на 30 дней пересобран · возврат на хаб",
  },
  risk_bridge: {
    title: "Есть ещё один путь",
    sub: "Падение держится третью неделю — это уже не разовый провал, а структурная ситуация.",
    badge: { label: "Дефицит больше, чем покрывают текущие пути", tone: "amber" },
    ladder: [
      { index: "1", name: "Операционное действие", meta: "Перенос или сокращение поставки — покрывает 42 000 ₽" },
      { index: "2", name: "Фонд стабильности", meta: "Страховой запас 18 000 ₽ — выплаты напрямую поставщику и арендодателю" },
      { index: "3", name: "Овердрафт Альфы", meta: "Закроет разрыв, но создаёт стоимость при падающем потоке" },
      { index: "4", name: "Пересмотреть стратегию", meta: "Честный повторный сбор у существующих бэкеров — с сохранением истории", accent: true },
    ],
    cta: { label: "Посмотреть, что можно сделать", action: { type: "step", step: "fundraise_intro" } },
    foot: "Ведёт в блок пересмотра стратегии, если переноса, резерва и овердрафта уже недостаточно",
  },
  invoice_new: {
    title: "Новый счёт от поставщика",
    sub: "Пришёл на почту, привязанную к бизнесу.",
    stat: {
      value: "78 000 ₽",
      sub: "Счёт №221 от 12 августа · упаковка и товар",
    },
    rows: [
      { label: "Поставщик", value: "ООО «Первая линия»", valueTone: "muted" },
      { label: "Срок оплаты в счёте", value: "18 августа", valueTone: "muted" },
      { label: "Связанный договор", value: "№14-К", valueTone: "muted" },
    ],
    note: "Проверю счёт против договора и текущего плана платежей.",
    cta: { label: "Проверить", action: { type: "step", step: "invoice_clarify" } },
  },
  invoice_clarify: {
    title: "Нужно уточнение",
    sub: "Счёт на 78 000 ₽ отличается от условий договора.",
    badge: { label: "Нужно уточнение", tone: "dark" },
    choice: {
      question: "Этот заказ заменяет предыдущий на 28 000 ₽ или он дополнительный?",
      options: [
        { id: "replace", label: "Замена" },
        { id: "additional", label: "Дополнительный" },
      ],
    },
    note: "От ответа зависит, вырастет ли конверт «Поставщики» на 50 000 ₽ или на 78 000 ₽.",
    cta: { label: "Продолжить", action: { type: "step", step: "invoice_legal" }, requiresChoice: true },
  },
  invoice_legal: {
    title: "Проверьте изменение условий",
    sub: "Даты в договоре и в счёте не совпадают.",
    legal: {
      text: "В договоре срок оплаты — 22 августа, в счёте — 18 августа. Счёт сам по себе может не менять условия договора. Безопаснее подтвердить срок с поставщиком или запросить дополнительное соглашение.",
      actions: [
        { label: "Подготовить запрос поставщику", variant: "primary", action: { type: "step", step: "invoice_draft" } },
        { label: "Срок уже согласован", variant: "secondary", action: { type: "step", step: "invoice_safe_date" } },
        { label: "Посмотреть документы", variant: "secondary", action: { type: "toast", message: "В P0 покажу только связанный договор и счёт без отдельного viewer." } },
      ],
      footLeft: "Актуально на 12.08.2026",
      footRight: "Первоисточник",
    },
  },
  invoice_draft: {
    title: "Черновик запроса",
    sub: "Составил текст — отправляете вы.",
    draft: {
      text: "Добрый день! В договоре №14-К срок оплаты — 22 августа, в счёте №221 указано 18 августа. Подтвердите, пожалуйста, какой срок применяется, либо пришлите исправленный счёт.",
    },
    note: "Метроном ничего не отправляет сам — письмо уйдёт только после вашего подтверждения.",
    cta: { label: "Отправить", action: { type: "step", step: "invoice_safe_date" } },
  },
  invoice_safe_date: {
    title: "Срок подтверждён",
    sub: "Поставщик подтвердил: 22 августа.",
    badge: { label: "Есть риск при оплате сегодня", tone: "amber" },
    rows: [
      { label: "Если оплатить сегодня", value: "−31 000 ₽", sub: "20 августа не хватит на аренду и зарплаты" },
      { label: "Если оплатить 22 августа", value: "обеспечено", sub: "поступления покрывают оба обязательства", tick: true },
    ],
    cta: { label: "Запланировать на 22 августа", action: { type: "step", step: "invoice_done" } },
    foot: "Дата возьмётся из подтверждения поставщика, не из счёта",
  },
  invoice_done: {
    title: "План обновлён",
    align: "center",
    check: { tone: "green" },
    rows: [
      { label: "Поставщик · 78 000 ₽", value: "22 августа", sub: "добавлено в конверт «Поставщики»", tick: true },
      { label: "Аренда и зарплаты", value: "обеспечены", tick: true },
      { label: "Действительно свободно", value: "49 000 ₽" },
    ],
    cta: { label: "На главный", action: { type: "step", step: "safe_to_spend" } },
    foot: "Safe-to-Spend пересчитан · возврат на хаб",
  },
  backers_progress: {
    title: "Выполнение обещаний",
    sub: "Фиксируется через AlfaPOS — вручную отмечать не нужно.",
    stat: {
      value: "119 из 120",
      sub: "Товарные наборы выданы бэкерам",
      progressWidth: "99%",
    },
    rows: [
      { label: "Осталось выдать", value: "1 набор", sub: "самовывоз, до 31 августа" },
      { label: "Связано в конверте «Бэкеры»", value: "130 000 ₽" },
    ],
    cta: { label: "Открыть список бэкеров", action: { type: "step", step: "backers_done" } },
  },
  backers_done: {
    title: "Обязательства перед бэкерами закрыты",
    align: "center",
    check: { tone: "dark" },
    rows: [
      { label: "Выполнено", value: "120 из 120", tick: true },
      { label: "Освобождено из конверта", value: "74 000 ₽", sub: "деньги перестали быть связанными", tick: true },
    ],
    cta: { label: "Посмотреть обновлённую сводку", action: { type: "step", step: "backers_growth" } },
  },
  backers_growth: {
    title: "Всё под контролем",
    sub: "Конверты пересобраны после закрытия обязательств.",
    stat: {
      value: "112 000 ₽",
      sub: "Действительно свободно после освобождения конверта",
    },
    rows: [
      { label: "Страховой запас", value: "46 000 / 60 000 ₽", sub: "пополняется по правилу 7%" },
      { label: "Ближайшие обязательства", value: "обеспечены", tick: true },
    ],
    actionCard: {
      title: "До 62 000 ₽ можно направить на развитие",
      sub: "Эта сумма не затрагивает обязательства и страховой запас — остальное пусть работает как оборот.",
    },
    cta: { label: "На главный", action: { type: "step", step: "safe_to_spend" } },
  },
  invest_prompt: {
    title: "Готовый вопрос",
    sub: "Не чат-ввод, а подготовленный триггер на основе ваших данных.",
    actionCard: {
      title: "Можно ли вложить 96 000 ₽ в закупку ингредиентов?",
      sub: "Посчитаю списания, остаток свободных и риск по спросу за две недели.",
    },
    rows: [
      { label: "Действительно свободно", value: "112 000 ₽" },
      { label: "Ближайшее обязательство", value: "20 августа", sub: "аренда и зарплаты — 150 000 ₽" },
    ],
    cta: { label: "Посчитать", action: { type: "step", step: "invest_variants" } },
  },
  invest_variants: {
    title: "Вложить 96 000 ₽ сейчас рискованно",
    sub: "Спрос за две недели −12%, остатка ингредиентов хватит на 6 дней.",
    badge: { label: "Есть риск", tone: "amber" },
    compare: [
      { id: "full_buy", name: "Закупить на 96 000 ₽", meta: "Ближайшие списания 15 000 ₽ · свободно останется 21 000 ₽ · буфер почти исчезает", tag: "Рискованно" },
      { id: "smart_buy", name: "Закупить на 68 000 ₽", meta: "Ближайшие списания 4 000 ₽ · свободно останется 49 000 ₽ · сезонное меню запускается", tag: "Рекомендую", featured: true },
      { id: "delay_buy", name: "Отложить на 5 дней", meta: "Больше данных по спросу · риск изменения закупочной цены", tag: "Возможен" },
    ],
    cta: { label: "Подготовить заказ на 68 000 ₽", action: { type: "step", step: "invest_plan" } },
  },
  invest_plan: {
    title: "План подготовлен",
    sub: "Черновик готов — подтверждаете вы.",
    stat: {
      value: "68 000 ₽",
      sub: "Закупка ингредиентов для сезонного меню · поставщик «Кофе Логистика»",
    },
    rows: [
      { label: "Первая часть закупки", value: "40 000 ₽", sub: "ингредиенты на 2 недели" },
      { label: "Минимальный бюджет запуска", value: "12 000 ₽", sub: "витрина, стаканы, промо" },
      { label: "Дата проверки результатов", value: "27 августа", sub: "через 2 недели после старта" },
      { label: "Условие перехода ко 2 этапу", value: "+15% к среднему чеку", sub: "иначе не закупаем вторую часть" },
      { label: "Предельная себестоимость", value: "42% от цены", sub: "порог по напитку сезонного меню" },
    ],
    cta: { label: "Подтвердить план", action: { type: "step", step: "safe_to_spend" } },
    foot: "Разовое разрешение · после подтверждения пересоберу план на 30 дней",
  },
  fundraise_intro: {
    title: "Прежде чем запускать сбор",
    sub: "Обязательства перед текущими бэкерами закрыты — но новый сбор создаст новые.",
    stat: {
      value: "180 000 ₽",
      sub: "Цель сбора: оборудование для второй точки",
    },
    rows: [
      { label: "Новые обещания", value: "~2 месяца", sub: "сроки исполнения rewards" },
      { label: "Текущий поток", value: "+12% в неделю" },
      { label: "Свободно сейчас", value: "112 000 ₽" },
    ],
    cta: { label: "Сравнить источники", action: { type: "step", step: "fundraise_recommend" } },
  },
  fundraise_recommend: {
    title: "Свои средства и отложенный запуск",
    sub: "Через 3 недели при текущем потоке цель закрывается без новых обязательств.",
    actionCard: {
      title: "Рекомендую отложить запуск на 3 недели и профинансировать из своих",
      sub: "Новый сбор добавит второй параллельный контур обещаний, а поток растёт на 12% в неделю — деньги придут и без него.",
    },
    compare: [
      { id: "self_funding", name: "Свои средства + отложенный запуск", meta: "Нет долга и новых обещаний · запуск позже на 3 недели", tag: "Рекомендую", featured: true },
      { id: "alfa_credit", name: "Овердрафт или кредит Альфы", meta: "Быстро · платно · растёт долговая нагрузка при растущем потоке", tag: "Возможен" },
      { id: "new_fundraise", name: "Новый сбор через «Народные инвестиции»", meta: "Без долга · но второй параллельный контур обещаний на 2 месяца", tag: "Возможен" },
    ],
    cta: { label: "Посмотреть детали", action: { type: "step", step: "fundraise_compare" } },
    secondary: {
      label: "Всё равно запустить сбор",
      action: { type: "link", href: "/ni/campaigns/new" },
    },
  },
  fundraise_compare: {
    title: "Детали сравнения",
    sub: "Четыре оси расчёта по каждому источнику.",
    matrix: [
      {
        name: "Свои средства",
        risk: "низкий",
        riskTone: "default",
        cost: "0 ₽",
        debt: "нет",
        impact: "запуск позже на 3 недели, операционка не перегружена",
      },
      {
        name: "Овердрафт / кредит",
        risk: "средний",
        riskTone: "amber",
        cost: "~9 400 ₽",
        debt: "растёт",
        impact: "запуск сразу, платёж по долгу конкурирует с арендой и ФОТ",
      },
      {
        name: "Новый сбор",
        risk: "средний",
        riskTone: "amber",
        cost: "комиссия + rewards",
        debt: "нет",
        impact: "2 месяца новых обещаний параллельно текущей операционке",
      },
    ],
    actionCard: {
      title: "Симуляция ещё не начатого контура rewards",
      sub: "Прогноз нагрузки на 2 месяца: 180 000 ₽ обещаний легли бы на конверты так, что страховой запас перестал бы пополняться на 5 недель, а свободные упали бы до 34 000 ₽ в пик исполнения.",
    },
    rows: [
      { label: "Основание оценки", value: "Прошлая кампания", sub: "120 наград, себестоимость и фактические сроки исполнения" },
      { label: "Сверено со статистикой", value: "Похожие сборы", sub: "сборы того же размера и отрасли в «Народных инвестициях»" },
    ],
    cta: { label: "Вернуться к рекомендации", action: { type: "step", step: "fundraise_recommend" } },
  },
};

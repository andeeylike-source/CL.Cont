(function () {
  'use strict';

  const state = {
    page: 'dashboard',
    theme: localStorage.getItem('cc_theme') || 'dark',
    language: localStorage.getItem('cc_language') || 'ru'
  };

  const translations = {
    ru: {
      dashboardTitle: 'Дашборд',
      calendarTitle: 'Календарь КМ',
      rosterTitle: 'Клан',
      packsTitle: 'Рейд Паки',
      statsTitle: 'Статистика КМ',
      archiveTitle: 'Архив игроков',
      settingsPageTitle: '⚙️ Настройки',
      navDashboard: '🏠 Дашборд',
      navStats: '📊 Статистика',
      navCalendar: '📅 Календарь КМ',
      navScreenshots: '📋 История КМ',
      navRoster: '👥 Клан',
      navPacks: '⚔️ Рейд Паки',
      navArchive: '🗄️ Архив',
      navSettings: '⚙️ Настройки',
      navSectionAnalytics: 'Аналитика',
      navSectionManagement: 'Управление',
      navSectionSystem: 'Система',
      backupDataBtn: '💾 Бэкап данных',
      autoSaveText: 'Восстановлено',
      createPackBtn: '+ Создать пак',
      sidebarPreferencesTitle: '⚙️ Быстрые настройки',
      languageLabel: 'Язык',
      themeLabel: 'Тема',
      authTitle: '🔐 Авторизация',
      authDescription: 'UI восстановлен. Для полной логики нужен исходный app.js, а не diff.',
      supabaseHint: 'Сейчас подключён аварийный скрипт-восстановление.',
      authEmailLabel: 'Email',
      authSignInBtn: '✉️ Войти по email',
      authSignOutBtn: '↩️ Выйти',
      profileSettingsTitle: '👤 Личный кабинет',
      profileSettingsDescription: 'Форма сохранена, но серверная логика отключена в аварийной версии.',
      profileEmailLabel: 'Email',
      clanNameLabel: 'Clan name',
      saveProfileBtn: '💾 Сохранить профиль',
      themeDark: 'Dark',
      themeLight: 'Light'
    },
    en: {
      dashboardTitle: 'Dashboard',
      calendarTitle: 'Clan Calendar',
      rosterTitle: 'Clan',
      packsTitle: 'Raid Packs',
      statsTitle: 'Clan Statistics',
      archiveTitle: 'Players Archive',
      settingsPageTitle: '⚙️ Settings',
      navDashboard: '🏠 Dashboard',
      navStats: '📊 Statistics',
      navCalendar: '📅 Clan Calendar',
      navScreenshots: '📋 Clan History',
      navRoster: '👥 Clan',
      navPacks: '⚔️ Raid Packs',
      navArchive: '🗄️ Archive',
      navSettings: '⚙️ Settings',
      navSectionAnalytics: 'Analytics',
      navSectionManagement: 'Management',
      navSectionSystem: 'System',
      backupDataBtn: '💾 Backup data',
      autoSaveText: 'Recovered',
      createPackBtn: '+ Create pack',
      sidebarPreferencesTitle: '⚙️ Quick settings',
      languageLabel: 'Language',
      themeLabel: 'Theme',
      authTitle: '🔐 Sign in',
      authDescription: 'The UI has been recovered. Full logic requires the original app.js, not a diff.',
      supabaseHint: 'Emergency recovery script is active right now.',
      authEmailLabel: 'Email',
      authSignInBtn: '✉️ Sign in by email',
      authSignOutBtn: '↩️ Sign out',
      profileSettingsTitle: '👤 Profile',
      profileSettingsDescription: 'The form is preserved, but server logic is disabled in the emergency version.',
      profileEmailLabel: 'Email',
      clanNameLabel: 'Clan name',
      saveProfileBtn: '💾 Save profile',
      themeDark: 'Dark',
      themeLight: 'Light'
    }
  };

  function t(key) {
    return (translations[state.language] && translations[state.language][key]) || translations.ru[key] || key;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
  }

  function showPlaceholder(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    document.body.classList.toggle('light-theme', state.theme === 'light');
    document.body.classList.toggle('dark-theme', state.theme !== 'light');
    localStorage.setItem('cc_theme', state.theme);
    setValue('themeSelect', state.theme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      const darkOption = themeSelect.querySelector('option[value="dark"]');
      const lightOption = themeSelect.querySelector('option[value="light"]');
      if (darkOption) darkOption.textContent = t('themeDark');
      if (lightOption) lightOption.textContent = t('themeLight');
    }
  }

  function applyLanguage(language) {
    state.language = language === 'en' ? 'en' : 'ru';
    document.documentElement.lang = state.language;
    localStorage.setItem('cc_language', state.language);
    setValue('languageSelect', state.language);

    const map = {
      dashboardTitle: 'dashboardTitle',
      calendarTitle: 'calendarTitle',
      rosterTitle: 'rosterTitle',
      packsTitle: 'packsTitle',
      statsTitle: 'statsTitle',
      archiveTitle: 'archiveTitle',
      settingsPageTitle: 'settingsPageTitle',
      'nav-dashboard': 'navDashboard',
      'nav-stats': 'navStats',
      'nav-calendar': 'navCalendar',
      'nav-screenshots': 'navScreenshots',
      'nav-roster': 'navRoster',
      'nav-packs': 'navPacks',
      'nav-archive': 'navArchive',
      'nav-settings': 'navSettings',
      navSectionAnalytics: 'navSectionAnalytics',
      navSectionManagement: 'navSectionManagement',
      navSectionSystem: 'navSectionSystem',
      backupDataBtn: 'backupDataBtn',
      autoSaveText: 'autoSaveText',
      createPackBtn: 'createPackBtn',
      sidebarPreferencesTitle: 'sidebarPreferencesTitle',
      languageLabel: 'languageLabel',
      themeLabel: 'themeLabel',
      authTitle: 'authTitle',
      authDescription: 'authDescription',
      supabaseHint: 'supabaseHint',
      authEmailLabel: 'authEmailLabel',
      authSignInBtn: 'authSignInBtn',
      authSignOutBtn: 'authSignOutBtn',
      profileSettingsTitle: 'profileSettingsTitle',
      profileSettingsDescription: 'profileSettingsDescription',
      profileEmailLabel: 'profileEmailLabel',
      clanNameLabel: 'clanNameLabel',
      saveProfileBtn: 'saveProfileBtn'
    };

    Object.entries(map).forEach(([id, key]) => setText(id, t(key)));
    applyTheme(state.theme);
  }

  function renderDashboard() {
    showPlaceholder('dashSubtitle', state.language === 'ru' ? 'Аварийно восстановленная версия интерфейса.' : 'Emergency recovered interface.');
    showPlaceholder('dashNextEvent', state.language === 'ru' ? 'Календарь доступен в режиме просмотра →' : 'Calendar is available in preview mode →');
    showPlaceholder('dashNavCards', `
      <div class="card"><b>${t('navRoster')}</b><div style="margin-top:8px;color:#64748b">UI восстановлен, бизнес-логика частично отключена.</div></div>
      <div class="card"><b>${t('navStats')}</b><div style="margin-top:8px;color:#64748b">Исходный app.js не был передан целиком.</div></div>
      <div class="card"><b>${t('navCalendar')}</b><div style="margin-top:8px;color:#64748b">Навигация работает, данные-заглушки.</div></div>
      <div class="card"><b>${t('navSettings')}</b><div style="margin-top:8px;color:#64748b">Можно переключать тему и язык.</div></div>
    `);
    showPlaceholder('dashAlerts', `<div class="dash-alert dash-alert-warn"><div>⚠️</div><div>${state.language === 'ru' ? 'Оригинальный JavaScript был загружен как diff и обрезан.' : 'The original JavaScript was uploaded as a truncated diff.'}</div></div>`);
    showPlaceholder('dashAttention', `<div class="dash-alert dash-alert-info"><div>ℹ️</div><div>${state.language === 'ru' ? 'Чтобы вернуть всю логику, нужен полный app.js.' : 'A full app.js is needed to restore all logic.'}</div></div>`);
    showPlaceholder('dashTopValue', '<div class="text-slate-500">—</div>');
    showPlaceholder('dashTopGrowing', '<div class="text-slate-500">—</div>');
    showPlaceholder('dashTopFalling', '<div class="text-slate-500">—</div>');
    showPlaceholder('dashRareGems', '<div class="text-slate-500">—</div>');
  }

  function renderCalendarPreview() {
    showPlaceholder('calendarMonthLabel', new Date().toLocaleDateString(state.language === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' }));
    showPlaceholder('calendarSummary', '<div class="card" style="padding:12px 16px">Preview mode</div>');
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    const days = state.language === 'ru' ? ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    grid.innerHTML = days.map(d => `<div class="calendar-header-cell">${d}</div>`).join('');
    for (let i = 1; i <= 35; i++) {
      grid.innerHTML += `<div class="calendar-day"><div class="day-number"><span>${i}</span></div></div>`;
    }
  }

  function renderRosterPreview() {
    showPlaceholder('rosterStats', state.language === 'ru' ? 'Режим восстановления: данные игроков недоступны.' : 'Recovery mode: player data unavailable.');
    showPlaceholder('rosterBody', `<tr><td colspan="8" style="color:#64748b">${state.language === 'ru' ? 'Нужен полный app.js или резервная копия localStorage.' : 'A full app.js or localStorage backup is required.'}</td></tr>`);
  }

  function renderPacksPreview() {
    showPlaceholder('packsGrid', `<div class="pack-card"><b>${state.language === 'ru' ? 'Паки временно недоступны' : 'Packs temporarily unavailable'}</b><div style="margin-top:10px;color:#64748b">${state.language === 'ru' ? 'Восстановлен только интерфейс.' : 'Only the interface was recovered.'}</div></div>`);
  }

  function renderStatsPreview() {
    showPlaceholder('statsPeriodLabel', state.language === 'ru' ? 'Статистика отключена в аварийной версии.' : 'Statistics are disabled in the emergency version.');
    showPlaceholder('ccAbsenceReport', '');
    showPlaceholder('statsContent', `<div class="card">${state.language === 'ru' ? 'Для восстановления статистики нужен оригинальный app.js.' : 'The original app.js is required to restore statistics.'}</div>`);
    showPlaceholder('bossAnalysis', '');
  }

  function renderArchivePreview() {
    showPlaceholder('archiveBody', `<tr><td colspan="3" style="color:#64748b">${state.language === 'ru' ? 'Архив недоступен в аварийной версии.' : 'Archive unavailable in recovery mode.'}</td></tr>`);
  }

  function renderHistoryPreview() {
    showPlaceholder('kmHistoryContent', `<div class="card">${state.language === 'ru' ? 'История КМ недоступна без полного JavaScript.' : 'Clan history is unavailable without the full JavaScript.'}</div>`);
  }

  function showPage(page) {
    state.page = page;
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const section = document.getElementById(`page-${page}`);
    const nav = document.getElementById(`nav-${page}`);
    if (section) section.classList.add('active');
    if (nav) nav.classList.add('active');
    if (location.hash !== `#${page}`) location.hash = page;
  }

  function noOpNotice(message) {
    alert(message || (state.language === 'ru'
      ? 'Эта кнопка требует полного app.js. Сейчас загружена аварийная версия.'
      : 'This action requires the full app.js. The emergency version is loaded now.'));
  }

  window.showPage = showPage;
  window.changeMonth = function () { renderCalendarPreview(); };
  window.openDayModal = function () { noOpNotice(); };
  window.exportData = function () { noOpNotice(state.language === 'ru' ? 'Экспорт отключён: нет оригинальной логики.' : 'Export disabled: original logic is missing.'); };
  window.findAllDuplicates = window.clearAllNew = window.unverifyAll = window.resetAllStats = window.openPlayerModal = window.createNewPack = window.clearPeriod = window.openDatePicker = window.debugSnapshotData = window.toggleProfaDropdown = window.closeOnboarding = window.closeProfaAssign = window.saveProfaAssign = function () { noOpNotice(); };
  window.signInWithMagicLink = window.signOutUser = window.saveProfileSettings = function () { noOpNotice(state.language === 'ru' ? 'Supabase-логика отключена в аварийной версии.' : 'Supabase logic is disabled in the emergency version.'); };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.main-content')?.classList.add('ready');

    document.getElementById('languageSelect')?.addEventListener('change', function (e) {
      applyLanguage(e.target.value);
      renderDashboard();
      renderCalendarPreview();
      renderRosterPreview();
      renderPacksPreview();
      renderStatsPreview();
      renderArchivePreview();
      renderHistoryPreview();
    });

    document.getElementById('themeSelect')?.addEventListener('change', function (e) {
      applyTheme(e.target.value);
    });

    applyLanguage(state.language);
    renderDashboard();
    renderCalendarPreview();
    renderRosterPreview();
    renderPacksPreview();
    renderStatsPreview();
    renderArchivePreview();
    renderHistoryPreview();

    const hash = (location.hash || '#dashboard').replace('#', '');
    showPage(document.getElementById(`page-${hash}`) ? hash : 'dashboard');
  });
})();

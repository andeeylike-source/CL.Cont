/* ui.js — Login flow, Theme, Language */

const UI_TEXTS = {
    ru: {
        loginSubtitle:  'Инструмент офицера клана для отслеживания КМ-статистики',
        loginEmailLabel:'Введи email',
        loginClanLabel: 'Название клана',
        loginBtnText1:  'Продолжить →',
        loginBtnText2:  'Войти в Clan Control →',
        loginHintText:  'MVP режим — введи любой email',
        loginHint2:     'Можно изменить позже в профиле',
    },
    en: {
        loginSubtitle:  'Clan officer toolkit for tracking war statistics',
        loginEmailLabel:'Enter your email',
        loginClanLabel: 'Clan name or tag',
        loginBtnText1:  'Continue →',
        loginBtnText2:  'Enter Clan Control →',
        loginHintText:  'MVP mode — enter any email',
        loginHint2:     'You can change this in your profile later',
    }
};

let currentTheme = localStorage.getItem('cc_theme') || 'dark';
let currentLang  = localStorage.getItem('cc_lang')  || 'ru';
let loginEmail   = '';

/* ─── THEME ─────────────────────────────────── */
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('cc_theme', theme);
    document.body.classList.toggle('light', theme === 'light');
    _syncPair('themeDark',      'themeLight',      theme === 'dark');
    _syncPair('loginThemeDark', 'loginThemeLight',  theme === 'dark');
}

/* ─── LANGUAGE ───────────────────────────────── */
function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('cc_lang', lang);
    _syncPair('langRu',      'langEn',      lang === 'ru');
    _syncPair('loginLangRu', 'loginLangEn', lang === 'ru');
    _applyTexts(lang);
}

function _applyTexts(lang) {
    const t = UI_TEXTS[lang] || UI_TEXTS.ru;
    _setText('loginSubtitle',   t.loginSubtitle);
    _setText('loginEmailLabel', t.loginEmailLabel);
    _setText('loginClanLabel',  t.loginClanLabel);
    _setText('loginBtnText1',   t.loginBtnText1);
    _setText('loginBtnText2',   t.loginBtnText2);
    _setText('loginHintText',   t.loginHintText);
    _setText('loginHint2',      t.loginHint2);
}

/* ─── LOGIN STEPS ────────────────────────────── */
function goStep2() {
    const input = document.getElementById('loginEmailInput');
    const email = (input ? input.value : '').trim();
    const t = UI_TEXTS[currentLang] || UI_TEXTS.ru;

    if (!email || !email.includes('@')) {
        _shakeInput(input);
        return;
    }
    loginEmail = email;

    // Переход к шагу 2
    document.getElementById('loginStep1').classList.remove('active');
    document.getElementById('loginStep2').classList.add('active');
    document.getElementById('loginDot2').classList.add('done');

    const clanInput = document.getElementById('loginClanInput');
    if (clanInput) clanInput.focus();
}

function goStep1() {
    document.getElementById('loginStep2').classList.remove('active');
    document.getElementById('loginStep1').classList.add('active');
    document.getElementById('loginDot2').classList.remove('done');
}

function doLogin() {
    const clanInput  = document.getElementById('loginClanInput');
    const clanName   = clanInput ? clanInput.value.trim() : '';

    // Сохраняем сессию
    sessionStorage.setItem('cc_user',  loginEmail);
    sessionStorage.setItem('cc_clan',  clanName);
    localStorage.setItem('cc_user',    loginEmail);
    localStorage.setItem('cc_clan',    clanName);

    _showApp(loginEmail, clanName);
}

/* ─── LOGOUT ─────────────────────────────────── */
function doLogout() {
    sessionStorage.removeItem('cc_user');
    sessionStorage.removeItem('cc_clan');
    localStorage.removeItem('cc_user');
    localStorage.removeItem('cc_clan');

    // Сброс формы
    const e = document.getElementById('loginEmailInput');
    const c = document.getElementById('loginClanInput');
    if (e) e.value = '';
    if (c) c.value = '';
    loginEmail = '';

    // Возврат к шагу 1
    goStep1();
    document.getElementById('loginDot2').classList.remove('done');

    // Скрываем приложение, показываем логин
    document.getElementById('topbar').classList.add('hidden');
    document.getElementById('appLayout').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

/* ─── SHOW APP ───────────────────────────────── */
function _showApp(email, clan) {
    // Скрываем логин
    document.getElementById('loginScreen').classList.add('hidden');

    // Показываем топбар и лейаут
    document.getElementById('topbar').classList.remove('hidden');
    document.getElementById('appLayout').classList.remove('hidden');

    // Обновляем аватар и email в топбаре
    const avatar = document.getElementById('topbarAvatar');
    const emailEl = document.getElementById('topbarEmail');
    if (avatar) avatar.textContent = (email[0] || '?').toUpperCase();
    if (emailEl) emailEl.textContent = email;

    // Clan badge
    const clanBadge = document.getElementById('topbarClan');
    if (clanBadge) {
        if (clan) {
            clanBadge.textContent = clan;
            clanBadge.style.display = '';
        } else {
            clanBadge.style.display = 'none';
        }
    }
}

function _syncPair(activeId, inactiveId, firstIsActive) {
    const a = document.getElementById(activeId);
    const b = document.getElementById(inactiveId);
    if (a) a.classList.toggle('active', firstIsActive);
    if (b) b.classList.toggle('active', !firstIsActive);
}

function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function _shakeInput(input) {
    if (!input) return;
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 1500);
    input.focus();
}

/* ─── INIT ───────────────────────────────────── */
(function init() {
    setTheme(currentTheme);
    setLang(currentLang);

    const savedUser = sessionStorage.getItem('cc_user') || localStorage.getItem('cc_user');
    const savedClan = sessionStorage.getItem('cc_clan') || localStorage.getItem('cc_clan') || '';

    if (savedUser) {
        loginEmail = savedUser;
        _showApp(savedUser, savedClan);
    }
})();

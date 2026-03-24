/* ui.js — Login flow, Theme, Language */

const UI_TEXTS = {
    ru: {
        loginSubtitle:  'Инструмент офицера клана для отслеживания КМ-статистики',
        loginEmailLabel:'Введи email',
        loginClanLabel: 'Клан (только при первом входе)',
        loginBtnText1:  'Отправить ссылку на вход →',
        loginBtnText2:  'Я перешёл по ссылке →',
        loginHintText:  'На почту придёт ссылка для входа',
        loginHint2:     'Если клан уже был сохранён — поле можно пропустить',
    },
    en: {
        loginSubtitle:  'Clan officer toolkit for tracking war statistics',
        loginEmailLabel:'Enter your email',
        loginClanLabel: 'Clan (first login only)',
        loginBtnText1:  'Send magic link →',
        loginBtnText2:  'I clicked the link →',
        loginHintText:  'We will send a secure sign-in link to your email',
        loginHint2:     'Skip clan input if it was already saved before',
    }
};

let currentTheme = localStorage.getItem('cc_theme') || 'dark';
let currentLang  = localStorage.getItem('cc_lang')  || 'ru';
let loginEmail   = '';
let pendingMagicEmail = '';

/* ─── THEME ─────────────────────────────────── */
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('cc_theme', theme);
    document.body.classList.toggle('light', theme === 'light');
    _syncSwitch('themeSwitch', theme === 'dark');
    _syncSwitch('loginThemeSwitch', theme === 'dark');
}

function toggleTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

/* ─── LANGUAGE ───────────────────────────────── */
function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('cc_lang', lang);
    _syncSwitch('langSwitch', lang === 'ru');
    _syncSwitch('loginLangSwitch', lang === 'ru');
    _applyTexts(lang);
}

function toggleLang() {
    setLang(currentLang === 'ru' ? 'en' : 'ru');
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
function requestMagicLink() {
    const input = document.getElementById('loginEmailInput');
    const email = (input ? input.value : '').trim();

    if (!email || !email.includes('@')) {
        _shakeInput(input);
        return;
    }
    pendingMagicEmail = email;
    const loginStepEmail = document.getElementById('loginStepEmail');
    const loginStepConfirm = document.getElementById('loginStepConfirm');
    if (loginStepEmail && loginStepConfirm) {
        loginStepEmail.classList.remove('active');
        loginStepConfirm.classList.add('active');
    } else {
        const emailStep = document.getElementById('loginStep1');
        const confirmStep = document.getElementById('loginStep2');
        if (emailStep) emailStep.classList.remove('active');
        if (confirmStep) confirmStep.classList.add('active');
    }

    const dot2 = document.getElementById('loginDot2');
    if (dot2) dot2.classList.add('done');

    const savedClan = localStorage.getItem('cc_clan') || sessionStorage.getItem('cc_clan') || '';
    const clanInput = document.getElementById('loginClanInput');
    const clanLabel = document.getElementById('loginClanLabel');
    if (clanInput) {
        clanInput.value = savedClan;
        clanInput.style.display = savedClan ? 'none' : '';
    }
    if (clanLabel) clanLabel.style.display = savedClan ? 'none' : '';
}

function confirmMagicLink() {
    loginEmail = pendingMagicEmail;
    if (!loginEmail) return;

    const clanInput  = document.getElementById('loginClanInput');
    const savedClan  = localStorage.getItem('cc_clan') || sessionStorage.getItem('cc_clan') || '';
    const clanName   = (clanInput && clanInput.style.display !== 'none')
        ? clanInput.value.trim()
        : savedClan;

    if (!clanName) {
        _shakeInput(clanInput);
        return;
    }

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
    const loginStepEmail = document.getElementById('loginStepEmail');
    const loginStepConfirm = document.getElementById('loginStepConfirm');
    if (loginStepEmail && loginStepConfirm) {
        loginStepConfirm.classList.remove('active');
        loginStepEmail.classList.add('active');
    } else {
        const emailStep = document.getElementById('loginStep1');
        const confirmStep = document.getElementById('loginStep2');
        if (confirmStep) confirmStep.classList.remove('active');
        if (emailStep) emailStep.classList.add('active');
    }

    const dot2 = document.getElementById('loginDot2');
    if (dot2) dot2.classList.remove('done');
    pendingMagicEmail = '';

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

function _syncSwitch(id, leftIsActive) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('is-left', leftIsActive);
    el.classList.toggle('is-right', !leftIsActive);
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

// Backward compatibility for older cached HTML handlers.
window.goStep2 = requestMagicLink;
window.doLogin = confirmMagicLink;

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

/* =============================================
   ui.js — Login, Theme, Language
   ============================================= */

// ─── ТЕКСТЫ ДЛЯ ЛОКАЛИЗАЦИИ ──────────────────
const UI_TEXTS = {
    ru: {
        loginSubtitle:  'Инструмент офицера клана для отслеживания КМ-статистики',
        loginEmailLabel:'Email',
        loginBtnText:   'Войти →',
        loginHintText:  'Для MVP — введи любой email и нажми войти',
        loginErrorEmpty:'Введи email',
        loginErrorInvalid: 'Введи корректный email',
        themeLabel:     'Тема',
        langLabel:      'Язык',
        logoutBtn:      '🚪 Выйти',
        backupBtn:      '💾 Бэкап данных',
    },
    en: {
        loginSubtitle:  'Clan officer toolkit for tracking war statistics',
        loginEmailLabel:'Email',
        loginBtnText:   'Sign In →',
        loginHintText:  'MVP mode — enter any email and press sign in',
        loginErrorEmpty:'Enter your email',
        loginErrorInvalid: 'Enter a valid email',
        themeLabel:     'Theme',
        langLabel:      'Lang',
        logoutBtn:      '🚪 Sign Out',
        backupBtn:      '💾 Backup',
    }
};

// ─── СОСТОЯНИЕ ────────────────────────────────
let currentTheme = localStorage.getItem('cc_theme') || 'dark';
let currentLang  = localStorage.getItem('cc_lang')  || 'ru';

// ─── ТЕМА ────────────────────────────────────
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('cc_theme', theme);
    document.body.classList.toggle('light', theme === 'light');

    // Синхронизируем все кнопки темы (в логине и сайдбаре)
    _syncBtn('themeDark',   'themeLight',   theme === 'dark');
    _syncBtn('loginThemeDark', 'loginThemeLight', theme === 'dark');
}

// ─── ЯЗЫК ────────────────────────────────────
function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('cc_lang', lang);

    // Синхронизируем все кнопки языка
    _syncBtn('langRu',      'langEn',      lang === 'ru');
    _syncBtn('loginLangRu', 'loginLangEn', lang === 'ru');

    // Применяем тексты
    _applyTexts(lang);
}

function _applyTexts(lang) {
    const t = UI_TEXTS[lang] || UI_TEXTS.ru;
    _setText('loginSubtitle',   t.loginSubtitle);
    _setText('loginEmailLabel', t.loginEmailLabel);
    _setText('loginBtnText',    t.loginBtnText);
    _setText('loginHintText',   t.loginHintText);
}

function _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function _syncBtn(activeId, inactiveId, isFirst) {
    const a = document.getElementById(activeId);
    const b = document.getElementById(inactiveId);
    if (a) { a.classList.toggle('active', isFirst);  }
    if (b) { b.classList.toggle('active', !isFirst); }
}

// ─── ЛОГИН ────────────────────────────────────
function doLogin() {
    const input = document.getElementById('loginEmailInput');
    const email = (input ? input.value : '').trim();
    const t = UI_TEXTS[currentLang] || UI_TEXTS.ru;

    if (!email) {
        _shakeInput(input, t.loginErrorEmpty);
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        _shakeInput(input, t.loginErrorInvalid);
        return;
    }

    // Сохраняем сессию
    sessionStorage.setItem('cc_user', email);
    localStorage.setItem('cc_user', email);

    // Показываем основной интерфейс
    _showApp(email);
}

function _showApp(email) {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.classList.add('hidden');

    // Обновляем user pill в сайдбаре
    const avatarEl = document.getElementById('sidebarUserAvatar');
    const emailEl  = document.getElementById('sidebarUserEmail');
    if (avatarEl) avatarEl.textContent = (email[0] || '?').toUpperCase();
    if (emailEl)  emailEl.textContent  = email;
}

function doLogout() {
    sessionStorage.removeItem('cc_user');
    localStorage.removeItem('cc_user');

    // Сбрасываем поле
    const input = document.getElementById('loginEmailInput');
    if (input) input.value = '';

    // Показываем логин
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.classList.remove('hidden');
}

function _shakeInput(input, message) {
    if (!input) return;
    input.style.borderColor = '#ef4444';
    input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
    input.placeholder = message;
    input.value = '';

    setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow   = '';
        const t = UI_TEXTS[currentLang] || UI_TEXTS.ru;
        input.placeholder = 'your@email.com';
    }, 1800);
}

// ─── ИНИЦИАЛИЗАЦИЯ ────────────────────────────
(function init() {
    // Применяем тему
    setTheme(currentTheme);

    // Применяем язык
    setLang(currentLang);

    // Проверяем — уже залогинен?
    const savedUser = sessionStorage.getItem('cc_user') || localStorage.getItem('cc_user');
    if (savedUser) {
        _showApp(savedUser);
    }
    // Иначе loginScreen остаётся видимым (по умолчанию)
})();

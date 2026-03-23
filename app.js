diff --git a/app.js b/app.js
index 27d8a1ef6bfe24ed124b897f9c1d1e42c874f372..2f76b99263ee50f48b8fdf1f88aac49cee765b32 100644
--- a/app.js
+++ b/app.js
@@ -3,51 +3,493 @@
             { id: 1, name: "ВИЗАРД", rank: "КЛ", profa: "Bishop", pac: "СОЛО", attendance: 100, kills: 0, deaths: 0, pvp_dmg: 0, pve_dmg: 0 }
         ];
 
         let archive = [];
         let packs = [{ id: 101, name: "ТРИЛЛИОН" }, { id: 102, name: "АРМАТУРА" }];
         
         // manualEvents теперь хранят: { id, title, date, time, done }
         let manualEvents = [];
         
         // Статус выполнения автособытий: ключ = "date|title"
         let eventStatuses = {};
         
         // Переопределения названия/времени события для конкретной даты
         let eventOverrides = {};
         
         // Временный буфер статусов и переопределений — применяется только при нажатии "Сохранить"
         let pendingStatuses = {};    // копия eventStatuses для текущего открытого дня
         let pendingOverrides = {};   // копия eventOverrides для текущего открытого дня
         
         // Статистика КМ по датам: ключ = "YYYY-MM-DD"
         let kmStats = {};
 
         let currentActivePackId = null;
         let currentSort = { field: 'name', direction: 'asc' };
         let currentDate = new Date();
-        
+        let currentLanguage = 'ru';
+        let currentTheme = 'dark';
+
+        const LANGUAGE_STORAGE_KEY = 'cc_language';
+        const THEME_STORAGE_KEY = 'cc_theme';
+        const USER_PROFILE_STORAGE_KEY = 'cc_user_profile';
+
+        // ===== ПОЛЬЗОВАТЕЛЬСКИЕ НАСТРОЙКИ / I18N / SUPABASE =====
+        // Вставь сюда свои данные проекта Supabase.
+        const SUPABASE_URL = 'YOUR_SUPABASE_URL';
+        const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
+        const SUPABASE_PROFILE_TABLE = 'profiles';
+
+        let supabaseClient = null;
+        let currentUser = null;
+        let isHydratingCloudSettings = false;
+
+        const translations = {
+            ru: {
+                locale: 'ru-RU',
+                dayNames: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
+                navSectionAnalytics: 'Аналитика',
+                navDashboard: '🏠 Дашборд',
+                navStats: '📊 Статистика',
+                navCalendar: '📅 Календарь КМ',
+                navScreenshots: '📋 История КМ',
+                navSectionManagement: 'Управление',
+                navRoster: '👥 Клан',
+                navPacks: '⚔️ Рейд Паки',
+                navArchive: '🗄️ Архив',
+                navSectionSystem: 'Система',
+                navSettings: '⚙️ Настройки',
+                backupDataBtn: '💾 Бэкап данных',
+                autoSaveText: 'Сохранено',
+                dashboardTitle: 'Дашборд',
+                calendarTitle: 'Календарь КМ',
+                rosterTitle: 'Клан',
+                packsTitle: 'Рейд Паки',
+                createPackBtn: '+ Создать пак',
+                statsTitle: 'Статистика КМ',
+                archiveTitle: 'Архив игроков',
+                settingsPageTitle: '⚙️ Настройки',
+                sidebarPreferencesTitle: '⚙️ Быстрые настройки',
+                languageLabel: 'Язык',
+                themeLabel: 'Тема',
+                authTitle: '🔐 Авторизация',
+                authDescription: 'Вход по email через magic link Supabase. Сессия сохраняется в браузере.',
+                supabaseHint: 'Перед запуском вставь свой Supabase URL и ANON KEY в app.js.',
+                authEmailLabel: 'Email',
+                authSignInBtn: '✉️ Войти по email',
+                authSignOutBtn: '↩️ Выйти',
+                profileSettingsTitle: '👤 Личный кабинет',
+                profileSettingsDescription: 'Здесь отображается email пользователя и сохраняется clan_name.',
+                profileEmailLabel: 'Email',
+                clanNameLabel: 'Clan name',
+                saveProfileBtn: '💾 Сохранить профиль',
+                authEmailPlaceholder: 'you@example.com',
+                clanNamePlaceholder: 'Мой клан',
+                authNotConfigured: 'Supabase пока не настроен: вставь URL и ANON KEY в app.js.',
+                authLoggedOut: 'Ты не авторизован.',
+                authLoggedInAs: 'Вход выполнен:',
+                authMagicLinkSent: 'Письмо со ссылкой для входа отправлено.',
+                authEnterEmail: 'Введи email для входа.',
+                authSignOutDone: 'Выход выполнен.',
+                profileSavedLocal: 'Профиль сохранён локально в браузере.',
+                profileSavedCloud: 'Профиль и настройки сохранены в Supabase.',
+                profileSyncError: 'Не удалось синхронизировать данные с Supabase.',
+                profileLoginRequired: 'Без авторизации clan_name сохраняется только локально.',
+                apiKeysTitle: '🔑 API ключи',
+                aliasesTitle: '🔗 Алиасы ников',
+                valueWeightsTitle: '⚖️ Веса ценности',
+                notificationsTitle: '🔔 Уведомления',
+                exportImportTitle: '💾 Экспорт / Импорт данных',
+                dataTitle: '🗑️ Данные',
+                themeDark: 'Dark',
+                themeLight: 'Light',
+                dayPast: '⚠️ Прошедший день',
+                dayToday: '✅ Сегодня',
+                dayFuture: '🔵 Предстоящий день'
+            },
+            en: {
+                locale: 'en-US',
+                dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
+                navSectionAnalytics: 'Analytics',
+                navDashboard: '🏠 Dashboard',
+                navStats: '📊 Statistics',
+                navCalendar: '📅 Clan Calendar',
+                navScreenshots: '📋 Clan History',
+                navSectionManagement: 'Management',
+                navRoster: '👥 Clan',
+                navPacks: '⚔️ Raid Packs',
+                navArchive: '🗄️ Archive',
+                navSectionSystem: 'System',
+                navSettings: '⚙️ Settings',
+                backupDataBtn: '💾 Backup data',
+                autoSaveText: 'Saved',
+                dashboardTitle: 'Dashboard',
+                calendarTitle: 'Clan Calendar',
+                rosterTitle: 'Clan',
+                packsTitle: 'Raid Packs',
+                createPackBtn: '+ Create pack',
+                statsTitle: 'Clan Statistics',
+                archiveTitle: 'Players Archive',
+                settingsPageTitle: '⚙️ Settings',
+                sidebarPreferencesTitle: '⚙️ Quick settings',
+                languageLabel: 'Language',
+                themeLabel: 'Theme',
+                authTitle: '🔐 Sign in',
+                authDescription: 'Email magic link sign-in via Supabase. Session is stored in the browser.',
+                supabaseHint: 'Before launch, set your Supabase URL and ANON KEY in app.js.',
+                authEmailLabel: 'Email',
+                authSignInBtn: '✉️ Sign in by email',
+                authSignOutBtn: '↩️ Sign out',
+                profileSettingsTitle: '👤 Profile',
+                profileSettingsDescription: 'Shows the current user email and stores clan_name.',
+                profileEmailLabel: 'Email',
+                clanNameLabel: 'Clan name',
+                saveProfileBtn: '💾 Save profile',
+                authEmailPlaceholder: 'you@example.com',
+                clanNamePlaceholder: 'My Clan',
+                authNotConfigured: 'Supabase is not configured yet: put URL and ANON KEY into app.js.',
+                authLoggedOut: 'You are not signed in.',
+                authLoggedInAs: 'Signed in as:',
+                authMagicLinkSent: 'Magic link email has been sent.',
+                authEnterEmail: 'Enter an email first.',
+                authSignOutDone: 'Signed out.',
+                profileSavedLocal: 'Profile saved locally in the browser.',
+                profileSavedCloud: 'Profile and preferences saved to Supabase.',
+                profileSyncError: 'Could not sync data with Supabase.',
+                profileLoginRequired: 'Without login, clan_name is stored locally only.',
+                apiKeysTitle: '🔑 API keys',
+                aliasesTitle: '🔗 Nick aliases',
+                valueWeightsTitle: '⚖️ Value weights',
+                notificationsTitle: '🔔 Notifications',
+                exportImportTitle: '💾 Export / Import data',
+                dataTitle: '🗑️ Data',
+                themeDark: 'Dark',
+                themeLight: 'Light',
+                dayPast: '⚠️ Past day',
+                dayToday: '✅ Today',
+                dayFuture: '🔵 Upcoming day'
+            }
+        };
+
+        function t(key) {
+            return translations[currentLanguage]?.[key] || translations.ru[key] || key;
+        }
+
+        function isSupabaseConfigured() {
+            return !!(
+                window.supabase &&
+                SUPABASE_URL &&
+                SUPABASE_ANON_KEY &&
+                !SUPABASE_URL.includes('YOUR_SUPABASE_URL') &&
+                !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
+            );
+        }
+
+        function getLocalProfile() {
+            try {
+                return JSON.parse(localStorage.getItem(USER_PROFILE_STORAGE_KEY) || '{"clan_name":""}');
+            } catch (e) {
+                return { clan_name: '' };
+            }
+        }
+
+        function saveLocalProfile(profile) {
+            try {
+                localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify({ clan_name: profile?.clan_name || '' }));
+            } catch (e) {}
+        }
+
+        function showSettingsStatus(id, message, isError = false) {
+            const el = document.getElementById(id);
+            if (!el) return;
+            el.style.display = message ? 'block' : 'none';
+            el.textContent = message || '';
+            el.style.borderColor = isError ? '#7f1d1d' : '';
+            el.style.color = isError ? '#fca5a5' : '';
+        }
+
+        function refreshProfileInputs() {
+            const localProfile = getLocalProfile();
+            const clanNameInput = document.getElementById('clanNameInput');
+            const profileEmailInput = document.getElementById('profileEmailInput');
+            if (clanNameInput && document.activeElement !== clanNameInput) clanNameInput.value = localProfile.clan_name || '';
+            if (profileEmailInput) profileEmailInput.value = currentUser?.email || '';
+        }
+
+        async function syncUserSettingsToSupabase(showSuccessMessage = false) {
+            if (!supabaseClient || !currentUser || isHydratingCloudSettings) return false;
+            try {
+                const localProfile = getLocalProfile();
+                const payload = {
+                    user_id: currentUser.id,
+                    email: currentUser.email,
+                    clan_name: localProfile.clan_name || '',
+                    language: currentLanguage,
+                    theme: currentTheme,
+                    updated_at: new Date().toISOString()
+                };
+                const { error } = await supabaseClient
+                    .from(SUPABASE_PROFILE_TABLE)
+                    .upsert(payload, { onConflict: 'user_id' });
+                if (error) throw error;
+                if (showSuccessMessage) showSettingsStatus('profileStatus', t('profileSavedCloud'));
+                return true;
+            } catch (e) {
+                console.warn('Supabase sync failed:', e);
+                if (showSuccessMessage) showSettingsStatus('profileStatus', t('profileSyncError'), true);
+                return false;
+            }
+        }
+
+        function updateAuthUI() {
+            const authEmailInput = document.getElementById('authEmailInput');
+            const signInBtn = document.getElementById('authSignInBtn');
+            const signOutBtn = document.getElementById('authSignOutBtn');
+            const saveProfileBtn = document.getElementById('saveProfileBtn');
+            const configured = isSupabaseConfigured();
+
+            refreshProfileInputs();
+
+            if (authEmailInput) {
+                authEmailInput.placeholder = t('authEmailPlaceholder');
+                if (!authEmailInput.value && currentUser?.email) authEmailInput.value = currentUser.email;
+            }
+            const clanNameInput = document.getElementById('clanNameInput');
+            if (clanNameInput) clanNameInput.placeholder = t('clanNamePlaceholder');
+
+            if (signInBtn) signInBtn.disabled = !configured;
+            if (signOutBtn) {
+                signOutBtn.disabled = !configured || !currentUser;
+                signOutBtn.style.opacity = (!configured || !currentUser) ? '.5' : '1';
+            }
+            if (saveProfileBtn) saveProfileBtn.disabled = false;
+
+            if (!configured) {
+                showSettingsStatus('authStatus', t('authNotConfigured'));
+            } else if (currentUser) {
+                showSettingsStatus('authStatus', `${t('authLoggedInAs')} ${currentUser.email}`);
+            } else {
+                showSettingsStatus('authStatus', t('authLoggedOut'));
+            }
+        }
+
+        function applyTheme(theme, options = {}) {
+            currentTheme = theme === 'light' ? 'light' : 'dark';
+            document.documentElement.setAttribute('data-theme', currentTheme);
+            document.body?.classList.toggle('light-theme', currentTheme === 'light');
+            document.body?.classList.toggle('dark-theme', currentTheme !== 'light');
+            try { localStorage.setItem(THEME_STORAGE_KEY, currentTheme); } catch (e) {}
+            const themeSelect = document.getElementById('themeSelect');
+            if (themeSelect) themeSelect.value = currentTheme;
+            if (!options.skipRemote) syncUserSettingsToSupabase();
+        }
+
+        function applyLanguage(language, options = {}) {
+            currentLanguage = translations[language] ? language : 'ru';
+            document.documentElement.lang = currentLanguage;
+            try { localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage); } catch (e) {}
+            const languageSelect = document.getElementById('languageSelect');
+            if (languageSelect) languageSelect.value = currentLanguage;
+            const themeSelect = document.getElementById('themeSelect');
+            if (themeSelect) {
+                const darkOption = themeSelect.querySelector('option[value="dark"]');
+                const lightOption = themeSelect.querySelector('option[value="light"]');
+                if (darkOption) darkOption.textContent = t('themeDark');
+                if (lightOption) lightOption.textContent = t('themeLight');
+            }
+            const map = {
+                navSectionAnalytics: 'navSectionAnalytics',
+                'nav-dashboard': 'navDashboard',
+                'nav-stats': 'navStats',
+                'nav-calendar': 'navCalendar',
+                'nav-screenshots': 'navScreenshots',
+                navSectionManagement: 'navSectionManagement',
+                'nav-roster': 'navRoster',
+                'nav-packs': 'navPacks',
+                'nav-archive': 'navArchive',
+                navSectionSystem: 'navSectionSystem',
+                'nav-settings': 'navSettings',
+                backupDataBtn: 'backupDataBtn',
+                autoSaveText: 'autoSaveText',
+                dashboardTitle: 'dashboardTitle',
+                calendarTitle: 'calendarTitle',
+                rosterTitle: 'rosterTitle',
+                packsTitle: 'packsTitle',
+                createPackBtn: 'createPackBtn',
+                statsTitle: 'statsTitle',
+                archiveTitle: 'archiveTitle',
+                settingsPageTitle: 'settingsPageTitle',
+                sidebarPreferencesTitle: 'sidebarPreferencesTitle',
+                languageLabel: 'languageLabel',
+                themeLabel: 'themeLabel',
+                authTitle: 'authTitle',
+                authDescription: 'authDescription',
+                supabaseHint: 'supabaseHint',
+                authEmailLabel: 'authEmailLabel',
+                authSignInBtn: 'authSignInBtn',
+                authSignOutBtn: 'authSignOutBtn',
+                profileSettingsTitle: 'profileSettingsTitle',
+                profileSettingsDescription: 'profileSettingsDescription',
+                profileEmailLabel: 'profileEmailLabel',
+                clanNameLabel: 'clanNameLabel',
+                saveProfileBtn: 'saveProfileBtn',
+                apiKeysTitle: 'apiKeysTitle',
+                aliasesTitle: 'aliasesTitle',
+                valueWeightsTitle: 'valueWeightsTitle',
+                notificationsTitle: 'notificationsTitle',
+                exportImportTitle: 'exportImportTitle',
+                dataTitle: 'dataTitle'
+            };
+            Object.entries(map).forEach(([id, key]) => {
+                const el = document.getElementById(id);
+                if (el) el.textContent = t(key);
+            });
+
+            const backupBtn = document.getElementById('backupDataBtn');
+            if (backupBtn) {
+                backupBtn.title = currentLanguage === 'ru'
+                    ? 'Скачать резервную копию всех данных'
+                    : 'Download a backup copy of all data';
+            }
+
+            updateAuthUI();
+            if (document.getElementById('calendarGrid')) renderCalendar();
+            if (activeDayDate && document.getElementById('dayModal')?.style.display === 'flex') {
+                openDayModal(activeDayDate);
+            }
+            if (!options.skipRemote) syncUserSettingsToSupabase();
+        }
+
+        async function signInWithMagicLink() {
+            if (!isSupabaseConfigured()) {
+                updateAuthUI();
+                return;
+            }
+            const email = document.getElementById('authEmailInput')?.value.trim();
+            if (!email) {
+                showSettingsStatus('authStatus', t('authEnterEmail'), true);
+                return;
+            }
+            try {
+                const { error } = await supabaseClient.auth.signInWithOtp({
+                    email,
+                    options: { emailRedirectTo: location.href.split('#')[0] }
+                });
+                if (error) throw error;
+                showSettingsStatus('authStatus', t('authMagicLinkSent'));
+            } catch (e) {
+                showSettingsStatus('authStatus', e.message || t('profileSyncError'), true);
+            }
+        }
+
+        async function signOutUser() {
+            if (!supabaseClient) return;
+            await supabaseClient.auth.signOut();
+            currentUser = null;
+            updateAuthUI();
+            showSettingsStatus('authStatus', t('authSignOutDone'));
+        }
+
+        async function saveProfileSettings() {
+            const clanName = document.getElementById('clanNameInput')?.value.trim() || '';
+            saveLocalProfile({ clan_name: clanName });
+            refreshProfileInputs();
+            if (!currentUser || !supabaseClient) {
+                showSettingsStatus('profileStatus', t('profileLoginRequired'));
+                return;
+            }
+            await syncUserSettingsToSupabase(true);
+        }
+
+        async function loadUserSettingsFromSupabase() {
+            if (!supabaseClient || !currentUser) return;
+            isHydratingCloudSettings = true;
+            try {
+                const { data, error, status } = await supabaseClient
+                    .from(SUPABASE_PROFILE_TABLE)
+                    .select('email, clan_name, language, theme')
+                    .eq('user_id', currentUser.id)
+                    .maybeSingle();
+                if (error && status !== 406) throw error;
+                if (data) {
+                    if (data.theme) applyTheme(data.theme, { skipRemote: true });
+                    if (data.language) applyLanguage(data.language, { skipRemote: true });
+                    saveLocalProfile({ clan_name: data.clan_name || '' });
+                    refreshProfileInputs();
+                } else {
+                    await syncUserSettingsToSupabase();
+                }
+            } catch (e) {
+                console.warn('Supabase load failed:', e);
+                showSettingsStatus('profileStatus', t('profileSyncError'), true);
+            } finally {
+                isHydratingCloudSettings = false;
+                updateAuthUI();
+            }
+        }
+
+        async function initSupabaseAuth() {
+            refreshProfileInputs();
+            updateAuthUI();
+            if (!isSupabaseConfigured()) return;
+
+            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
+                auth: {
+                    persistSession: true,
+                    autoRefreshToken: true,
+                    detectSessionInUrl: true
+                }
+            });
+
+            const { data: { session } } = await supabaseClient.auth.getSession();
+            currentUser = session?.user || null;
+            if (currentUser) await loadUserSettingsFromSupabase();
+            updateAuthUI();
+
+            supabaseClient.auth.onAuthStateChange(async (_event, session) => {
+                currentUser = session?.user || null;
+                if (currentUser) {
+                    await loadUserSettingsFromSupabase();
+                }
+                updateAuthUI();
+            });
+        }
+
+        function initUserPreferences() {
+            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
+            const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'ru';
+            applyTheme(savedTheme, { skipRemote: true });
+            applyLanguage(savedLanguage, { skipRemote: true });
+            refreshProfileInputs();
+
+            document.getElementById('themeSelect')?.addEventListener('change', (event) => {
+                applyTheme(event.target.value);
+            });
+            document.getElementById('languageSelect')?.addEventListener('change', (event) => {
+                applyLanguage(event.target.value);
+            });
+        }
+
         // Текущая дата открытого модального окна дня
         let activeDayDate = null;
 
         // ===== КАСТОМНЫЕ ОКНА =====
         let confirmCallback = null;
         function showConfirm(title, text, callback, isDanger = true) {
             document.getElementById('confirmTitle').innerText = title;
             document.getElementById('confirmText').innerText = text;
             const btn = document.getElementById('confirmBtn');
             btn.className = isDanger
                 ? "bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-bold"
                 : "bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold";
             confirmCallback = callback;
             document.getElementById('confirmModal').style.display = 'flex';
         }
         function closeConfirm() { document.getElementById('confirmModal').style.display = 'none'; confirmCallback = null; }
         document.getElementById('confirmBtn').onclick = () => { if (confirmCallback) confirmCallback(); closeConfirm(); };
 
         let promptCallback = null;
         function showPrompt(title, placeholder, callback, prefill) {
             document.getElementById('promptTitle').innerText = title;
             const input = document.getElementById('promptInput');
             input.placeholder = placeholder;
             input.value = prefill !== undefined ? prefill : "";
             promptCallback = callback;
@@ -135,58 +577,58 @@
             if (store[dateStr + '|' + eventKey]) return 'done';
             if (dateStr < today) return 'past';
             return 'future';
         }
 
         function getAllEventsForDate(dateStr) {
             const autoEvs = getAutoEventsForDate(dateStr).map(e => ({
                 ...e,
                 isAuto: true,
                 key: e.title
             }));
             const manuals = manualEvents
                 .filter(e => e.date === dateStr)
                 .map(e => ({ ...e, isAuto: false, key: 'manual_' + e.id }));
             return [...autoEvs, ...manuals].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
         }
 
         // ===== РЕНДЕР КАЛЕНДАРЯ =====
         function renderCalendar() {
             renderCalendarSummary();
             const grid = document.getElementById('calendarGrid');
             const label = document.getElementById('calendarMonthLabel');
             if (!grid || !label) return;
             grid.innerHTML = '';
 
-            const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
+            const daysOfWeek = translations[currentLanguage].dayNames;
             daysOfWeek.forEach(day => {
                 grid.innerHTML += `<div class="calendar-header-cell">${day}</div>`;
             });
 
             const year = currentDate.getFullYear();
             const month = currentDate.getMonth();
-            label.innerText = currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
+            label.innerText = currentDate.toLocaleString(translations[currentLanguage].locale, { month: 'long', year: 'numeric' });
 
             const firstDay = new Date(year, month, 1);
             let startOffset = firstDay.getDay() - 1;
             if (startOffset === -1) startOffset = 6;
 
             const today = todayStr();
 
             for (let i = 0; i < 42; i++) {
                 const dayNum = i - startOffset + 1;
                 const cellDate = new Date(year, month, dayNum);
                 const isCurrentMonth = cellDate.getMonth() === month;
                 const dateStr = localDateStr(cellDate);
 
                 let className = "calendar-day";
                 if (!isCurrentMonth) className += " other-month";
                 if (cellDate.toDateString() === new Date().toDateString()) className += " today";
 
                 let dotsHtml = '';
                 let eventsHtml = '';
                 let kmBadge = '';
 
                 if (isCurrentMonth) {
                     const events = getAllEventsForDate(dateStr);
                     
                     // Точки
@@ -219,58 +661,58 @@
                 grid.innerHTML += `
                     <div class="${className}" onclick="${isCurrentMonth ? `openDayModal('${dateStr}')` : ''}">
                         <div class="day-number">
                             <span>${cellDate.getDate()}</span>
                             ${dotsHtml}
                         </div>
                         <div class="flex flex-col gap-0.5">${eventsHtml}</div>
                         ${kmBadge}
                     </div>
                 `;
             }
         }
 
         function changeMonth(delta) {
             currentDate.setMonth(currentDate.getMonth() + delta);
             renderCalendar();
         }
 
         // ===== МОДАЛКА ДНЯ =====
         function openDayModal(dateStr) {
             // Закрываем любые модалки
             document.getElementById('similarNicksOverlay')?.remove();
             document.getElementById('dupesOverlay')?.remove();
             activeDayDate = dateStr;
             const dateObj = new Date(dateStr + 'T12:00:00');
-            const formatted = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
+            const formatted = dateObj.toLocaleDateString(translations[currentLanguage].locale, { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
             document.getElementById('dayModalTitle').innerText = formatted;
             
             const today = todayStr();
             let subtitle = '';
-            if (dateStr < today) subtitle = '⚠️ Прошедший день';
-            else if (dateStr === today) subtitle = '✅ Сегодня';
-            else subtitle = '🔵 Предстоящий день';
+            if (dateStr < today) subtitle = t('dayPast');
+            else if (dateStr === today) subtitle = t('dayToday');
+            else subtitle = t('dayFuture');
             document.getElementById('dayModalSubtitle').innerText = subtitle;
 
             // Инициализируем превью скриншотов для этого дня
             renderDayScreenshotPreviews(dateStr);
 
             // Копируем текущее состояние в pending-буферы для этого дня
             pendingStatuses = Object.assign({}, eventStatuses);
             pendingOverrides = Object.assign({}, eventOverrides);
 
             renderDayEventsList(dateStr);
             document.getElementById('dayModal').style.display = 'flex';
         }
 
         function renderDayEventsList(dateStr) {
             const container = document.getElementById('dayEventsList');
             const events = getAllEventsForDate(dateStr);
 
             if (events.length === 0) {
                 container.innerHTML = '<p class="text-slate-600 text-sm italic mb-2">КМ событий нет</p>';
             } else {
                 container.innerHTML = `<div class="section-label">КМ события</div>` + events.map(ev => {
                 const status = getEventStatus(dateStr, ev.key);
                 const isDone = status === 'done';
                 const doneClass = isDone ? ' is-done' : '';
                 const checkClass = isDone ? ' done' : '';
@@ -5959,51 +6401,52 @@ function getClass2IconByClass3(c3) {
                     });
                     newCount++;
                 }
             });
 
             showStatus('success', '✅', `Применено: ${updCount} обновлено, ${newCount} новых добавлено в ростер`);
             renderParsedPlayers(lastParsedPlayers);
             if (document.getElementById('page-roster').classList.contains('active')) renderRoster();
             if (document.getElementById('page-stats').classList.contains('active')) renderStats();
         }
 
         // Drag & drop на зону загрузки в модалке дня
         document.addEventListener('dragover', e => {
             if (document.getElementById('dayModal').style.display === 'flex') e.preventDefault();
         });
         document.addEventListener('drop', e => {
             if (document.getElementById('dayModal').style.display !== 'flex') return;
             e.preventDefault();
             const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
             if (!files.length) return;
             // Симулируем event
             const fakeEvent = { target: { files, value: '' } };
             handleDayScreenshots(fakeEvent);
         });
 
-        // ===== LOCAL STORAGE =====
+        // ===== LOCAL STORAGE (основные данные пока остаются локально) =====
+        // Supabase подключён поэтапно: туда уже можно синхронизировать theme/language/clan_name.
         const LS_KEY = 'clanControl_v1';
 
         function saveToStorage() {
             // Показываем индикатор сохранения
             const ind = document.getElementById('autoSaveIndicator');
             const txt = document.getElementById('autoSaveText');
             if (ind) {
                 ind.style.opacity = '1';
                 if (txt) txt.textContent = 'Сохранено';
                 clearTimeout(window._saveIndTimer);
                 window._saveIndTimer = setTimeout(() => { ind.style.opacity = '0'; }, 2000);
             }
             try {
                 const data = {
                     roster,
                     archive,
                     packs,
                     manualEvents,
                     eventStatuses,
                     eventOverrides,
                     kmStats,
                     nickAliases,
                     exhaustedKeys,
                     appliedStatsByDate,
                     playerNotes,
@@ -7449,54 +7892,56 @@ function getClass2IconByClass3(c3) {
             document.removeEventListener('keydown', _infoEscHandler);
         }
         function _infoEscHandler(e) { if (e.key === 'Escape') closeInfoModal(); }
 
         function closeOnboarding() {
             const el = document.getElementById('onboardingOverlay');
             if (el) el.style.display = 'none';
             localStorage.setItem('cc_onboarded', '1');
         }
 
         function showOnboardingIfNeeded() {
             // Показываем только если localStorage совсем пустой (первый запуск)
             const seen = localStorage.getItem('cc_onboarded');
             if (seen) return;
             // Если данные только из preload (не из реального localStorage) — показываем
             const hasRealData = localStorage.getItem('clanControl_v1') !== null;
             if (hasRealData) { localStorage.setItem('cc_onboarded', '1'); return; }
             const el = document.getElementById('onboardingOverlay');
             if (el) el.style.display = 'flex';
         }
         function showOnboarding() {
             const el = document.getElementById('onboardingOverlay');
             if (el) el.style.display = 'flex';
         }
 
-        window.onload = () => {
+        window.onload = async () => {
             loadFromStorage();
             loadNotifySettings();
             loadActionLog();
+            initUserPreferences();
+            await initSupabaseAuth();
 
             // ===== ВСТРОЕННЫЕ АЛИАСЫ — известные проблемные ники =====
             // Добавляем только если ещё нет пользовательского алиаса
             const builtinAliases = {
                 'большая шишка': 'БольшаяШишка',
                 'Большая Шишка': 'БольшаяШишка',
             };
             Object.entries(builtinAliases).forEach(([from, to]) => {
                 if (!nickAliases[from.toLowerCase()]) {
                     nickAliases[from.toLowerCase()] = to;
                     nickAliases[from] = to;
                 }
             });
 
             // ===== ОЧИСТКА РОСТЕРА ПРИ СТАРТЕ =====
             // Снимаем NEW у всех у кого есть хоть один снапшот
             const snapDates = Object.keys(appliedStatsByDate);
             if (snapDates.length > 0) {
                 roster.forEach(p => {
                     if (!p.isNew) return;
                     const key = normalizeNick(p.name);
                     const found = snapDates.some(d =>
                         appliedStatsByDate[d].players &&
                         appliedStatsByDate[d].players.some(sp => normalizeNick(sp.name) === key)
                     );

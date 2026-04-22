(function () {
    const bilingualEnPages = [
        'index.html',
        'program-level-1-foundations.html',
        'program-level-2-applied-bioinformatics.html',
        'program-level-3-vip-capstone.html',
        'program-level-x-custom-pathway.html',
        'program-undergraduate.html',
    ];

    const enToZh = Object.fromEntries(
        bilingualEnPages.map((page) => [page, page.replace(/\.html$/i, '-zh.html')]),
    );
    const zhToEn = Object.fromEntries(
        Object.entries(enToZh).map(([en, zh]) => [zh, en]),
    );

    const getCurrentFile = () => {
        const pathname = window.location.pathname;
        const last = pathname.split('/').pop();
        return last || 'index.html';
    };

    const currentFile = getCurrentFile();
    const currentLang = /-zh\.html$/i.test(currentFile) ? 'zh' : 'en';

    const convertFile = (file, targetLang) => {
        if (targetLang === 'zh') {
            return enToZh[file] || file;
        }
        return zhToEn[file] || file;
    };

    const isExternalHref = (href) => {
        const value = href.trim().toLowerCase();
        return (
            value.startsWith('http://') ||
            value.startsWith('https://') ||
            value.startsWith('//') ||
            value.startsWith('mailto:') ||
            value.startsWith('tel:') ||
            value.startsWith('javascript:')
        );
    };

    const localizeHref = (href, targetLang) => {
        if (!href || href.startsWith('#') || isExternalHref(href)) {
            return href;
        }

        const hashSplit = href.split('#');
        const baseWithQuery = hashSplit[0];
        const hash = hashSplit.length > 1 ? `#${hashSplit.slice(1).join('#')}` : '';

        const querySplit = baseWithQuery.split('?');
        const base = querySplit[0];
        const query = querySplit.length > 1 ? `?${querySplit.slice(1).join('?')}` : '';

        if (!base) {
            return href;
        }

        const segments = base.split('/');
        const file = segments.pop() || 'index.html';
        const localizedFile = convertFile(file, targetLang);
        segments.push(localizedFile);
        return `${segments.join('/')}${query}${hash}`;
    };

    // Respect language preference when equivalent page exists.
    try {
        const preferredLanguage = localStorage.getItem('preferred-language');
        if (preferredLanguage && preferredLanguage !== currentLang) {
            const preferredFile = convertFile(currentFile, preferredLanguage);
            if (preferredFile !== currentFile) {
                window.location.replace(`${preferredFile}${window.location.search}${window.location.hash}`);
                return;
            }
        }
    } catch (_) {
        // Ignore localStorage failures.
    }

    // Keep in-site links in the current language when equivalent pages exist.
    document.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        const localizedHref = localizeHref(href, currentLang);
        if (localizedHref && localizedHref !== href) {
            anchor.setAttribute('href', localizedHref);
        }
    });

    const toggle = document.querySelector('.language-toggle');
    if (!toggle) {
        return;
    }

    const targetLang = currentLang === 'zh' ? 'en' : 'zh';
    const targetFile = convertFile(currentFile, targetLang);
    toggle.textContent = targetLang === 'zh' ? '中文' : 'EN';
    toggle.setAttribute('href', `${targetFile}${window.location.hash}`);
    toggle.setAttribute(
        'aria-label',
        currentLang === 'zh' ? '切换到英文页面' : 'Switch to Chinese version',
    );

    toggle.addEventListener('click', () => {
        try {
            localStorage.setItem('preferred-language', targetLang);
        } catch (_) {
            // Ignore localStorage failures.
        }
    });
})();

(function () {
    const VERSION = 'v.0.5 // last updated 2026.05.06';

    const bar = document.createElement('div');
    bar.className = 'top-strip';
    const loc = document.createElement('span');
    loc.id = 'visitor-loc';
    loc.innerHTML = '&nbsp;';
    const ver = document.createElement('span');
    ver.className = 'version';
    ver.textContent = VERSION;
    bar.appendChild(loc);
    bar.appendChild(ver);
    document.body.insertBefore(bar, document.body.firstChild);

    (async function visitorLoc() {
        const apis = [
            { url: 'https://get.geojs.io/v1/ip/geo.json', city: 'city', region: 'region', cc: 'country_code' },
            { url: 'https://ipapi.co/json/', city: 'city', region: 'region_code', cc: 'country_code' }
        ];
        for (const api of apis) {
            try {
                const r = await fetch(api.url);
                if (!r.ok) continue;
                const d = await r.json();
                const city = d[api.city];
                if (!city) continue;
                const region = d[api.region] || d[api.cc] || '';
                const text = `${city}${region ? ', ' + region : ''}`.toLowerCase();
                loc.textContent = `visiting from ${text}`;
                return;
            } catch (e) {}
        }
    })();
})();

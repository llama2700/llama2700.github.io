const sources = [
	{ url: 'https://get.geojs.io/v1/ip/geo.json', city: 'city', region: 'region' },
	{ url: 'https://ipapi.co/json/', city: 'city', region: 'region_code' },
];

(async () => {
	for (const src of sources) {
		try {
			const geo = await (await fetch(src.url)).json();
			if (!geo[src.city])
				continue;
			const place = [geo[src.city], geo[src.region]].filter(Boolean).join(', ');
			document.getElementById('visitor').textContent = `visiting from ${place.toLowerCase()}`;
			return;
		} catch {}
	}
})();

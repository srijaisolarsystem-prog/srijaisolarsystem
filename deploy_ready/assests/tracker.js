
(function() {
    if (sessionStorage.getItem('sjs_tracked')) return;
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhHgns22q3-RFy88guyRa1iw6ExShGE9QlluHMWGLbQPqAkZyyBmfcZUKT6EL7ypYZDw/exec";

    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = "Unknown";
        if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("SamsungBrowser")) browser = "Samsung Internet";
        else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
        else if (ua.includes("Edge")) browser = "Edge";
        else if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari")) browser = "Safari";
        
        let os = "Unknown";
        if (ua.includes("Win")) os = "Windows";
        else if (ua.includes("Mac")) os = "MacOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("like Mac")) os = "iOS";

        let device = "Desktop";
        if (/Mobi|Android/i.test(ua)) device = "Mobile";
        if (/Tablet|iPad/i.test(ua)) device = "Tablet";

        return { browser: browser, os: os, device: device };
    }

    async function trackVisitor() {
        const info = getBrowserInfo();
        let ip = "Unknown";
        let location = "Unknown";

        try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
                const data = await res.json();
                ip = data.ip || "Unknown";
                location = (data.city && data.region) ? data.city + ", " + data.region + ", " + data.country_name : "Unknown";
            }
        } catch (e) {
            console.warn("Location tracking blocked or failed");
        }

        const payload = {
            page: window.location.pathname || "Home",
            ip: ip,
            location: location,
            device: info.device,
            browser: info.browser,
            os: info.os,
            referrer: document.referrer || "Direct"
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(() => {
            sessionStorage.setItem('sjs_tracked', 'true');
        }).catch(err => console.warn("Tracking failed"));
    }

    setTimeout(trackVisitor, 2000);
})();

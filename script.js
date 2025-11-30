
// ============================================
// OVERENGINEERED DYNAMIC COLOR THEME GENERATOR
// ============================================

(function() {
    // ===== COLOR SPACE UTILITIES =====
    
    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }
    
    // Convert RGB to Hex
    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    
    // Convert HSL directly to Hex
    function hslToHex(h, s, l) {
        const rgb = hslToRgb(h, s, l);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    
    // Convert Hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // ===== RELATIVE LUMINANCE (WCAG) =====
    function getRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    // ===== CONTRAST RATIO (WCAG 2.1) =====
    function getContrastRatio(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    // ===== COLOR HARMONY GENERATORS =====
    
    // Generate a random hue (0-360)
    function randomHue() {
        return Math.floor(Math.random() * 360);
    }
    
    // Complementary hue (opposite on color wheel)
    function complementaryHue(h) {
        return (h + 180) % 360;
    }
    
    // Analogous hues (adjacent on color wheel)
    function analogousHues(h, spread = 30) {
        return [(h - spread + 360) % 360, (h + spread) % 360];
    }
    
    // Triadic hues (equilateral triangle on color wheel)
    function triadicHues(h) {
        return [(h + 120) % 360, (h + 240) % 360];
    }
    
    // Split-complementary hues
    function splitComplementaryHues(h) {
        const comp = complementaryHue(h);
        return [(comp - 30 + 360) % 360, (comp + 30) % 360];
    }
    
    // ===== THEME MODE GENERATOR =====
    
    // Always dark mode - no bright light backgrounds allowed
    function randomMode() {
        return 'dark';
    }
    
    // ===== MAIN THEME GENERATOR =====
    
    function generateDynamicTheme() {
        const mode = randomMode();
        const primaryHue = randomHue();
        
        // Choose a color harmony strategy randomly
        const strategies = ['complementary', 'analogous', 'triadic', 'splitComplementary', 'monochromatic'];
        const strategy = strategies[Math.floor(Math.random() * strategies.length)];
        
        let accentHue;
        switch (strategy) {
            case 'complementary':
                accentHue = complementaryHue(primaryHue);
                break;
            case 'analogous':
                accentHue = analogousHues(primaryHue)[Math.floor(Math.random() * 2)];
                break;
            case 'triadic':
                accentHue = triadicHues(primaryHue)[Math.floor(Math.random() * 2)];
                break;
            case 'splitComplementary':
                accentHue = splitComplementaryHues(primaryHue)[Math.floor(Math.random() * 2)];
                break;
            case 'monochromatic':
                accentHue = primaryHue; // Same hue, different saturation/lightness
                break;
        }
        
        let bg, text, accent, bgCard, textGray, borderGray;
        
        if (mode === 'dark') {
            // DARK MODE - varied dark backgrounds
            // Background: very dark with subtle color tints
            const bgSaturation = Math.floor(Math.random() * 30); // 0-30%
            const bgLightness = Math.floor(Math.random() * 8 + 2); // 2-10%
            bg = hslToHex(primaryHue, bgSaturation, bgLightness);
            
            // Card background very slightly lighter
            bgCard = hslToHex(primaryHue, bgSaturation, bgLightness + 3);
            
            // Text: high lightness, can be tinted or pure white
            const textSaturation = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 50 + 30); // 0 or 30-80%
            const textLightness = Math.floor(Math.random() * 20 + 80); // 80-100%
            const textHue = textSaturation > 0 ? primaryHue : 0;
            text = hslToHex(textHue, textSaturation, textLightness);
            
            // Accent: vibrant and saturated
            const accentSaturation = Math.floor(Math.random() * 30 + 70); // 70-100%
            const accentLightness = Math.floor(Math.random() * 20 + 45); // 45-65%
            accent = hslToHex(accentHue, accentSaturation, accentLightness);
            
            // Gray text (dimmed version of text)
            textGray = hslToHex(primaryHue, Math.floor(textSaturation * 0.5), Math.floor(textLightness * 0.5));
            
            // Border gray
            borderGray = hslToHex(primaryHue, 10, 15);
            
        } else {
            // LIGHT MODE
            // Background: very light, low saturation
            const bgSaturation = Math.floor(Math.random() * 20); // 0-20%
            const bgLightness = Math.floor(Math.random() * 10 + 90); // 90-100%
            bg = hslToHex(primaryHue, bgSaturation, bgLightness);
            
            // Card background slightly darker
            bgCard = hslToHex(primaryHue, bgSaturation, bgLightness - 5);
            
            // Text: very dark
            const textSaturation = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 40 + 20);
            const textLightness = Math.floor(Math.random() * 15); // 0-15%
            const textHue = textSaturation > 0 ? primaryHue : 0;
            text = hslToHex(textHue, textSaturation, textLightness);
            
            // Accent: vibrant but readable on light background
            const accentSaturation = Math.floor(Math.random() * 30 + 60); // 60-90%
            const accentLightness = Math.floor(Math.random() * 20 + 35); // 35-55%
            accent = hslToHex(accentHue, accentSaturation, accentLightness);
            
            // Gray text
            textGray = hslToHex(primaryHue, Math.floor(textSaturation * 0.5), textLightness + 40);
            
            // Border gray
            borderGray = hslToHex(primaryHue, Math.floor(bgSaturation * 0.5), bgLightness - 20);
        }
        
        // ===== CONTRAST VALIDATION & ADJUSTMENT =====
        // Ensure text/bg contrast meets WCAG AA (4.5:1 minimum)
        let iterations = 0;
        const maxIterations = 50;
        
        while (getContrastRatio(text, bg) < 4.5 && iterations < maxIterations) {
            // Adjust text lightness to improve contrast
            const textRgb = hexToRgb(text);
            const bgRgb = hexToRgb(bg);
            const bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
            
            if (bgLum < 0.5) {
                // Dark background - make text lighter
                text = hslToHex(primaryHue, 0, Math.min(100, 80 + iterations * 2));
            } else {
                // Light background - make text darker
                text = hslToHex(primaryHue, 0, Math.max(0, 20 - iterations * 2));
            }
            iterations++;
        }
        
        // Ensure accent has decent contrast too (at least 3:1 for UI components)
        iterations = 0;
        while (getContrastRatio(accent, bg) < 3 && iterations < maxIterations) {
            const bgRgb = hexToRgb(bg);
            const bgLum = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
            
            if (bgLum < 0.5) {
                // Make accent lighter
                accent = hslToHex(accentHue, 80, Math.min(80, 50 + iterations * 3));
            } else {
                // Make accent darker
                accent = hslToHex(accentHue, 80, Math.max(20, 50 - iterations * 3));
            }
            iterations++;
        }
        
        return {
            bg,
            bgCard,
            text,
            textGray,
            accent,
            borderGray,
            mode,
            strategy,
            primaryHue,
            accentHue,
            contrastRatio: getContrastRatio(text, bg).toFixed(2),
            accentContrast: getContrastRatio(accent, bg).toFixed(2)
        };
    }
    
    // ===== APPLY THEME FUNCTION =====
    function applyTheme(theme) {
        document.documentElement.style.setProperty('--bg-black', theme.bg);
        document.documentElement.style.setProperty('--bg-dark', theme.bg);
        document.documentElement.style.setProperty('--bg-card', theme.bgCard);
        document.documentElement.style.setProperty('--text-white', theme.text);
        document.documentElement.style.setProperty('--text-light', theme.text);
        document.documentElement.style.setProperty('--text-gray', theme.textGray);
        document.documentElement.style.setProperty('--accent-green', theme.accent);
        document.documentElement.style.setProperty('--accent-red', theme.accent);
        document.documentElement.style.setProperty('--border-white', theme.text);
        document.documentElement.style.setProperty('--border-gray', theme.borderGray);
    }
    
    // ===== INITIAL THEME + GLITCH EFFECT =====
    let theme = generateDynamicTheme();
    applyTheme(theme);
    
    // Glitch effect: smooth fade transition to new theme after random delay (10ms - 1000ms)
    const glitchDelay = Math.random() * 990 + 10; // Random between 10ms and 1000ms
    setTimeout(() => {
        // Add transition for smooth fade
        document.body.style.transition = 'opacity 0.15s ease';
        document.body.style.opacity = '0.3';
        
        setTimeout(() => {
            theme = generateDynamicTheme();
            applyTheme(theme);
            document.body.style.opacity = '1';
            
            // Small secondary flicker
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.05s ease';
                document.body.style.opacity = '0.7';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                    document.body.style.transition = '';
                }, 50);
            }, 150);
        }, 150);
    }, glitchDelay);
    
    // ===== GENERATE UNIQUE SECTION COLORS =====
    // Generate distinct colors for each section using golden ratio distribution
    function generateSectionColors(numSections, bgHex) {
        const colors = [];
        const goldenRatio = 0.618033988749895;
        let hue = Math.random(); // Start with random hue
        
        for (let i = 0; i < numSections; i++) {
            hue = (hue + goldenRatio) % 1; // Golden ratio ensures max distance between hues
            const h = Math.floor(hue * 360);
            const s = 70 + Math.floor(Math.random() * 30); // 70-100% saturation
            const l = 55 + Math.floor(Math.random() * 15); // 55-70% lightness for visibility on dark bg
            
            let color = hslToHex(h, s, l);
            
            // Ensure contrast with background
            let iterations = 0;
            while (getContrastRatio(color, bgHex) < 4.5 && iterations < 20) {
                const newL = Math.min(90, l + iterations * 3);
                color = hslToHex(h, s, newL);
                iterations++;
            }
            
            colors.push({ hue: h, hex: color });
        }
        return colors;
    }
    
    const sectionColors = generateSectionColors(8, theme.bg);
    
    // Apply colors to CSS variables
    sectionColors.forEach((color, i) => {
        document.documentElement.style.setProperty(`--section-color-${i}`, color.hex);
    });
    
    // ===== GENERATE MUTED BORDER/LINE COLORS =====
    // Create muted versions of section colors for borders and boxes
    function generateMutedBorderColor(bgHex) {
        const hue = Math.floor(Math.random() * 360);
        // Muted = low saturation, medium-low lightness
        const saturation = 15 + Math.floor(Math.random() * 25); // 15-40% saturation (muted)
        const lightness = 25 + Math.floor(Math.random() * 15);  // 25-40% lightness (subtle)
        return hslToHex(hue, saturation, lightness);
    }
    
    // Generate a single muted color for all borders
    const mutedBorderColor = generateMutedBorderColor(theme.bg);
    
    // Update CSS variables for borders
    document.documentElement.style.setProperty('--border-gray', mutedBorderColor);
    
    // ===== GENERATE MUTED CIRCUIT COLOR =====
    // Create a distinct color for the circuit background (different hue from main accent)
    function generateMutedCircuitColor() {
        // Offset the hue from the accent color to make it distinct
        const hueOffset = 60 + Math.floor(Math.random() * 180); // 60-240 degrees offset
        const hue = (theme.accentHue + hueOffset) % 360;
        const saturation = 35 + Math.floor(Math.random() * 25); // 35-60% saturation (more vibrant)
        const lightness = 30 + Math.floor(Math.random() * 20);  // 30-50% lightness (brighter)
        return hslToHex(hue, saturation, lightness);
    }
    
    const circuitColor = generateMutedCircuitColor();
    document.documentElement.style.setProperty('--circuit-color', circuitColor);
    
    // Apply to sections after DOM loads
    document.addEventListener('DOMContentLoaded', () => {
        const sectionHeaders = document.querySelectorAll('.section-header h2');
        sectionHeaders.forEach((header, index) => {
            const colorIndex = index % sectionColors.length;
            header.style.color = sectionColors[colorIndex].hex;
        });
        
        // Also color the brackets to match
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            const colorIndex = index % sectionColors.length;
            const brackets = section.querySelectorAll('.bracket');
            brackets.forEach(bracket => {
                bracket.style.color = sectionColors[colorIndex].hex;
            });
        });
        
        // Color gallery sections too
        const gallerySections = document.querySelectorAll('.gallery-section .section-header h2');
        gallerySections.forEach((header, index) => {
            const colorIndex = (index + 4) % sectionColors.length; // Offset to get different colors
            header.style.color = sectionColors[colorIndex].hex;
        });
        
        const galleryBrackets = document.querySelectorAll('.gallery-section .bracket');
        galleryBrackets.forEach((bracket, index) => {
            const colorIndex = (Math.floor(index / 2) + 4) % sectionColors.length;
            bracket.style.color = sectionColors[colorIndex].hex;
        });
        
        // ===== APPLY MUTED COLOR TO ALL BOXES AND LINES =====
        // Use the same muted color for all borders (already set via CSS variable --border-gray)
        // Just ensure all elements use it consistently
        const allBorderedElements = document.querySelectorAll('.content-box, .exp-item, .project-card, .stats-box, .skill-category, .contact-box, .spotify-item, .tag, .gallery-item, .thumbnail, .lightbox-content');
        allBorderedElements.forEach(el => {
            el.style.borderColor = mutedBorderColor;
        });
        
        // Separators and section borders
        const separatorElements = document.querySelectorAll('hr, .header, .section');
        separatorElements.forEach(el => {
            el.style.borderBottomColor = mutedBorderColor;
        });
    });
    
    // ===== DEBUG OUTPUT =====
    console.log('%c╔══════════════════════════════════════════════════════════════╗', `color: ${theme.accent}`);
    console.log('%c║     OVERENGINEERED DYNAMIC THEME GENERATOR v2.1.0           ║', `color: ${theme.accent}`);
    console.log('%c╠══════════════════════════════════════════════════════════════╣', `color: ${theme.accent}`);
    console.log(`%c║  Mode: ${theme.mode.toUpperCase().padEnd(54)}║`, `color: ${theme.text}; background: ${theme.bg}`);
    console.log(`%c║  Strategy: ${theme.strategy.padEnd(50)}║`, `color: ${theme.text}; background: ${theme.bg}`);
    console.log(`%c║  Primary Hue: ${theme.primaryHue}° ${' '.repeat(47 - theme.primaryHue.toString().length)}║`, `color: ${theme.text}; background: ${theme.bg}`);
    console.log(`%c║  Accent Hue: ${theme.accentHue}° ${' '.repeat(48 - theme.accentHue.toString().length)}║`, `color: ${theme.text}; background: ${theme.bg}`);
    console.log('%c╠══════════════════════════════════════════════════════════════╣', `color: ${theme.accent}`);
    console.log(`%c║  Background: ${theme.bg}                                        ║`, `color: ${theme.bg}; background: ${theme.bg}; text-shadow: 0 0 1px ${theme.text}`);
    console.log(`%c║  Text: ${theme.text}                                              ║`, `color: ${theme.text}; background: ${theme.bg}`);
    console.log(`%c║  Accent: ${theme.accent}                                            ║`, `color: ${theme.accent}; background: ${theme.bg}`);
    console.log(`%c║  Muted Border: ${mutedBorderColor}                                      ║`, `color: ${mutedBorderColor}; background: ${theme.bg}`);
    console.log('%c╠══════════════════════════════════════════════════════════════╣', `color: ${theme.accent}`);
    console.log('%c║  Section Colors:                                             ║', `color: ${theme.accent}`);
    sectionColors.forEach((c, i) => {
        console.log(`%c║    [${i}] ${c.hex} (${c.hue}°)                                        ║`, `color: ${c.hex}; background: ${theme.bg}`);
    });
    console.log('%c╠══════════════════════════════════════════════════════════════╣', `color: ${theme.accent}`);
    console.log(`%c║  Text/BG Contrast: ${theme.contrastRatio}:1 (WCAG AA requires 4.5:1)      ║`, `color: ${parseFloat(theme.contrastRatio) >= 4.5 ? '#00ff00' : '#ff0000'}`);
    console.log(`%c║  Accent/BG Contrast: ${theme.accentContrast}:1 (UI minimum 3:1)            ║`, `color: ${parseFloat(theme.accentContrast) >= 3 ? '#00ff00' : '#ff0000'}`);
    console.log('%c╚══════════════════════════════════════════════════════════════╝', `color: ${theme.accent}`);
    
    // Store theme globally for other scripts
    window.currentTheme = theme;
    window.sectionColors = sectionColors;
})();

// Visitor counter animation (fake but fun)
document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('visitor-count');
    if (counter) {
        let count = 1337;
        // Randomly increment every few seconds for that classic web feel
        setInterval(() => {
            count += Math.floor(Math.random() * 3);
            counter.textContent = count;
        }, 5000);
    }
});

// ===== ASCII NAME TYPING ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
    const asciiArt = `    ___    __    __    _        ___    __            _ _____ 
   /   |  / /_  / /_  (_)      /   |  / /___ __   __(_) / (_)
  / /| | / __ \\/ __ \\/ /      / /| | / / __ \`/ | / / / / / / 
 / ___ |/ /_/ / / / / /      / ___ |/ / /_/ /| |/ / / / / /  
/_/  |_/_.___/_/ /_/_/      /_/  |_/_/\\__,_/ |___/_/_/_/_/   `;

    const asciiElement = document.getElementById('ascii-name');
    if (!asciiElement) return;

    let charIndex = 0;
    let currentSpeed = 0;
    
    // Random typing speed between 0.1ms and 18ms, changes every 100 characters
    function getRandomSpeed() {
        return Math.random() * 17.9 + 0.1; // 0.1-18ms
    }
    
    // Initialize first speed
    currentSpeed = getRandomSpeed();
    
    // Blinking cursor element
    const cursor = document.createElement('span');
    cursor.textContent = '█';
    cursor.style.animation = 'blink 0.7s step-end infinite';
    
    function typeNextChar() {
        if (charIndex < asciiArt.length) {
            // Change speed every 10 characters
            if (charIndex % 10 === 0) {
                currentSpeed = getRandomSpeed();
            }
            
            asciiElement.textContent += asciiArt[charIndex];
            charIndex++;
            setTimeout(typeNextChar, currentSpeed);
        } else {
            // Typing done - add final cursor that blinks then disappears
            asciiElement.appendChild(cursor);
            setTimeout(() => {
                cursor.remove();
            }, 2000);
        }
    }
    
    // Start typing animation
    typeNextChar();
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add typing effect to content box
const contentBox = document.querySelector('.content-box');
if (contentBox) {
    const paragraphs = contentBox.querySelectorAll('p:not(.blink-cursor)');
    paragraphs.forEach((p, index) => {
        p.style.opacity = '0';
        setTimeout(() => {
            p.style.transition = 'opacity 0.5s';
            p.style.opacity = '1';
        }, index * 200);
    });
}

// Random glitch effect on hover for exp items
document.querySelectorAll('.exp-item, .project-card').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;
        setTimeout(() => {
            item.style.transform = 'translate(0, 0)';
        }, 50);
    });
});

// Console easter egg 
console.log(`
%c
    ___    ____  __  ______
   /   |  / __ )/ / / /  _/
  / /| | / __  / /_/ // /  
 / ___ |/ /_/ / __  // /   
/_/  |_/_____/_/ /_/___/   

`, 'color: #00ff00; font-family: monospace;');

console.log('%c>>> WELCOME TO MY SITE <<<', 'color: #00ff00; font-size: 16px; font-weight: bold;');
console.log('%c>>> STATUS: ONLINE <<<', 'color: #00ff00; font-size: 12px;');
console.log('%c>>> BEST VIEWED IN NETSCAPE NAVIGATOR <<<', 'color: #888888; font-size: 10px;');

// Add some matrix-style random characters occasionally
const binaryChars = '01';
const teluguChars = 'అఆఇఈఉఊఋఌఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరలవశషసహళక్షఱ';
function getMatrixChar() {
    // 1% chance for Telugu, 99% binary
    if (Math.random() < 0.01) {
        return teluguChars[Math.floor(Math.random() * teluguChars.length)];
    }
    return binaryChars[Math.floor(Math.random() * binaryChars.length)];
}
function createMatrixDrop() {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim();
    const drop = document.createElement('div');
    drop.className = 'matrix-drop';
    drop.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${Math.random() * 100}vw;
        color: ${accentColor}43;
        font-family: monospace;
        font-size: ${12 + Math.random() * 8}px;
        pointer-events: none;
        z-index: 0;
        animation: fall ${2 + Math.random() * 3}s linear forwards;
    `;
    drop.textContent = getMatrixChar();
    document.body.appendChild(drop);
    
    setTimeout(() => drop.remove(), 7000);
}

// Add keyframes for matrix rain
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Spawn matrix drops 
setInterval(createMatrixDrop, 100000);

// Add click sound effect 
document.addEventListener('click', (e) => {
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim();
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 10px;
        height: 10px;
        background: ${accentColor};
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: ripple 0.3s ease-out forwards;
        z-index: 9998;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 300);
});

// Ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            width: 30px;
            height: 30px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        alert('🎮 KONAMI CODE ACTIVATED! 🎮');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// ============================================
// MONSTER CAN SPINNER
// ============================================

(function() {
    const monsterCans = [
        'images/monster_1.webp',
        'images/monster_2.webp',
        'images/monster_3.webp',
        'images/monster_4.webp',
        'images/monster_5.webp',
        'images/monster_6.webp',
        'images/monster_7.webp',
        'images/monster_8.webp',
        'images/monster_9.webp',
        'images/monster_10.webp',
        'images/monster_11.webp',
        'images/monster_12.webp',
        'images/monster_13.webp',
        'images/monster_14.webp',
        'images/monster_15.webp'
    ];
    
    const canBox = document.getElementById('monster-can-box');
    const canImg = document.getElementById('monster-can');
    const favicon = document.getElementById('favicon');
    
    if (!canBox || !canImg) return;
    
    // Set a random can on page load
    function setRandomCan() {
        const randomIndex = Math.floor(Math.random() * monsterCans.length);
        canImg.src = monsterCans[randomIndex];
        // Update favicon to match
        if (favicon) {
            favicon.href = monsterCans[randomIndex];
        }
    }
    
    // Initialize with random can
    setRandomCan();
    
    // Click to change can
    canBox.addEventListener('click', setRandomCan);
})();

// ============================================
// ASCII CIRCUIT BACKGROUND ANIMATION
// ============================================

(function() {
    const circuitBg = document.getElementById('circuit-bg');
    if (!circuitBg) return;
    
    // Simple node definitions - single line ASCII art
    // All nodes are simple single-line elements
    const nodes_defs = [
        // Two-input gates (facing right)
        { art: ['-|>|-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-]>|-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-|>]-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-|>S-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-]>I-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        // Two-input gates (facing left)
        { art: ['-|<|-'], inputs: [{ row: 0, col: 4 }], outputs: [{ row: 0, col: 0 }] },
        { art: ['-|<[-'], inputs: [{ row: 0, col: 4 }], outputs: [{ row: 0, col: 0 }] },
        { art: ['-[<|-'], inputs: [{ row: 0, col: 4 }], outputs: [{ row: 0, col: 0 }] },
        { art: ['-S<|-'], inputs: [{ row: 0, col: 4 }], outputs: [{ row: 0, col: 0 }] },
        { art: ['-I<[-'], inputs: [{ row: 0, col: 4 }], outputs: [{ row: 0, col: 0 }] },
        // Pass-through nodes
        { art: ['-| |-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-| (-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-) |-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 4 }] },
        { art: ['-||-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 3 }] },
        { art: ['-|(-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 3 }] },
        { art: ['-)|-'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 3 }] },
        // Inverter
        { art: ['---|>o---'], inputs: [{ row: 0, col: 0 }], outputs: [{ row: 0, col: 8 }] }
    ];
    
    // Wire characters
    const hWire = '─';
    const vWire = '│';
    const cornerTL = '┌';
    const cornerTR = '┐';
    const cornerBL = '└';
    const cornerBR = '┘';
    const diagDown = '\\';
    const diagUp = '/';
    
    // Store nodes with their positions
    let nodes = [];
    let wires = [];
    
    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    // Create a simple node at a position
    function createNode(x, y) {
        // Pick a random node definition
        const nodeDef = randomChoice(nodes_defs);
        
        const node = document.createElement('div');
        node.className = 'circuit-node';
        node.innerHTML = nodeDef.art.join('<br>');
        node.style.lineHeight = '1.1';
        node.style.left = x + 'px';
        node.style.top = y + 'px';
        node.style.opacity = '0';
        circuitBg.appendChild(node);
        
        // Fade in
        setTimeout(() => {
            node.style.opacity = '1';
        }, 50);
        
        // Calculate actual pixel positions of inputs/outputs
        const charWidth = 8;
        const lineHeight = 14;
        const artWidth = nodeDef.art[0].length;
        const artHeight = nodeDef.art.length;
        
        const inputPositions = nodeDef.inputs.map(inp => ({
            x: x + inp.col * charWidth,
            y: y + inp.row * lineHeight
        }));
        
        const outputPositions = nodeDef.outputs.map(out => ({
            x: x + out.col * charWidth,
            y: y + out.row * lineHeight
        }));
        
        return { 
            element: node, 
            x, 
            y, 
            inputs: inputPositions,
            outputs: outputPositions,
            width: artWidth * charWidth,
            height: artHeight * lineHeight
        };
    }
    
    // Draw a wire character at position
    function drawWireChar(x, y, char, delay) {
        setTimeout(() => {
            const wire = document.createElement('div');
            wire.className = 'circuit-wire-char';
            wire.textContent = char;
            wire.style.left = x + 'px';
            wire.style.top = y + 'px';
            circuitBg.appendChild(wire);
            wires.push(wire);
        }, delay);
    }
    
    // Draw a diagonal wire segment
    function drawDiagonalWire(x1, y1, x2, y2, startDelay) {
        const stepX = 12; // character width
        const stepY = 16; // line height
        const goingRight = x2 > x1;
        const goingDown = y2 > y1;
        const char = goingRight === goingDown ? diagDown : diagUp;
        
        let delay = startDelay;
        let x = x1;
        let y = y1;
        
        while ((goingRight ? x < x2 : x > x2) && (goingDown ? y < y2 : y > y2)) {
            drawWireChar(x, y, char, delay);
            x += goingRight ? stepX : -stepX;
            y += goingDown ? stepY : -stepY;
            delay += 20;
        }
        return { delay, x, y };
    }
    
    // Draw a horizontal wire between two x positions
    function drawHorizontalWire(x1, x2, y, startDelay) {
        const step = 12; // character width
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        let delay = startDelay;
        
        for (let x = start; x <= end; x += step) {
            drawWireChar(x, y, hWire, delay);
            delay += 20;
        }
        return delay;
    }
    
    // Draw a vertical wire between two y positions
    function drawVerticalWire(x, y1, y2, startDelay) {
        const step = 16; // line height
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        let delay = startDelay;
        
        for (let y = start; y <= end; y += step) {
            drawWireChar(x, y, vWire, delay);
            delay += 20;
        }
        return delay;
    }
    
    // Clear all elements
    function clearCircuit() {
        nodes.forEach(n => n.element.remove());
        wires.forEach(w => w.remove());
        nodes = [];
        wires = [];
    }
    
    // Check if a position is far enough from all existing nodes
    function isFarEnough(x, y, minDistX, minDistY) {
        for (const node of nodes) {
            if (Math.abs(node.x - x) < minDistX && Math.abs(node.y - y) < minDistY) {
                return false;
            }
        }
        return true;
    }
    
    // Connect an output to an input with wire routing - prefer diagonal paths
    function connectOutputToInput(outputPos, inputPos, sourceNode, targetNode, startDelay) {
        let delay = startDelay;
        
        const startX = outputPos.x;
        const startY = outputPos.y;
        const endX = inputPos.x;
        const endY = inputPos.y;
        
        const stepX = 12; // character width
        const stepY = 16; // line height
        
        // Check if a point is inside any node's bounding box (with padding)
        const padding = 25;
        function isInsideAnyNode(x, y) {
            for (const node of nodes) {
                const nodePadding = (node === sourceNode || node === targetNode) ? 5 : padding;
                if (x >= node.x - nodePadding && x <= node.x + node.width + nodePadding &&
                    y >= node.y - nodePadding && y <= node.y + node.height + nodePadding) {
                    return true;
                }
            }
            return false;
        }
        
        // Draw diagonal wire segment
        function drawDiag(x1, y1, x2, y2, startD) {
            const goingRight = x2 > x1;
            const goingDown = y2 > y1;
            const char = goingRight === goingDown ? diagDown : diagUp;
            
            let d = startD;
            let x = x1;
            let y = y1;
            
            while ((goingRight ? x < x2 : x > x2) && (goingDown ? y < y2 : y > y2)) {
                drawWireChar(x, y, char, d);
                x += goingRight ? stepX : -stepX;
                y += goingDown ? stepY : -stepY;
                d += 20;
            }
            return { delay: d, x, y };
        }
        
        // Check if diagonal path is clear
        function isDiagonalClear(x1, y1, x2, y2) {
            const goingRight = x2 > x1;
            const goingDown = y2 > y1;
            let x = x1;
            let y = y1;
            
            while ((goingRight ? x < x2 : x > x2) && (goingDown ? y < y2 : y > y2)) {
                if (isInsideAnyNode(x, y)) return false;
                x += goingRight ? stepX : -stepX;
                y += goingDown ? stepY : -stepY;
            }
            return true;
        }
        
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);
        const goingRight = endX > startX;
        const goingDown = endY > startY;
        
        // Try different routing strategies, preferring diagonals
        
        // Strategy 1: Pure diagonal if heights allow (most preferred)
        if (deltaY > 0) {
            // Calculate how much diagonal we can fit
            const diagSteps = Math.min(Math.floor(deltaX / stepX), Math.floor(deltaY / stepY));
            
            if (diagSteps > 2) {
                // Try: horizontal -> diagonal -> horizontal
                const diagX = diagSteps * stepX;
                const diagY = diagSteps * stepY;
                
                // Start with a short horizontal, then go diagonal, then finish horizontal
                const hBefore = Math.floor((deltaX - diagX) / 2);
                const midStartX = startX + (goingRight ? hBefore : -hBefore);
                const midEndX = midStartX + (goingRight ? diagX : -diagX);
                const midEndY = startY + (goingDown ? diagY : -diagY);
                
                // Check if diagonal path is clear
                if (isDiagonalClear(midStartX, startY, midEndX, midEndY)) {
                    // Draw horizontal to start of diagonal
                    if (hBefore > stepX) {
                        delay = drawHorizontalWire(startX, midStartX, startY, delay);
                    }
                    
                    // Draw diagonal
                    const diagResult = drawDiag(midStartX, startY, midEndX, midEndY, delay);
                    delay = diagResult.delay;
                    
                    // Draw remaining horizontal
                    if (Math.abs(diagResult.x - endX) > stepX) {
                        delay = drawHorizontalWire(diagResult.x, endX, diagResult.y, delay);
                    }
                    
                    // Draw remaining vertical if any
                    if (Math.abs(diagResult.y - endY) > stepY) {
                        const corner = goingRight ? 
                            (goingDown ? cornerTR : cornerBR) : 
                            (goingDown ? cornerTL : cornerBL);
                        drawWireChar(endX, diagResult.y, corner, delay);
                        delay += 20;
                        delay = drawVerticalWire(endX, diagResult.y, endY, delay);
                    }
                    
                    return delay;
                }
            }
        }
        
        // Strategy 2: Diagonal at start, then horizontal, then vertical
        if (deltaY > stepY * 2 && deltaX > stepX * 2) {
            const diagSteps = Math.min(3 + Math.floor(Math.random() * 4), Math.floor(deltaY / stepY));
            const diagX = diagSteps * stepX;
            const diagY = diagSteps * stepY;
            
            const diagEndX = startX + (goingRight ? diagX : -diagX);
            const diagEndY = startY + (goingDown ? diagY : -diagY);
            
            if (isDiagonalClear(startX, startY, diagEndX, diagEndY)) {
                // Draw diagonal from start
                const diagResult = drawDiag(startX, startY, diagEndX, diagEndY, delay);
                delay = diagResult.delay;
                
                // Draw horizontal to align with target X
                if (Math.abs(diagResult.x - endX) > stepX) {
                    delay = drawHorizontalWire(diagResult.x, endX, diagResult.y, delay);
                }
                
                // Draw vertical to target
                if (Math.abs(diagResult.y - endY) > stepY) {
                    const corner = goingRight ? cornerTR : cornerTL;
                    drawWireChar(endX, diagResult.y, corner, delay);
                    delay += 20;
                    delay = drawVerticalWire(endX, diagResult.y, endY, delay);
                }
                
                return delay;
            }
        }
        
        // Strategy 3: Horizontal, then diagonal to end
        if (deltaY > stepY * 2 && deltaX > stepX * 2) {
            const diagSteps = Math.min(3 + Math.floor(Math.random() * 4), Math.floor(deltaY / stepY));
            const diagX = diagSteps * stepX;
            const diagY = diagSteps * stepY;
            
            const diagStartX = endX - (goingRight ? diagX : -diagX);
            const diagStartY = endY - (goingDown ? diagY : -diagY);
            
            if (isDiagonalClear(diagStartX, diagStartY, endX, endY)) {
                // Draw horizontal from start
                if (Math.abs(startX - diagStartX) > stepX) {
                    delay = drawHorizontalWire(startX, diagStartX, startY, delay);
                }
                
                // Draw vertical to diagonal start
                if (Math.abs(startY - diagStartY) > stepY) {
                    const corner = goingRight ? cornerTR : cornerTL;
                    drawWireChar(diagStartX, startY, corner, delay);
                    delay += 20;
                    delay = drawVerticalWire(diagStartX, startY, diagStartY, delay);
                }
                
                // Draw diagonal to end
                const diagResult = drawDiag(diagStartX, diagStartY, endX, endY, delay);
                delay = diagResult.delay;
                
                return delay;
            }
        }
        
        // Fallback: Classic horizontal-vertical-horizontal routing
        const midX = (startX + endX) / 2;
        
        // Draw horizontal from output
        if (Math.abs(startX - midX) > stepX) {
            delay = drawHorizontalWire(startX, midX, startY, delay);
        }
        
        // Draw vertical segment
        if (Math.abs(startY - endY) > stepY) {
            const corner1 = goingRight ? 
                (goingDown ? cornerTR : cornerBR) : 
                (goingDown ? cornerTL : cornerBL);
            const corner2 = goingRight ? 
                (goingDown ? cornerBL : cornerTL) : 
                (goingDown ? cornerBR : cornerTR);
            
            drawWireChar(midX, startY, corner1, delay);
            delay += 20;
            delay = drawVerticalWire(midX, startY, endY, delay);
            drawWireChar(midX, endY, corner2, delay);
            delay += 20;
        }
        
        // Draw horizontal to input
        if (Math.abs(midX - endX) > stepX) {
            delay = drawHorizontalWire(midX, endX, endY, delay);
        }
        
        return delay;
    }
    
    // Generate a new circuit
    function generateCircuit() {
        clearCircuit();
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        const margin = 80; // Margin from edges
        const verticalPadding = 180; // Start below the hero/ASCII name section
        const minDistX = 250;
        const minDistY = 280;
        
        // Create nodes anywhere in the margins (not just far left/right)
        const nodeCount = 6 + Math.floor(Math.random() * 5); // 6-10 nodes
        let attempts = 0;
        const maxAttempts = 150;
        
        while (nodes.length < nodeCount && attempts < maxAttempts) {
            // Place nodes anywhere but avoid the center content area (roughly 400-800px from edges)
            const x = margin + Math.random() * (width - margin * 2);
            const y = verticalPadding + Math.random() * (height - verticalPadding - 100);
            
            if (isFarEnough(x, y, minDistX, minDistY)) {
                nodes.push(createNode(x, y));
            }
            attempts++;
        }
        
        // After nodes appear, connect with simple wires
        setTimeout(() => {
            let maxDelay = 0;
            
            // Simple: just connect each node to the next one
            for (let i = 0; i < nodes.length - 1; i++) {
                const fromNode = nodes[i];
                const toNode = nodes[i + 1];
                
                // Connect output of fromNode to input of toNode
                if (fromNode.outputs.length > 0 && toNode.inputs.length > 0) {
                    const endDelay = connectOutputToInput(
                        fromNode.outputs[0],
                        toNode.inputs[0],
                        fromNode,
                        toNode,
                        0
                    );
                    if (endDelay > maxDelay) maxDelay = endDelay;
                }
            }
            
            // Fade out after complete, then regenerate
            setTimeout(() => {
                nodes.forEach(n => n.element.style.opacity = '0');
                wires.forEach(w => w.style.opacity = '0');
                
                setTimeout(() => {
                    generateCircuit();
                }, 1000);
            }, maxDelay + 3000);
            
        }, 1000);
    }
    
    // Start the circuit generation
    generateCircuit();
})();

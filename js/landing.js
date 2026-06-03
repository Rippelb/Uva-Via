/* =============================================================
   js/landing.js — Landing "Crepúsculo no vinhedo"
   Módulo autocontido (sem dependências dos globais do app):
   - Nav transparente → glass no scroll
   - Botões com ripple no click (--rx/--ry)
   - Taça de vinho 3D em Three.js (LatheGeometry + PhysicalMaterial),
     gira com o scroll, pausa fora da viewport, fallback sem WebGL.
   Carregado por último no index.html, depois da Three.js (defer).
   ============================================================= */

// ---- Nav scroll state: transparent → glass blur ----
(function navScrollState() {
    const navEl = document.querySelector('.nav');
    if (!navEl) return;
    const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ---- Botões: efeito ripple no click (seta --rx/--ry pra origem radial) ----
(function buttonRipple() {
    document.querySelectorAll('.btn').forEach(b => {
        b.addEventListener('pointerdown', (e) => {
            const r = b.getBoundingClientRect();
            b.style.setProperty('--rx', (e.clientX - r.left) + 'px');
            b.style.setProperty('--ry', (e.clientY - r.top) + 'px');
            b.classList.remove('is-pressed');
            // força reflow para reiniciar a animação
            void b.offsetWidth;
            b.classList.add('is-pressed');
        });
    });
})();

// ---- Taça de vinho 3D (Three.js LatheGeometry + PhysicalMaterial) ----
// Gira sutilmente com o scroll + ambiente. Pausa via IntersectionObserver.
// Vinho com vértices animados (meniscus ondulando). Fallback se WebGL falhar.
function initGlass3D() {
    try {
        if (!window.THREE) { console.warn('[glass3d] THREE not loaded'); return; }
        const canvas = document.getElementById('glass-canvas');
        if (!canvas) return;

        // Probe WebGL
        const probe = document.createElement('canvas');
        const probeGL = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!probeGL) {
            canvas.parentElement.classList.add('glass-fallback');
            return;
        }

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.25;
        renderer.physicallyCorrectLights = true;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
        camera.position.set(0, 1.05, 6);
        camera.lookAt(0, 0.25, 0);

        // Ambiente procedural — wraparound cinza-azulado com 2 "sóis" frios
        function buildEnv() {
            const c = document.createElement('canvas');
            c.width = 1024; c.height = 512;
            const ctx = c.getContext('2d');
            const base = ctx.createLinearGradient(0, 0, 1024, 0);
            base.addColorStop(0.00, '#0e1622');
            base.addColorStop(0.20, '#e8f1f8');
            base.addColorStop(0.50, '#7d8c98');
            base.addColorStop(0.80, '#2a3a4c');
            base.addColorStop(1.00, '#0e1622');
            ctx.fillStyle = base; ctx.fillRect(0, 0, 1024, 512);
            const vert = ctx.createLinearGradient(0, 0, 0, 512);
            vert.addColorStop(0.00, 'rgba(8,14,22,.55)');
            vert.addColorStop(0.45, 'rgba(8,14,22,0)');
            vert.addColorStop(0.55, 'rgba(8,14,22,0)');
            vert.addColorStop(1.00, 'rgba(8,14,22,.65)');
            ctx.fillStyle = vert; ctx.fillRect(0, 0, 1024, 512);
            const sun = ctx.createRadialGradient(210, 235, 30, 210, 235, 320);
            sun.addColorStop(0.00, 'rgba(250,253,255,.85)');
            sun.addColorStop(0.45, 'rgba(210,228,242,.32)');
            sun.addColorStop(1.00, 'rgba(210,228,242,0)');
            ctx.fillStyle = sun; ctx.fillRect(0, 0, 1024, 512);
            const sun2 = ctx.createRadialGradient(820, 280, 20, 820, 280, 200);
            sun2.addColorStop(0.00, 'rgba(240,248,255,.55)');
            sun2.addColorStop(1.00, 'rgba(240,248,255,0)');
            ctx.fillStyle = sun2; ctx.fillRect(0, 0, 1024, 512);
            const tex = new THREE.CanvasTexture(c);
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.encoding = THREE.sRGBEncoding;
            return tex;
        }
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        scene.environment = pmrem.fromEquirectangular(buildEnv()).texture;

        // Luzes — key fria e brilhante + rim sutil + bounce frio
        scene.add(new THREE.AmbientLight(0xdce8f0, 0.32));
        const sun = new THREE.DirectionalLight(0xf2faff, 4.6); sun.position.set(-5, 4, 3.5);  scene.add(sun);
        const fillR = new THREE.DirectionalLight(0xb6c8d6, 0.9); fillR.position.set(5, 2.5, 3); scene.add(fillR);
        const top = new THREE.DirectionalLight(0xe6eef6, 1.4);   top.position.set(0, 6, 2);   scene.add(top);
        const sparkle = new THREE.PointLight(0xffffff, 2.8, 10, 1.0); sparkle.position.set(-1.5, 2.0, 3); scene.add(sparkle);
        const back = new THREE.DirectionalLight(0x8aa6c0, 1.5);  back.position.set(0, 1.5, -5);scene.add(back);
        const bounce = new THREE.PointLight(0xcfdce6, 0.35, 8);  bounce.position.set(0, -2, 2.5); scene.add(bounce);

        // Perfil da taça via curvas Bézier
        function buildGlassProfile() {
            const pts = [];
            const pushPt = (x, y) => pts.push(new THREE.Vector2(x, y));
            const sampleCurve = (curve, n, includeStart = false) => {
                const start = includeStart ? 0 : 1;
                for (let i = start; i <= n; i++) { const p = curve.getPoint(i / n); pushPt(p.x, p.y); }
            };
            // base
            pushPt(0.001, 0.000); pushPt(0.20, 0.000); pushPt(0.38, 0.000);
            pushPt(0.385, 0.008); pushPt(0.385, 0.038); pushPt(0.378, 0.050); pushPt(0.350, 0.058);
            // base → haste
            sampleCurve(new THREE.CubicBezierCurve(
                new THREE.Vector2(0.350, 0.058), new THREE.Vector2(0.30, 0.090),
                new THREE.Vector2(0.10, 0.110),  new THREE.Vector2(0.035, 0.180)
            ), 36);
            // haste
            sampleCurve(new THREE.CubicBezierCurve(
                new THREE.Vector2(0.035, 0.180), new THREE.Vector2(0.022, 0.520),
                new THREE.Vector2(0.022, 0.860), new THREE.Vector2(0.050, 1.100)
            ), 48);
            // bojo inferior
            sampleCurve(new THREE.CubicBezierCurve(
                new THREE.Vector2(0.050, 1.100), new THREE.Vector2(0.180, 1.150),
                new THREE.Vector2(0.420, 1.300), new THREE.Vector2(0.570, 1.650)
            ), 56);
            // bojo superior
            sampleCurve(new THREE.CubicBezierCurve(
                new THREE.Vector2(0.570, 1.650), new THREE.Vector2(0.580, 1.920),
                new THREE.Vector2(0.460, 2.130), new THREE.Vector2(0.420, 2.220)
            ), 48);
            // borda
            pushPt(0.425, 2.235); pushPt(0.430, 2.250);
            return pts;
        }

        function buildWineProfile() {
            const pts = [];
            const pushPt = (x, y) => pts.push(new THREE.Vector2(x, y));
            const sampleCurve = (curve, n, includeStart = false) => {
                const start = includeStart ? 0 : 1;
                for (let i = start; i <= n; i++) { const p = curve.getPoint(i / n); pushPt(p.x, p.y); }
            };
            pushPt(0.001, 1.115); pushPt(0.10, 1.120);
            sampleCurve(new THREE.CubicBezierCurve(
                new THREE.Vector2(0.10, 1.120),  new THREE.Vector2(0.22, 1.170),
                new THREE.Vector2(0.42, 1.320),  new THREE.Vector2(0.555, 1.590)
            ), 80);
            sampleCurve(new THREE.CubicBezierCurve(
                new THREE.Vector2(0.555, 1.590), new THREE.Vector2(0.40, 1.578),
                new THREE.Vector2(0.20, 1.572),  new THREE.Vector2(0.001, 1.568)
            ), 24);
            return pts;
        }

        const glassProfile = buildGlassProfile();
        const wineProfile = buildWineProfile();
        const glassGeom = new THREE.LatheGeometry(glassProfile, 128);
        glassGeom.computeVertexNormals();
        const wineGeom = new THREE.LatheGeometry(wineProfile, 160);
        wineGeom.computeVertexNormals();

        // Snapshot do vinho — usado pra animar os vértices da superfície
        const wineRest = wineGeom.attributes.position.array.slice();
        const wineVertexCount = wineGeom.attributes.position.count;
        const wineMeta = new Float32Array(wineVertexCount * 3);
        const SURFACE_Y_THRESHOLD = 1.50;
        for (let i = 0; i < wineVertexCount; i++) {
            const x = wineRest[i*3], y = wineRest[i*3+1], z = wineRest[i*3+2];
            const r = Math.hypot(x, z);
            const a = Math.atan2(z, x);
            wineMeta[i*3] = a;
            wineMeta[i*3+1] = r;
            wineMeta[i*3+2] = y > SURFACE_Y_THRESHOLD
                ? Math.min(1, (y - SURFACE_Y_THRESHOLD) / 0.10)
                : 0;
        }

        // Material do cristal — frio, alta radiância
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xf4f9ff, transmission: 1.0, thickness: 0.85,
            roughness: 0.001, metalness: 0.0, ior: 1.62,
            transparent: true, side: THREE.DoubleSide,
            envMapIntensity: 5.4,
            clearcoat: 1.0, clearcoatRoughness: 0.002,
            attenuationColor: 0xeaf4ff, attenuationDistance: 8.0,
            specularIntensity: 3.1, specularColor: 0xffffff,
            iridescence: 0.28, iridescenceIOR: 1.42,
            iridescenceThicknessRange: [120, 380],
        });
        // Material do vinho — bordô profundo, denso
        const wineMat = new THREE.MeshPhysicalMaterial({
            color: 0x2a0612, transmission: 0.06, thickness: 8.0,
            roughness: 0.22, metalness: 0.0, ior: 1.39,
            attenuationColor: 0x040002, attenuationDistance: 0.04,
            transparent: true, envMapIntensity: 0.28,
            clearcoat: 0.95, clearcoatRoughness: 0.06,
            emissive: 0x0a0204, emissiveIntensity: 0.02,
            side: THREE.DoubleSide,
        });
        const glassMesh = new THREE.Mesh(glassGeom, glassMat);
        const wineMesh = new THREE.Mesh(wineGeom, wineMat);
        glassMesh.renderOrder = 2;
        wineMesh.renderOrder = 1;

        // Sombra de contato sob a base — textura radial suave
        const sc = document.createElement('canvas');
        sc.width = 256; sc.height = 256;
        const sctx = sc.getContext('2d');
        const sgrad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        sgrad.addColorStop(0.00, 'rgba(0,0,0,0.42)');
        sgrad.addColorStop(0.25, 'rgba(0,0,0,0.26)');
        sgrad.addColorStop(0.55, 'rgba(0,0,0,0.12)');
        sgrad.addColorStop(0.80, 'rgba(0,0,0,0.04)');
        sgrad.addColorStop(1.00, 'rgba(0,0,0,0)');
        sctx.fillStyle = sgrad; sctx.fillRect(0, 0, 256, 256);
        const shadowTex = new THREE.CanvasTexture(sc);
        const contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.6, 0.45),
            new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.26 })
        );
        contactShadow.position.set(0.05, -1.08, 0);
        contactShadow.rotation.x = -Math.PI / 2;
        contactShadow.renderOrder = -1;
        scene.add(contactShadow);
        const ambientShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(3.0, 0.95),
            new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.12 })
        );
        ambientShadow.position.set(0.08, -1.085, 0);
        ambientShadow.rotation.x = -Math.PI / 2;
        ambientShadow.renderOrder = -2;
        scene.add(ambientShadow);

        const group = new THREE.Group();
        group.add(wineMesh);
        group.add(glassMesh);
        group.position.y = -1.05;
        group.rotation.x = -0.10;
        group.rotation.z =  0.06;
        scene.add(group);

        function frameGlass() {
            const fovRad = (camera.fov * Math.PI / 180);
            const aspect = camera.aspect;
            const fitH = 2.65 / (2 * Math.tan(fovRad / 2));
            const fitW = 1.55 / (2 * Math.tan(fovRad / 2) * aspect);
            const dist = Math.max(fitH, fitW) * 1.10;
            camera.position.set(0, 1.05, dist);
            camera.lookAt(0, 0.25, 0);
        }

        function resize() {
            const r = canvas.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            renderer.setSize(r.width, r.height, false);
            camera.aspect = r.width / r.height;
            camera.updateProjectionMatrix();
            frameGlass();
        }
        resize();
        if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
        else window.addEventListener('resize', resize);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let targetY = 0, currentY = 0, targetScroll = 0, currentScroll = 0, isVisible = true;
        const startTime = performance.now();

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                isVisible = entries[0].isIntersecting;
            }, { threshold: 0.01 }).observe(canvas);
        }

        function liquidNoise(angle, t, scrollPhase) {
            return (
                Math.sin(angle *  2.0 + t * 0.55 + scrollPhase * 1.0) * 0.42 +
                Math.sin(angle *  3.0 - t * 0.83 + scrollPhase * 0.7) * 0.26 +
                Math.sin(angle *  5.0 + t * 1.10 + scrollPhase * 1.4) * 0.16 +
                Math.sin(angle *  7.0 - t * 0.67 + scrollPhase * 0.5) * 0.10 +
                Math.sin(angle * 11.0 + t * 1.50 + scrollPhase * 2.1) * 0.05 +
                Math.sin(angle * 17.0 - t * 0.40 + scrollPhase * 0.9) * 0.03
            );
        }

        let normalFrame = 0;
        function deformWine(elapsed, scrollPhase) {
            const posAttr = wineGeom.attributes.position;
            const arr = posAttr.array;
            const t = elapsed;
            for (let i = 0; i < wineVertexCount; i++) {
                const baseY = wineRest[i*3+1];
                const a = wineMeta[i*3];
                const r = wineMeta[i*3+1];
                const sf = wineMeta[i*3+2];
                if (sf <= 0) continue;
                const n = liquidNoise(a, t, scrollPhase);
                const wave = Math.sin(a * 6 - t * 1.8 + scrollPhase * 0.8) * 0.30;
                const dy = (n + wave) * 0.018 * sf;
                const dr = Math.sin(a * 4 + t * 0.8 + scrollPhase * 0.6) * 0.006 * sf;
                const newR = r + dr;
                arr[i*3]   = newR * Math.cos(a);
                arr[i*3+1] = baseY + dy;
                arr[i*3+2] = newR * Math.sin(a);
            }
            posAttr.needsUpdate = true;
            if ((normalFrame++ % 4) === 0) wineGeom.computeVertexNormals();
        }

        function tick(now) {
            if (!isVisible) { requestAnimationFrame(tick); return; }
            const elapsed = (now - startTime) / 1000;
            const ambient = reduceMotion ? 0 : elapsed * 0.16;
            targetY = (window.scrollY * 0.0075) + ambient;
            currentY += (targetY - currentY) * 0.075;
            targetScroll = window.scrollY * 0.012;
            currentScroll += (targetScroll - currentScroll) * 0.08;
            group.rotation.y = currentY;
            group.rotation.x = -0.10 + Math.sin(currentY * 0.43) * 0.04;
            group.rotation.z =  0.06 + Math.sin(currentY * 0.31 + 1.4) * 0.03;
            const s = 1.0 + Math.sin(elapsed * 0.5) * 0.005;
            group.scale.setScalar(s);
            if (!reduceMotion) deformWine(elapsed, currentScroll);
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    } catch (e) {
        console.warn('[glass3d] init failed:', e.message);
        const c = document.getElementById('glass-canvas');
        if (c && c.parentElement) c.parentElement.classList.add('glass-fallback');
    }
}

// Lazy init — espera o DOM e a Three.js carregarem
(function bootGlass3D() {
    // Mobile pequeno (<600px) o CSS esconde a stage; pulamos a inicialização
    if (window.matchMedia('(max-width: 600px)').matches) return;
    // Aguarda a Three.js terminar de carregar (defer no script tag)
    function waitForTHREE(attempts = 0) {
        if (window.THREE) {
            initGlass3D();
            return;
        }
        if (attempts > 40) {
            const c = document.getElementById('glass-canvas');
            if (c && c.parentElement) c.parentElement.classList.add('glass-fallback');
            return;
        }
        setTimeout(() => waitForTHREE(attempts + 1), 100);
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        waitForTHREE();
    } else {
        document.addEventListener('DOMContentLoaded', () => waitForTHREE());
    }
})();

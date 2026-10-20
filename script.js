/**
 * Babulu Digamarti - Portfolio 3D Experience Engine
 * Three.js WebGL Scene (Interactive Quantum Core, Orbiting Satellites with 3D Text Badges, Shaders, Drag Orbit)
 * Web Audio API Sound Synthesizer, GSAP ScrollTrigger Animations, Interactive Terminal, Spotlight Tracker
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. WEB AUDIO API SYNTHESIZER (Sci-Fi Micro-Interactions)
    // =========================================================================
    let audioCtx = null;
    let sfxEnabled = false;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playHoverSound() {
        if (!sfxEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {}
    }

    function playPulseSound() {
        if (!sfxEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.35);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {}
    }

    // Audio Toggle Handler
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const soundIconOn = document.getElementById('sound-icon-on');
    const soundIconOff = document.getElementById('sound-icon-off');

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            initAudio();
            sfxEnabled = !sfxEnabled;
            if (sfxEnabled) {
                audioToggleBtn.classList.add('active');
                soundIconOn.classList.remove('hidden');
                soundIconOff.classList.add('hidden');
                playHoverSound();
            } else {
                audioToggleBtn.classList.remove('active');
                soundIconOn.classList.add('hidden');
                soundIconOff.classList.remove('hidden');
            }
        });
    }

    // =========================================================================
    // 2. LOADING SCREEN
    // =========================================================================
    const loader = document.getElementById('loader');

    function hideLoader() {
        if (loader && !loader.classList.contains('loaded')) {
            loader.classList.add('loaded');
        }
    }

    window.addEventListener('load', () => {
        setTimeout(hideLoader, 500);
    });
    setTimeout(hideLoader, 2000);

    // =========================================================================
    // 3. THREE.JS 3D SCENE (CYBER CORE, 3D TECH BADGES, DRAG INTERACTION)
    // =========================================================================
    let current3DMode = 'quantum';
    let triggerPulseShockwave = null;

    function initThreeScene() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        try {
            const testCanvas = document.createElement('canvas');
            const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
            if (!gl) {
                canvas.style.display = 'none';
                return;
            }
        } catch (e) {
            canvas.style.display = 'none';
            return;
        }

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x04060d, 0.015);

        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 34);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group container for the 3D focal object
        const focalGroup = new THREE.Group();
        scene.add(focalGroup);

        function updateFocalPosition() {
            if (window.innerWidth < 1024) {
                focalGroup.position.set(0, 5, -6);
                focalGroup.scale.set(0.8, 0.8, 0.8);
            } else {
                focalGroup.position.set(8.5, 0.5, 0);
                focalGroup.scale.set(1.15, 1.15, 1.15);
            }
        }
        updateFocalPosition();

        // -------------------------------------------------------------
        // A. INNER CRYSTALLINE CORE
        // -------------------------------------------------------------
        const coreGeometry = new THREE.IcosahedronGeometry(2.8, 1);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00f0ff,
            emissive: 0x0c1b40,
            emissiveIntensity: 0.7,
            roughness: 0.12,
            metalness: 0.3,
            transmission: 0.65,
            ior: 1.5,
            transparent: true,
            opacity: 0.88,
            wireframe: false
        });
        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        focalGroup.add(coreMesh);

        // Core Glowing Point Light
        const corePointLight = new THREE.PointLight(0x00f0ff, 3.0, 35);
        focalGroup.add(corePointLight);

        // -------------------------------------------------------------
        // B. OUTER GEODESIC CAGE (WIREFRAME)
        // -------------------------------------------------------------
        const cageGeometry = new THREE.IcosahedronGeometry(4.2, 1);
        const cageMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
        focalGroup.add(cageMesh);

        // -------------------------------------------------------------
        // C. GIMBAL / ORBITAL TECH RINGS
        // -------------------------------------------------------------
        const ringsGroup = new THREE.Group();
        focalGroup.add(ringsGroup);

        function createTechRing(radius, tube, color, rotX, rotY) {
            const geom = new THREE.TorusGeometry(radius, tube, 8, 64);
            const mat = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.4,
                roughness: 0.25,
                metalness: 0.85,
                transparent: true,
                opacity: 0.75
            });
            const ring = new THREE.Mesh(geom, mat);
            ring.rotation.x = rotX;
            ring.rotation.y = rotY;
            return ring;
        }

        const ring1 = createTechRing(5.6, 0.06, 0x00f0ff, Math.PI / 4, 0);
        const ring2 = createTechRing(6.6, 0.05, 0x8b5cf6, -Math.PI / 3, Math.PI / 6);
        const ring3 = createTechRing(7.6, 0.05, 0x38bdf8, Math.PI / 2.3, -Math.PI / 4);

        ringsGroup.add(ring1);
        ringsGroup.add(ring2);
        ringsGroup.add(ring3);

        // -------------------------------------------------------------
        // D. 3D TEXT SPRITE GENERATOR FOR SATELLITES
        // -------------------------------------------------------------
        function createTextSprite(text, colorHex) {
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = 256;
            spriteCanvas.height = 80;
            const ctx = spriteCanvas.getContext('2d');

            // Rounded Badge Background
            ctx.fillStyle = 'rgba(7, 10, 22, 0.88)';
            ctx.strokeStyle = colorHex;
            ctx.lineWidth = 4;

            const x = 8, y = 8, w = 240, h = 64, r = 20;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Glow accent dot
            ctx.fillStyle = colorHex;
            ctx.beginPath();
            ctx.arc(36, 40, 8, 0, Math.PI * 2);
            ctx.fill();

            // Text Label
            ctx.font = 'bold 28px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 56, 40);

            const texture = new THREE.CanvasTexture(spriteCanvas);
            texture.needsUpdate = true;
            const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(3.4, 1.05, 1);
            return sprite;
        }

        // -------------------------------------------------------------
        // E. ORBITING TECH SATELLITES WITH 3D BADGES
        // -------------------------------------------------------------
        const satellitesGroup = new THREE.Group();
        focalGroup.add(satellitesGroup);

        const techSatelliteData = [
            { name: 'Java', color: 0xf97316, hex: '#f97316', radius: 8.8, speed: 0.42, size: 0.48, inclination: 0.25 },
            { name: 'Python', color: 0x38bdf8, hex: '#38bdf8', radius: 9.8, speed: -0.36, size: 0.45, inclination: -0.35 },
            { name: 'React', color: 0x00f0ff, hex: '#00f0ff', radius: 10.8, speed: 0.48, size: 0.52, inclination: 0.55 },
            { name: 'FastAPI', color: 0x10b981, hex: '#10b981', radius: 11.8, speed: -0.32, size: 0.44, inclination: -0.22 },
            { name: 'AI / ML', color: 0xa855f7, hex: '#a855f7', radius: 12.8, speed: 0.38, size: 0.5, inclination: 0.7 },
            { name: 'Docker', color: 0x60a5fa, hex: '#60a5fa', radius: 13.8, speed: -0.44, size: 0.42, inclination: -0.6 }
        ];

        const satelliteMeshes = [];

        techSatelliteData.forEach((tech) => {
            const satContainer = new THREE.Group();

            // Polyhedron satellite core
            const satGeo = new THREE.OctahedronGeometry(tech.size, 0);
            const satMat = new THREE.MeshStandardMaterial({
                color: tech.color,
                emissive: tech.color,
                emissiveIntensity: 0.7,
                roughness: 0.2,
                metalness: 0.8
            });
            const satMesh = new THREE.Mesh(satGeo, satMat);
            satContainer.add(satMesh);

            // Sprite Text Badge
            const spriteBadge = createTextSprite(tech.name, tech.hex);
            spriteBadge.position.set(0, 0.9, 0);
            satContainer.add(spriteBadge);

            // Dynamic Connecting Laser Beam
            const beamMat = new THREE.LineBasicMaterial({
                color: tech.color,
                transparent: true,
                opacity: 0.28
            });
            const beamGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            const beamLine = new THREE.Line(beamGeo, beamMat);
            satellitesGroup.add(beamLine);

            satContainer.userData = {
                data: tech,
                angle: Math.random() * Math.PI * 2,
                mesh: satMesh,
                beamLine: beamLine
            };

            satellitesGroup.add(satContainer);
            satelliteMeshes.push(satContainer);
        });

        // -------------------------------------------------------------
        // F. 3D PARTICLE SPACE NEBULA
        // -------------------------------------------------------------
        const particleCount = 1000;
        const particleGeo = new THREE.BufferGeometry();
        const pPositions = new Float32Array(particleCount * 3);
        const pColors = new Float32Array(particleCount * 3);

        const colorCyan = new THREE.Color(0x00f0ff);
        const colorPurple = new THREE.Color(0x8b5cf6);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            pPositions[i3] = (Math.random() - 0.5) * 95;
            pPositions[i3 + 1] = (Math.random() - 0.5) * 75;
            pPositions[i3 + 2] = (Math.random() - 0.5) * 65;

            const mixed = colorCyan.clone().lerp(colorPurple, Math.random());
            pColors[i3] = mixed.r;
            pColors[i3 + 1] = mixed.g;
            pColors[i3 + 2] = mixed.b;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.13,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // -------------------------------------------------------------
        // G. 3D CYBER HORIZON WAVE GRID
        // -------------------------------------------------------------
        const gridGeo = new THREE.PlaneGeometry(90, 90, 36, 36);
        const gridMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        gridMesh.rotation.x = -Math.PI / 2.2;
        gridMesh.position.y = -16;
        gridMesh.position.z = -10;
        scene.add(gridMesh);

        // -------------------------------------------------------------
        // H. SHOCKWAVE PULSE EXPANSION SYSTEM
        // -------------------------------------------------------------
        const shockwaveRings = [];
        function createShockwave() {
            playPulseSound();
            const ringGeo = new THREE.RingGeometry(2.5, 2.9, 36);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide
            });
            const shockRing = new THREE.Mesh(ringGeo, ringMat);
            shockRing.rotation.x = Math.PI / 2;
            shockRing.position.copy(focalGroup.position);
            scene.add(shockRing);

            shockwaveRings.push({
                mesh: shockRing,
                scale: 1,
                opacity: 0.85
            });

            gsap.to(corePointLight, {
                intensity: 6.5,
                duration: 0.15,
                yoyo: true,
                repeat: 1
            });
        }
        triggerPulseShockwave = createShockwave;

        const btnPulse = document.getElementById('btn-pulse-core');
        if (btnPulse) {
            btnPulse.addEventListener('click', () => {
                createShockwave();
            });
        }

        // -------------------------------------------------------------
        // I. LIGHTING
        // -------------------------------------------------------------
        const ambientLight = new THREE.AmbientLight(0x0e172e, 1.4);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
        dirLight.position.set(12, 22, 18);
        scene.add(dirLight);

        const mousePointLight = new THREE.PointLight(0x8b5cf6, 1.8, 45);
        mousePointLight.position.set(0, 0, 15);
        scene.add(mousePointLight);

        // -------------------------------------------------------------
        // J. MOUSE PARALLAX & DRAG-TO-ROTATE INTERACTION
        // -------------------------------------------------------------
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let dragVelocity = { x: 0, y: 0 };
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            mousePointLight.position.x = targetMouseX * 18;
            mousePointLight.position.y = -targetMouseY * 12;

            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                focalGroup.rotation.y += deltaX * 0.008;
                focalGroup.rotation.x += deltaY * 0.008;

                dragVelocity.x = deltaX * 0.008;
                dragVelocity.y = deltaY * 0.008;

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        }, { passive: true });

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        canvas.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                const deltaY = e.touches[0].clientY - previousMousePosition.y;
                focalGroup.rotation.y += deltaX * 0.008;
                focalGroup.rotation.x += deltaY * 0.008;
                dragVelocity.x = deltaX * 0.008;
                dragVelocity.y = deltaY * 0.008;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, { passive: true });

        // -------------------------------------------------------------
        // K. 3D MODE SWITCHING
        // -------------------------------------------------------------
        const modeButtons = document.querySelectorAll('.btn-3d-mode');
        modeButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.getAttribute('data-mode');
                set3DMode(mode);
                playHoverSound();
            });
        });

        function set3DMode(mode) {
            current3DMode = mode;
            if (mode === 'quantum') {
                gsap.to(coreMaterial, { opacity: 0.88, wireframe: false, duration: 0.5 });
                gsap.to(cageMaterial, { opacity: 0.4, duration: 0.5 });
                gsap.to(ringsGroup.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                gsap.to(satellitesGroup.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                gridMesh.visible = true;
            } else if (mode === 'neural') {
                gsap.to(coreMaterial, { opacity: 0.25, wireframe: true, duration: 0.5 });
                gsap.to(cageMaterial, { opacity: 0.65, duration: 0.5 });
                gsap.to(satellitesGroup.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.5 });
                gsap.to(ringsGroup.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.5 });
                createShockwave();
            } else if (mode === 'wireframe') {
                gsap.to(coreMaterial, { opacity: 0.9, wireframe: true, duration: 0.5 });
                gsap.to(cageMaterial, { opacity: 0.8, duration: 0.5 });
                gsap.to(ringsGroup.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.5 });
                gridMat.opacity = 0.22;
                gridMesh.visible = true;
            }
        }

        // -------------------------------------------------------------
        // L. SCROLL-DRIVEN CAMERA CHOREOGRAPHY
        // -------------------------------------------------------------
        let targetCameraZ = 34;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(scrollY / Math.max(docHeight, 1), 1);
            targetCameraZ = 34 + scrollProgress * 12;
        }, { passive: true });

        // -------------------------------------------------------------
        // M. ANIMATION LOOP
        // -------------------------------------------------------------
        const clock = new THREE.Clock();

        function renderLoop() {
            requestAnimationFrame(renderLoop);
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();

            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            camera.position.x = mouseX * 2.5;
            camera.position.y = -mouseY * 1.8;
            camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
            camera.lookAt(0, 0, 0);

            if (!isDragging) {
                focalGroup.rotation.y += dragVelocity.x;
                focalGroup.rotation.x += dragVelocity.y;
                dragVelocity.x *= 0.92;
                dragVelocity.y *= 0.92;
                focalGroup.rotation.y += 0.003;
            }

            const pulseScale = 1 + Math.sin(elapsed * 2.2) * 0.04;
            coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
            coreMesh.rotation.y -= 0.006;
            cageMesh.rotation.y += 0.004;
            cageMesh.rotation.z += 0.002;

            ring1.rotation.z += 0.008;
            ring2.rotation.z -= 0.01;
            ring3.rotation.x += 0.006;

            satelliteMeshes.forEach((satGroup) => {
                const data = satGroup.userData.data;
                satGroup.userData.angle += data.speed * delta;
                const angle = satGroup.userData.angle;

                const posX = Math.cos(angle) * data.radius;
                const posZ = Math.sin(angle) * data.radius;
                const posY = Math.sin(angle * 2) * (data.radius * 0.25) + (data.inclination * 3);

                satGroup.position.set(posX, posY, posZ);
                satGroup.userData.mesh.rotation.x += 0.02;
                satGroup.userData.mesh.rotation.y += 0.03;

                const positions = satGroup.userData.beamLine.geometry.attributes.position.array;
                positions[0] = 0;
                positions[1] = 0;
                positions[2] = 0;
                positions[3] = posX;
                positions[4] = posY;
                positions[5] = posZ;
                satGroup.userData.beamLine.geometry.attributes.position.needsUpdate = true;
            });

            particles.rotation.y = elapsed * 0.015;

            const gridPos = gridGeo.attributes.position;
            for (let i = 0; i < gridPos.count; i++) {
                const u = gridPos.getX(i);
                const v = gridPos.getY(i);
                const z = Math.sin(u * 0.15 + elapsed) * Math.cos(v * 0.15 + elapsed) * 0.8;
                gridPos.setZ(i, z);
            }
            gridPos.needsUpdate = true;

            for (let i = shockwaveRings.length - 1; i >= 0; i--) {
                const sw = shockwaveRings[i];
                sw.scale += delta * 18;
                sw.opacity -= delta * 1.2;
                sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
                sw.mesh.material.opacity = Math.max(sw.opacity, 0);

                if (sw.opacity <= 0) {
                    scene.remove(sw.mesh);
                    sw.mesh.geometry.dispose();
                    sw.mesh.material.dispose();
                    shockwaveRings.splice(i, 1);
                }
            }

            renderer.render(scene, camera);
        }

        renderLoop();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            updateFocalPosition();
        });
    }

    initThreeScene();

    // =========================================================================
    // 4. SPOTLIGHT CURSOR TRACKER
    // =========================================================================
    function initSpotlightTracker() {
        const spotlightElements = document.querySelectorAll(
            '.skill-category-card, .project-showcase-card, .timeline-card, .edu-card, .contact-card, .narrative-card'
        );

        spotlightElements.forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    initSpotlightTracker();

    // =========================================================================
    // 5. INTERACTIVE TERMINAL CODE TABS
    // =========================================================================
    function initTerminalTabs() {
        const tabs = document.querySelectorAll('.term-tab');
        const codeBlocks = document.querySelectorAll('.code-block');
        const copyBtn = document.getElementById('btn-copy-terminal');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                codeBlocks.forEach(b => b.classList.remove('active'));

                tab.classList.add('active');
                const targetId = `code-${tab.getAttribute('data-tab')}`;
                const targetBlock = document.getElementById(targetId);
                if (targetBlock) {
                    targetBlock.classList.add('active');
                }
                playHoverSound();
            });
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const activeBlock = document.querySelector('.code-block.active');
                if (activeBlock) {
                    const text = activeBlock.textContent;
                    navigator.clipboard.writeText(text).then(() => {
                        const originalText = copyBtn.querySelector('span').textContent;
                        copyBtn.querySelector('span').textContent = 'Copied!';
                        playHoverSound();
                        setTimeout(() => {
                            copyBtn.querySelector('span').textContent = originalText;
                        }, 2000);
                    });
                }
            });
        }
    }

    initTerminalTabs();

    // =========================================================================
    // 6. DYNAMIC ROLE ROTATOR (TYPEWRITER)
    // =========================================================================
    function initRoleTypewriter() {
        const roleEl = document.getElementById('typewriter-role');
        if (!roleEl) return;

        const roles = [
            'Full Stack & AI Engineer',
            'Java & Python Backend Developer',
            'Automated QA & Test Architect',
            'FastAPI & Microservices Specialist'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 90;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                roleEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 45;
            } else {
                roleEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 90;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2200;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 800);
    }

    initRoleTypewriter();

    // =========================================================================
    // 7. VANILLA TILT INITIALIZATION
    // =========================================================================
    function initTilt() {
        if (typeof VanillaTilt !== 'undefined' && window.innerWidth >= 768) {
            const tiltElements = document.querySelectorAll('[data-tilt]');
            VanillaTilt.init(tiltElements, {
                max: 6,
                speed: 400,
                glare: true,
                'max-glare': 0.15,
                perspective: 1000
            });
        }
    }

    initTilt();

    // =========================================================================
    // 8. HEADER & NAVIGATION
    // =========================================================================
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('overlay');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const overlayLinks = document.querySelectorAll('.overlay-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    if (menuBtn && overlay) {
        menuBtn.addEventListener('click', () => {
            overlay.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            playHoverSound();
        });
    }

    if (closeOverlayBtn && overlay) {
        closeOverlayBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    }

    overlayLinks.forEach((link) => {
        link.addEventListener('click', () => {
            overlay.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.pageYOffset + 140;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    document.querySelectorAll('.btn, .nav-link, .btn-3d-mode, .social-chip, .tech-badge').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });

    // =========================================================================
    // 9. GSAP SCROLLTRIGGER REVEALS (ROBUST & NON-BLOCKING)
    // =========================================================================
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Section Headers Reveal
        gsap.utils.toArray('.section-header').forEach((hdr) => {
            gsap.fromTo(hdr,
                { y: 25, opacity: 0.3 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: hdr,
                        start: 'top 95%',
                        once: true
                    }
                }
            );
        });

        // Cards and Interactive Elements Reveal
        const animatedCards = document.querySelectorAll(
            '.skill-category-card, .project-showcase-card, .timeline-item, .edu-card, .contact-card'
        );

        animatedCards.forEach((card) => {
            gsap.fromTo(card,
                { y: 25, opacity: 0.4 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 95%',
                        once: true
                    }
                }
            );
        });

        // Refresh triggers on full window load
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    initScrollAnimations();

    // =========================================================================
    // 10. CONTACT FORM HANDLER
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (contactForm && feedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                feedback.textContent = 'Please fill out all fields.';
                feedback.className = 'form-feedback-msg error';
                return;
            }

            const submitBtn = document.getElementById('btn-submit-msg');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Transmitting...</span>';
            }

            setTimeout(() => {
                feedback.textContent = 'Transmission received! Opening your email client to complete dispatch...';
                feedback.className = 'form-feedback-msg success';

                const mailtoUrl = `mailto:babulu8520@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
                window.location.href = mailtoUrl;

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        Message Sent
                    `;
                }

                contactForm.reset();
            }, 800);
        });
    }

})();
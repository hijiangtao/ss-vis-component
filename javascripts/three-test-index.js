// settings
var timeStep = (1/60);
var confettiCount = 150000;

var container;
var camera, scene, renderer, stats;
var controls;

var shaderUniforms, shaderAttributes, confettiMaterial;

var time = 0;

init();
tick();

function init() {
    createScene();
    createControls();
    createGrid();
    createConfettiMaterial();
    createConfettiPartycles();

    window.addEventListener('resize', onWindowResize, false);
}

function createScene() {
    container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(3.2474970423896035, 0.992230956080686, -3.2128363683730874);
    //camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({alpha:false, premultipliedAlpha:false, stencil:false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf5f5f5, 1);

    container.appendChild(renderer.domElement);

    // STATS1

    stats = new Stats();

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );
}

function createControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function createConfettiMaterial() {
    shaderAttributes = {
        aAnimation: {type: "v2", value: null},
        aTranslation: {type: "v3", value: null},
        aControlPoint0: {type: "v3", value: null},
        aControlPoint1: {type: "v3", value: null},
        aAxisAngle: {type: "v4", value: null},
        aFrontColor: {type: "c", value: null},
        aBackColor: {type: "c", value: null}
    };

    shaderUniforms = {
        uTime: {type: "f", value: 0}
    };

    confettiMaterial = new THREE.ShaderMaterial({
        attributes: shaderAttributes,
        uniforms: shaderUniforms,
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
    });
    confettiMaterial.side = THREE.DoubleSide;
}

function createConfettiPartycles() {
    var quads = confettiCount;
    var triangles = quads * 2;
    var chunkSize = 21845; // I don't remember why I chose this specific value :(
    var i, j;

    var geometry = new THREE.BufferGeometry();
    // used to form rectangles
    geometry.addAttribute('index', new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1));
    // duration and delay of the animation
    geometry.addAttribute('aAnimation', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 2), 2)); // duration, delay
    // the start position (0, 0, 0) for each piece of confetti
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3)); // aStartPosition
    // the translation (delta movement) for each piece of confetti
    geometry.addAttribute('aTranslation', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3));
    // each piece of confetti will follow a bezier curve from start to end (start + translation) through the 2 control points
    geometry.addAttribute('aControlPoint0', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3));
    geometry.addAttribute('aControlPoint1', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3));
    // an axis (x, y, z) and angle (0-2PI) which will be used to calculate rotation
    geometry.addAttribute('aAxisAngle', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 4), 4));
    // colors!
    geometry.addAttribute('aFrontColor', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3));
    geometry.addAttribute('aBackColor', new THREE.BufferAttribute(new Float32Array(triangles * 3 * 3), 3));

    // index buffer?
    var indices = geometry.attributes.index.array;

    for (i = 0; i < indices.length; i++) {
        indices[i] = i % (3 * chunkSize);
    }

    // buffer animation vars
    var animation = geometry.attributes.aAnimation.array;

    for (i = 0; i < animation.length; i += 12) {

        var delay = randomRange(0, 4);
        var duration = randomRange(6, 10);

        for (j = 0; j < 12; j += 2) {
            // delay
            animation[i + j + 0] = delay;
            // duration
            animation[i + j + 1] = duration;
        }
    }

    // buffer start positions
    var positions = geometry.attributes.position.array;
    var halfWidth = 0.02;
    var halfHeight = halfWidth * 0.6;
    var a = new THREE.Vector3(-halfWidth, halfHeight, 0); // top-left
    var b = new THREE.Vector3(halfWidth, halfHeight, 0); // top-right
    var c = new THREE.Vector3(halfWidth, -halfHeight, 0); // bottom-right
    var d = new THREE.Vector3(-halfWidth, -halfHeight, 0); // bottom-left
    var vertices = [a, d, b, d, c, b], v;

    for (i = 0; i < positions.length; i += 18) {
        v = 0;

        for (j = 0; j < 18; j += 3) {
            positions[i + j + 0] = vertices[v].x;
            positions[i + j + 1] = vertices[v].y;
            positions[i + j + 2] = vertices[v].z;

            v++;
        }
    }

    // buffer translation
    var translations = geometry.attributes.aTranslation.array;
    var t = new THREE.Vector3();

    for (i = 0; i < translations.length; i += 18) {
        var phi = Math.random() * Math.PI * 2;
        var radius = 4;
        var x1 = randomRange(-4, 4);
        var y1 = 0;
        var z1 = randomRange(-4, 4);

        t.x = x1 + radius * Math.cos(phi) * Math.random();
        t.z = z1 + radius * Math.sin(phi) * Math.random();

        for (j = 0; j < 18; j += 3) {
            translations[i + j + 0] = t.x;
            translations[i + j + 1] = t.y;
            translations[i + j + 2] = t.z;
        }
    }

    // buffer control points
    var controlPoints0 = geometry.attributes.aControlPoint0.array;
    var controlPoints1 = geometry.attributes.aControlPoint1.array;
    var cp0 = new THREE.Vector3();
    var cp1 = new THREE.Vector3();

    for (i = 0; i < controlPoints0.length; i += 18) {
        cp0.x = randomRange(-1, 1);
        cp0.y = randomRange(6, 10);
        cp0.z = randomRange(-1, 1);

        cp1.x = randomRange(-8, 8);
        cp1.y = randomRange(2, 10);
        cp1.z = randomRange(-8, 8);

        for (j = 0; j < 18; j += 3) {
            controlPoints0[i + j + 0] = cp0.x;
            controlPoints0[i + j + 1] = cp0.y;
            controlPoints0[i + j + 2] = cp0.z;

            controlPoints1[i + j + 0] = cp1.x;
            controlPoints1[i + j + 1] = cp1.y;
            controlPoints1[i + j + 2] = cp1.z;
        }
    }

    // buffer axis and angle
    var axisAngles = geometry.attributes.aAxisAngle.array;
    var a = new THREE.Vector3();

    for (i = 0; i < axisAngles.length; i += 24) {
        // axis
        a.x = Math.random();
        a.y = 0;
        a.z = Math.random();
        a.normalize();
        // angle
        a.w = Math.PI * randomRange(20, 60);

        for (j = 0; j < 24; j += 4) {
            axisAngles[i + j + 0] = a.x;
            axisAngles[i + j + 1] = a.y;
            axisAngles[i + j + 2] = a.z;
            axisAngles[i + j + 3] = a.w;
        }
    }

    // buffer colors
    var frontColors = geometry.attributes.aFrontColor.array;
    var backColors = geometry.attributes.aBackColor.array;

    var hue = 0;
    var front = new THREE.Color();
    var back = new THREE.Color();

    for (i = 0; i < frontColors.length; i += 18) {
        hue = Math.random();
        front.setHSL(hue, 1.0, 0.5);
        // make the back color darker
        back.setHSL(hue, 0.65, 0.5);

        for (j = 0; j < 18; j += 3) {
            frontColors[i + j + 0] = front.r;
            frontColors[i + j + 1] = front.g;
            frontColors[i + j + 2] = front.b;

            backColors[i + j + 0] = back.r;
            backColors[i + j + 1] = back.g;
            backColors[i + j + 2] = back.b;
        }
    }

    // store offsets
    var offsets = triangles / chunkSize;

    for (i = 0; i < offsets; i++) {
        var offset = {
            start: i * chunkSize * 3,
            index: i * chunkSize * 3,
            count: Math.min(triangles - (i * chunkSize), chunkSize) * 3
        };

        geometry.drawcalls.push(offset);
    }

    var mesh = new THREE.Mesh(geometry, confettiMaterial);
    // mesh.position.x = -5;
    // mesh.position.y = -1;

    scene.add(mesh);
}

function createGrid() {
    var grid = new THREE.GridHelper(10, 1);
    grid.setColors(0xc1c1c1, 0xc1c1c1);
    scene.add(grid);
}

function tick() {
    requestAnimationFrame(tick);

    update();
    render();
}

function update() {
    // time is the only value that is updated at runtime
    // this way the gpu can number-crunch the bezier path movement and rotations without being interrupted
    shaderUniforms.uTime.value = time;
    shaderUniforms.uTime.needsUpdate = true;

    time += timeStep;
    time %= 14; // make it loop

    controls.update();

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
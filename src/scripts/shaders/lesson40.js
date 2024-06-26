import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import particlesVertexShader from '../../shaders/40/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/40/particles/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Materials
    if (particles) {
        particles.material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
    }

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8 * 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)

/**
 * Particles
 */
let particles = null

const customUniforms = {
    uTime: { value: 0 },
}

const mat = new THREE.ShaderMaterial()


//Load models
gltfLoader.load('./models.glb', (gltf) => {
    particles = {}
    particles.index = 1

    //positions
    const positions = gltf.scene.children.map(child => child.geometry.attributes.position)
    particles.maxCount = 0
    for (const position of positions) {
        if (position.count > particles.maxCount) {
            particles.maxCount = position.count
        }
    }
    particles.positions = []
    for (const position of positions) {
        const originalArray = position.array
        const newArray = new Float32Array(particles.maxCount * 3)

        for (let i = 0; i < particles.maxCount; i++) {
            const i3 = i * 3

            if (i3 < originalArray.length) {
                newArray[i3] = originalArray[i3]
                newArray[i3 + 1] = originalArray[i3 + 1]
                newArray[i3 + 2] = originalArray[i3 + 2]
            } else {
                const randomIndex = Math.floor(position.count * Math.random()) * 3

                newArray[i3] = originalArray[randomIndex]
                newArray[i3 + 1] = originalArray[randomIndex + 1]
                newArray[i3 + 2] = originalArray[randomIndex + 2]
            }
        }
        particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
    }

    // Geometry
    particles.geometry = new THREE.BufferGeometry(3)

    const sizesArray = new Float32Array(particles.maxCount)
    for (let i = 0; i < particles.maxCount; i++) {
        sizesArray[i] = Math.random()
    }

    particles.geometry.setAttribute('position', particles.positions[particles.index])
    particles.geometry.setAttribute('aPositionTarget', particles.positions[3])
    particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))
    // particles.geometry.setIndex(null)//have sense to delete on embed three geometry, not model by blender

    // Material
    particles.colorA = '#ff00ea'
    particles.colorB = '#0091ff'

    particles.material = new THREE.ShaderMaterial({
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        blending: THREE.AdditiveBlending,//important
        depthWrite: false,//to fix not transparent edges
        uniforms:
        {
            uSize: new THREE.Uniform(0.3),
            uProgress: new THREE.Uniform(0.0),
            uTime: new THREE.Uniform(customUniforms.uTime.value),
            uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
            uColorA: new THREE.Uniform(new THREE.Color(particles.colorA)),
            uColorB: new THREE.Uniform(new THREE.Color(particles.colorB)),
        }
    })

    //morph

    particles.morph = (index) => {
        // Update attributes
        particles.geometry.attributes.position = particles.positions[particles.index]
        particles.geometry.attributes.aPositionTarget = particles.positions[index]

        // Animate uProgress
        gsap.fromTo(
            particles.material.uniforms.uProgress,
            { value: 0 },
            { value: 1, duration: 3, ease: 'linear' }
        )

        particles.index = index
    }

    particles.torus = () => { particles.morph(0) }
    particles.suzanne = () => { particles.morph(1) }
    particles.sphere = () => { particles.morph(2) }
    particles.three = () => { particles.morph(3) }

    //tweaks
    gui.addColor(particles, 'colorA').onChange(() => { particles.material.uniforms.uColorA.value.set(particles.colorA) })
    gui.addColor(particles, 'colorB').onChange(() => { particles.material.uniforms.uColorB.value.set(particles.colorB) })
    gui.add(particles.material.uniforms.uProgress, 'value', 0, 1, 0.01).name('progress').listen()
    gui.add(particles, 'torus')
    gui.add(particles, 'suzanne')
    gui.add(particles, 'sphere')
    gui.add(particles, 'three')

    // Points
    particles.points = new THREE.Points(particles.geometry, particles.material)
    particles.points.frustumCulled = false
    scene.add(particles.points)
})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    if (particles) {
        particles.material.uniforms.uTime.value = elapsedTime
    }

    // Update controls
    controls.update()

    // Render normal scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
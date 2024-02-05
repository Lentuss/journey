import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('textures/particles/4.png')

/**
 * Particles
 */

//geometry
// const particlesGeometry = new THREE.SphereGeometry();
const particlesGeometry = new THREE.BufferGeometry();
const count = 10000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

console.time('particles')

for (let i = 0; i <= count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

console.timeEnd('particles')

particlesGeometry.setAttribute(
    'position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute(
    'color', new THREE.BufferAttribute(colors, 3))

//material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
});

// particlesMaterial.size = 0.02
// particlesMaterial.color = new THREE.Color('aqua')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particlesTexture//to hide square edges
particlesMaterial.vertexColors = true //important to add different colors to particles


// important !

// particlesMaterial.alphaTest = 0.001//to hide black in edges (first solution)
// particlesMaterial.depthTest = false//to hide black in edges (second solution) only if you have the same color particles
particlesMaterial.depthWrite = false//to hide black in edges (third solution) good solution

//fourth solution - blending
particlesMaterial.blending = THREE.AdditiveBlending

// console.log(particlesGeometry.attributes.position)

//particles

const particles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //update particles
    // particles.rotation.y = elapsedTime * 0.02

    //bad way to animate to change positions in particles array (it can be used only for small count of particles because of bad performance)

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }

    particlesGeometry.attributes.position.needsUpdate = true


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {

    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //udate renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//переход в полноэкранный режим по двойному клику

window.addEventListener('dblclick', () => {

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        } else {

        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})
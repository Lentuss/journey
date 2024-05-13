import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import shadingVertexShader from '../../shaders/35/shading/vertex.glsl'
import shadingFragmentShader from '../../shaders/35/shading/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 5; //clamp zooming
controls.maxDistance = 100;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Material
 */
const materialParameters = {}
materialParameters.color = '#ffffff'
materialParameters.ambientLightColor = '#ffffff'
materialParameters.directionalLightColor = '#0e75c4'
materialParameters.directionalLightPosition = new THREE.Vector3(0.0, 0.0, 3.0)
materialParameters.pointLightColor = '#b32972'
materialParameters.pointLightPosition = new THREE.Vector3(0.0, 2.5, 0.0)

const material = new THREE.ShaderMaterial({
    vertexShader: shadingVertexShader,
    fragmentShader: shadingFragmentShader,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        uAmbientLightColor: new THREE.Uniform(new THREE.Color(materialParameters.ambientLightColor)),
        uAmbientLightIntensity: new THREE.Uniform(0.03),
        uDirectionalLightColor: new THREE.Uniform(new THREE.Color(materialParameters.directionalLightColor)),
        uDirectionalLightIntensity: new THREE.Uniform(0.3),
        uDirectionalLightPosition: new THREE.Uniform(materialParameters.directionalLightPosition),
        uDirectionalLightSpecularPower: new THREE.Uniform(20.0),
        uPointLightColor: new THREE.Uniform(new THREE.Color(materialParameters.pointLightColor)),
        uPointLightIntensity: new THREE.Uniform(1.3),
        uPointLightPosition: new THREE.Uniform(materialParameters.pointLightPosition),
        uPointLightSpecularPower: new THREE.Uniform(20.0),
        uPointLightDecay: new THREE.Uniform(0.3),
    }
})

gui
    .addColor(materialParameters, 'color')
    .onChange(() => {
        material.uniforms.uColor.value.set(materialParameters.color)
    })
gui.add(material.uniforms.uAmbientLightIntensity, 'value', 0.0, 4.0, 0.001).name('ambient light intensity')
gui
    .addColor(materialParameters, 'ambientLightColor')
    .onChange(() => {
        material.uniforms.uAmbientLightColor.value.set(materialParameters.ambientLightColor)
    })

gui.add(material.uniforms.uDirectionalLightIntensity, 'value', 0.0, 4.0, 0.001).name('directional light intensity')
gui
    .addColor(materialParameters, 'directionalLightColor')
    .onChange(() => {
        material.uniforms.uDirectionalLightColor.value.set(materialParameters.directionalLightColor)
        directionalLightHelper.material.color.set(materialParameters.directionalLightColor)
    })
gui.add(material.uniforms.uDirectionalLightPosition.value, 'x', -10.0, 10.0, 0.1).onChange((x) => { directionalLightHelper.position.x = x }).name('directional light position X');
gui.add(material.uniforms.uDirectionalLightPosition.value, 'y', -10.0, 10.0, 0.1).onChange((y) => { directionalLightHelper.position.y = y }).name('directional light position Y');
gui.add(material.uniforms.uDirectionalLightPosition.value, 'z', -10.0, 10.0, 0.1).onChange((z) => { directionalLightHelper.position.z = z }).name('directional light position Z');
gui.add(material.uniforms.uDirectionalLightSpecularPower, 'value', 0.0, 30.0, 0.1).name('specular power');

gui.add(material.uniforms.uPointLightIntensity, 'value', 0.0, 4.0, 0.001).name('point light intensity')
gui
    .addColor(materialParameters, 'pointLightColor')
    .onChange(() => {
        material.uniforms.uPointLightColor.value.set(materialParameters.pointLightColor)
        pointLightHelper.material.color.set(materialParameters.pointLightColor)
    })
gui.add(material.uniforms.uPointLightPosition.value, 'x', -10.0, 10.0, 0.1).onChange((x) => { pointLightHelper.position.x = x }).name('point light position X');
gui.add(material.uniforms.uPointLightPosition.value, 'y', -10.0, 10.0, 0.1).onChange((y) => { pointLightHelper.position.y = y }).name('point light position Y');
gui.add(material.uniforms.uPointLightPosition.value, 'z', -10.0, 10.0, 0.1).onChange((z) => { pointLightHelper.position.z = z }).name('point light position Z');
gui.add(material.uniforms.uPointLightSpecularPower, 'value', 0.0, 30.0, 0.1).name('point specular power');
gui.add(material.uniforms.uPointLightDecay, 'value', 0.0, 1.0, 0.01).name('point light decay');


/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load(
    './suzanne.glb',
    (gltf) => {
        suzanne = gltf.scene
        suzanne.traverse((child) => {
            if (child.isMesh)
                child.material = material
        })
        scene.add(suzanne)
    }
)

/**
 * Light helpers
 */

const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial()
)
// directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0)
directionalLightHelper.material.color.set(materialParameters.directionalLightColor)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.set(0.0, 0.0, 3.0)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)
pointLightHelper.material.color.set(materialParameters.pointLightColor)
pointLightHelper.position.set(materialParameters.pointLightPosition.x, materialParameters.pointLightPosition.y, materialParameters.pointLightPosition.z)
scene.add(pointLightHelper)


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Rotate objects
    if (suzanne) {
        suzanne.rotation.x = - elapsedTime * 0.1
        suzanne.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
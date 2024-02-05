import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'


//create debug ui

const gui = new GUI({
    width: 400,
    title: 'Debug UI',
    closeFolders: true
})
// gui.close()//by default

//create empty object to use as custom properties storage
const debugObject = {}

//hide gui panel by default and shop by trigger

// gui.hide()

window.addEventListener('keydown', (e) => {
    if (e.key === 'h') {
        gui.show(gui._hidden)
    }
})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#353078'


const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, transparent: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


//gui create settings folder

const cubeTweaks = gui.addFolder('cube visual settings')
const cubeAnimations = gui.addFolder('cube moves and animations')
cubeTweaks.close()

//gui range

// gui.add(mesh.position, 'y', -3, 3, 0.01) //short form
cubeAnimations.add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation') //long with attributes

cubeTweaks.add(material, 'opacity').min(0).max(1).step(0.01)

//gui checkbox
gui.add(mesh, 'visible')//without any folders

cubeTweaks.add(material, 'wireframe')
cubeTweaks.add(material, 'transparent')

// gui.add(material, 'vertexColors')

//gui colors

cubeTweaks
    .addColor(debugObject, 'color')//gives incorrect color in settings window
    .onChange((value) => {
        material.color.set(debugObject.color)
    })

// add gui button

//create function inside debug object

debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}

// add button to start function
cubeAnimations.add(debugObject, 'spin').name('rotate the cube')

// gui for controlling geometry

//add instance to controll all properties(Height,Width,Depth)

debugObject.subdivision = 2

cubeTweaks.add(debugObject, 'subdivision').min(1).max(10).step(1)
    .onFinishChange(() => {//to prevent lot of rerenders b
        mesh.geometry.dispose() //destroy old geometry
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision)
    })

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
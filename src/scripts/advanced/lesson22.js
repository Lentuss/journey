import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//lights

const ambientLight = new THREE.AmbientLight('#ffffff', 1.9)
scene.add(ambientLight)

//model

const gltfLoader = new GLTFLoader()

let model = null

gltfLoader.load(
    '/models/Duck/glTF/Duck.gltf',
    (gltf) => {
        gltf.scene.position.y = -1.5
        gltf.scene.position.z = 0.2
        scene.add(gltf.scene)
        model = gltf.scene
    })

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 60),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

//raycaster

object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// const intersects = raycaster.intersectObjects([object1, object2, object3])

// console.log(intersect)
// console.log(intersects)

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

//mouse

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / sizes.width) * 2 - 1
    mouse.y = -(e.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', (e) => {
    if (currentIntersect) {
        if (currentIntersect.object === object1) {
            console.log('obj 1')
        } else if (currentIntersect.object === object2) {
            console.log('obj 2')
        } else if (currentIntersect.object === object3) {
            console.log('obj 3')
        }
    }
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

// witnessVariable
let currentIntersect = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //animate objects

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    //cast a ray
    raycaster.setFromCamera(mouse, camera)

    // //cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)

    const objects = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objects)

    // console.log(intersects)

    for (const object of objects) {
        object.material.color.set('blue')
    }
    for (const intersect of intersects) {
        intersect.object.material.color.set('green')
    }


    if (intersects.length) {
        if (!currentIntersect) {
            // console.log('mouse enter')
            for (const object of objects) {
                object1.scale.set(1.1, 1.1, 1.1)
            }
        }
        currentIntersect = intersects[0]
    }
    else {
        if (currentIntersect) {
            for (const object of objects) {
                object1.scale.set(1, 1, 1)
            }
            // console.log('mouse leave')
        }
        currentIntersect = null
    }

    //model intersection

    if (model) {
        const intersect = raycaster.intersectObject(model)
        if (intersect.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
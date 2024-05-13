import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new GUI()
const debugObj = {}

debugObj.createSphere = () => {
    const colors = ['#5867d6', '#6fd658', '#a658d6', '#f5f75e', '#ff0234', '#fa9c20', '#230234', '#780608', '#370678', '#ffffff']
    createSphere(Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        },
        colors[Math.round(Math.random() * 10)]
    )
}
gui.add(debugObj, 'createSphere')

debugObj.createBox = () => {
    const colors = ['#5867d6', '#6fd658', '#a658d6', '#f5f75e', '#ff0234', '#fa9c20', '#230234', '#780608', '#370678', '#ffffff']
    createBox(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        },
        colors[Math.round(Math.random() * 10)]
    )
}
gui.add(debugObj, 'createBox')

debugObj.reset = () => {
    for (const object of objectsToUpdate) {
        //remove body
        object.body.removeEventListener('collide')
        world.removeBody(object.body)
        //remove mesh
        scene.remove(object.mesh)
    }
    //remove all in array
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObj, 'reset')

/**
 * Base
*/
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//sounds

const sound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    const impactStrenght = collision.contact.getImpactVelocityAlongNormal()

    if (impactStrenght > 1.5) {
        sound.currentTime = 0
        sound.play()
    }

    // sound.volume = Math.random()

    if (impactStrenght > 1.5 && impactStrenght < 4) {
        sound.volume = 0.3
    }

}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
//world
const world = new CANNON.World()

//to optimize performance by avoiding unnesessary collision tests
world.broadphase = new CANNON.SAPBroadphase(world)
//
//to optimize performance by avoiding unnesessary tests when body is not moving
world.allowSleep = true
//

world.gravity.set(0, -9.82, 0)


//materials
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7 //bouncing ability
    }
)
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial, plasticMaterial, {
//     friction: 0.1,
//     restitution: 0.7
// }
// )

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// //Sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     // material: defaultMaterial
// })

// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)

//floor

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()

floorBody.mass = 0 //we can skip it because its default value
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
)
// floorBody.material = defaultMaterial

world.addBody(floorBody)

// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Utils
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

const sphereMaterial = (color) => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})


const createSphere = (radius, position, color = '#ffffff') => {
    //visual
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial(color)
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //physic
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        // shape: shape,
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({ mesh, body })
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = (color) => new THREE.MeshStandardMaterial({
    color,
    metalness: 1,
    roughness: 0.2,
    envMap: environmentMapTexture

})

const createBox = (width, height, depth, position, color = '#ffffff') => {
    const mesh = new THREE.Mesh(
        boxGeometry, boxMaterial(color)
    )
    mesh.scale.set(width, height, depth)
    mesh.position.set(position)
    mesh.castShadow = true
    scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position),
        shape: shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({ mesh, body })

}

createSphere(0.5, { x: 0, y: 3, z: 0 })
createBox(0.5, 0.5, 0.5, { x: 0, y: 3, z: 0 })

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    //Update physics world

    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    world.step(1 / 60, deltaTime, 3) // important to avoid unexpected delays

    //connecting three.js sphere and cannon sphere

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z

    // sphere.position.copy(sphereBody.position) //shorter way



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
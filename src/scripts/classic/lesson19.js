import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl1')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

//Texture

const loader = new THREE.TextureLoader()
const gradient = loader.load('textures/gradients/3.jpg')
gradient.magFilter = THREE.NearestFilter

//Material
const objectsDistance = 4

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradient
})
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
mesh1.position.y = -objectsDistance * 0 - 1 // - 1 add myself to fix wrong position
mesh1.position.x = 1
mesh2.position.y = - objectsDistance * 1 - 1 // - 1 add myself to fix wrong position
mesh2.position.x = -1
mesh3.position.y = -objectsDistance * 2 - 1 // - 1 add myself to fix wrong position
mesh3.position.x = 1

// mesh1.scale.set(0.5, 0.5)

// mesh2.visible = false

// mesh3.position.y = -2
// mesh3.scale.set(0.5, 0.5)

scene.add(mesh1, mesh2, mesh3)

const sectionsMeshes = [mesh1, mesh2, mesh3]

//Particles

const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)


for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionsMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    // particle.position.y = Math.random() - 0.5
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(
    particlesGeometry,
    particlesMaterial
)
scene.add(particles)
/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#ff00ff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
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
//Group

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // make canvas transparent

})
// renderer.setClearAlpha(0.5)//set opacity of canvas color
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Scroll
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if (currentSection !== newSection) {
        currentSection = newSection
        console.log(sectionsMeshes[currentSection])
        const tl = gsap.timeline()
        gsap.to(sectionsMeshes[currentSection].rotation,
            {
                duration: 2.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            })
        // gsap.fromTo(sectionsMeshes[currentSection].material,
        //     {
        //         wireframe: true,
        //         duration: 2.5,
        //         ease: 'power2.inOut',
        //     }, {
        //     wireframe: false
        // })
        gsap.set(sectionsMeshes[currentSection].scale, {
            x: 0.5,
            y: 0.5,
            z: 0.5
        })
        tl
            .fromTo(sectionsMeshes[currentSection].scale,
                {
                    x: 1,
                    y: 1,
                    z: 1
                }, {
                duration: 2.5,
                ease: 'power2.inOut',
                x: 2.5,
                y: 2.5,
                z: 2.5
            }
            )
            .to(sectionsMeshes[currentSection].scale,
                {
                    duration: 2.5,
                    ease: 'power2.inOut',
                    x: 1,
                    y: 1,
                    z: 1
                }
            )
    }


})

//Cursor

const cursor = {}
cursor.x = 0
cursor.y = 0

document.addEventListener('mousemove', (e) => {
    cursor.x = (e.clientX / sizes.width) - 0.5
    cursor.y = (e.clientY / sizes.height) - 0.5

})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate Camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 4 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 4 * deltaTime
    //animateMeshes

    for (const mesh of sectionsMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
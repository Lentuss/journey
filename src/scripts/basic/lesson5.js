import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Time

// let time = Date.now()

//Clock

const clock = new THREE.Clock()

//use gsap

// gsap.to(mesh.position, { x: 2, duration: 2, delay: 1 })
// gsap.to(mesh.position, { x: 0, duration: 2, delay: 3 })

//Animations

const gameLoop = () => {
    //Clock

    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime

    const elapsedTime = clock.getElapsedTime()

    //Update object

    // mesh.rotation.y += 0.001 * deltaTime  //для того, чтобы скорость зависела от времени, а не кадров
    // mesh.rotation.y = Math.PI * 2 * elapsedTime  //для того, чтобы скорость вращения была 1 кадр в секунду
    camera.position.y = Math.sin(elapsedTime)  //для того, чтобы 
    camera.position.x = Math.cos(elapsedTime)  //для того, чтобы
    camera.lookAt(mesh.position)


    //Render
    renderer.render(scene, camera)

    //вызов функции каждый кадр
    window.requestAnimationFrame(gameLoop)
}

gameLoop()
import * as THREE from 'three';


const scene = new THREE.Scene();

//green cube

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'green' });
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh)

//make group

const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'green' }))
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshBasicMaterial({ color: 'yellow' }))
cube2.position.x = 1
group.add(cube2)

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' }))
cube3.position.x = 4
group.add(cube3)

//position

// mesh.position.x = 0.7
// mesh.position.y = -0.5
// mesh.position.z = 1

// mesh.position.normalize() //set vector 1

// console.log(mesh.position.length())

// mesh.position.set(0.7, -0.5, 1)

//scale

// mesh.scale.x = 2
// mesh.scale.y = 1.5
// mesh.scale.z = 0.7

mesh.scale.set(1.5, 0.5, 0.5)

//rotation (Euler)

mesh.rotation.reorder('ZYX') // вызывается перед вращением

mesh.rotation.y = 3.14 //pi or Math.PI
mesh.rotation.x = Math.PI * 0.25 //pi or Math.PI
mesh.rotation.z = Math.PI * 0.75 //pi or Math.PI

//quaternion


//camera
const sizes = { width: 800, height: 600 };

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3
camera.position.x = 1
camera.position.y = 0.3

scene.add(camera);

//сделать чтобы камера смтрела на куб

// camera.lookAt(mesh.position)

//graph of scene (применять свойства к группе)



//canvas

const canvas = document.querySelector('.webgl')
console.log(mesh.position.distanceTo(camera.position)) //distance to camera

//axis helper for help to position

const axisHelper = new THREE.AxesHelper(2);

scene.add(axisHelper)

//renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera)

// console.log('test');

// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// // scene
// const scene = new THREE.Scene()

// // canvas
// const canvas = document.querySelector('.webgl1')

// //loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

// new RGBELoader()
//     .load('b4k.hdr', function (texture) {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         scene.environment = texture;
//     });

// //model

// gltfLoader.load(
//     '/models/Jr.glb', (gltf) => {
//         // console.log(gltf)
//         gltf.scene.children[10].scale.set(0.08, 0.08, 0.08)
//         gltf.scene.children[10].castShadow = true
//         scene.add(gltf.scene)

//         console.log(gltf.scene.children[10])

//     }
// )

// const axisHelper = new THREE.AxesHelper(2);

// // scene.add(axisHelper)

// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0.1,
//         roughness: 0.9
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

// //lights

// const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () => {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100)
// camera.position.set(1, 1, 1.4)



// //renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: canvas
// })
// renderer.setClearColor('#ffffff')

// // renderer.shadowMap.enabled = true
// // renderer.shadowMap.type = THREE.PCFSoftShadowMap

// //controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
// controls.enableDamping = true

// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// const pmremGenerator = new THREE.PMREMGenerator(renderer);
// pmremGenerator.compileEquirectangularShader();

// const update = () => {

//     controls.update()
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(update)
// }

// update()
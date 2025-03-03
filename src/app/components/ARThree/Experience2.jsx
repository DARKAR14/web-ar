import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { ARButton } from "three/examples/jsm/webxr/ARButton"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

class ARExperience {
  constructor() {
    this.container = document.createElement("div")

    // importacion de la camara
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    this.camera.position.set(0, 1, 8)
    this.scene = new THREE.Scene()

    //renderizamos
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    })
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )
    this.container.appendChild(this.renderer.domElement)

    //los orbitcontrols
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.controls.enabledDamping = true

    //luz
    const drlight = new THREE.DirectionalLight(0Xffffff, 1.5)
    drlight.position.set(5, 5, 5)
    this.scene.add(drlight)

    const al = new THREE.AmbientLight(0Xffffff, 1.5)
    this.scene.add(al)
      //resize
      window.addEventListener(
      "resize",
      this.resize.bind(this)
    )
  }
  setupARExperience() {
    this.renderer.xr.enabled = true
    const controller = this.renderer.xr.getController(0)
    this.scene.add(controller)

    this.scene.traverse(child => {
      if(child instanceof THREE.Mesh){
        child.position.set(0,0, -0.5)
        .applyMatrix4(controller.matrixWorld)
        child.quaternion.setFromRotationMatrix(
          controller.matrixWorld
        )
      }
    })
  }

  loadModel(){
    const gltfloader = new GLTFLoader();
    gltfloader.load("./models/ponyo.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        this.scene.add(model);
    });   
  }

  initScene() {
    document
      .querySelector(".container3D")
      .appendChild(this.container)
  }

  setupARExperience() {
    this.renderer.xr.enabled = true

    let controller = this.renderer.xr.getController(0)
    this.scene.add(controller)

   
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.position
          .set(0, 0, -1)
          .applyMatrix4(controller.matrixWorld)
        child.quaternion.setFromRotationMatrix(
          controller.matrixWorld
        )
      }
    })
    //esto es para que aparezca el boton de RA
    this.container.appendChild(
      ARButton.createButton(this.renderer)
    )

    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  resize() {
    const { clientWidth: width, clientHeight: height } =
      document.querySelector(".container3D")
    this.renderer.setSize(width, height)
    this.camera.updateProjectionMatrix()
    this.camera.aspect = width / height
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  cleapUp() {
    this.scene.dispose()
    const container = document.querySelector(".container3D")
    let child = container.lastElementChild
    while (child) {
      container.removeChild(child)
      child = container.lastElementChild
    }
  }
}

export { ARExperience }
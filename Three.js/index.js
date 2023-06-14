window.addEventListener('DOMContentLoaded', init);
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function init() {
  const width = 1920;
  const height = 1080;

  // レンダラーを作成
  const canvasElement = document.querySelector('#myCanvas');
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
  camera.position.set(0, 0, 1000);
  // カメラコントローラーを作成
  const controls = new OrbitControls(camera, canvasElement);
  // 滑らかにカメラコントローラーを制御する
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  // 背景色
  scene.background = new THREE.Color( 0x00CCFF );

  // 地面を作成
  const groundGeometry = new THREE.BoxGeometry(100, 1, 100);
  const groundMaterial = new THREE.MeshBasicMaterial({color: 0x993300});
  const cube = new THREE.Mesh(groundGeometry, groundMaterial);
  scene.add(cube);

  // 木を作成
  const treeGeometry = new THREE.BoxGeometry(2, 10, 2);
  const treeMaterial = new THREE.MeshBasicMaterial({color: 0x8B4513});
  const tree = new THREE.Mesh(treeGeometry, treeMaterial);
  tree.position.set(0, 5, 0);
  scene.add(tree);

  // 座標軸を追加
  const axes = new THREE.AxesHelper(100);
  scene.add(axes);

  // 平行光源
  const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1); // ライトの方向
  // シーンに追加
  scene.add(light);

  // 初回実行
  tick();

  function tick() {
    // カメラコントローラーを更新
    controls.update();

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
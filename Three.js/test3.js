import * as THREE from "three";
// 必要な変数の初期化
var camera, scene, renderer;
var plane, planeSize = 500;

var keyboard = {}; // キーボードの状態を追跡するオブジェクト

// 初期化関数
function init() {
  // シーンの作成
  scene = new THREE.Scene();
  
  // カメラの作成
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 200;
  
  // 平面の作成
  var planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
  var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  
  // レンダラーの作成
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // キーボードイベントのリスナーを設定
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

// キーダウンイベントのハンドラー
function handleKeyDown(event) {
  keyboard[event.key] = true;
}

// キーアップイベントのハンドラー
function handleKeyUp(event) {
  keyboard[event.key] = false;
}

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  
  // wキーが押されているかチェック
  if (keyboard['w']) {
    // カメラの向いている方向に進む
    var direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, 1);
  }
  
  renderer.render(scene, camera);
}

// 初期化とアニメーションの開始
init();
animate();

import { PointerLockControls } from "PointerLockControls.js";

// 必要な変数の初期化
var container, scene, camera, renderer, controls;

// 初期化関数の呼び出し
init();

function init() {
  // コンテナの作成
  container = document.createElement('div');
  document.body.appendChild(container);

  // シーンの作成
  scene = new THREE.Scene();

  // カメラの作成
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 5;

  // レンダラーの作成
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // 箱を作成
  const geometry = new THREE.SphereGeometry(30, 10, 10);
  const material = new THREE.MeshPhongMaterial({color: 0xFF0000});
  const ball = new THREE.Mesh(geometry, material);
  scene.add(ball);

  // コントロールの作成
  controls = new THREE.PointerLockControlrs(camera, renderer.domElement);
  scene.add(controls.getObject());

  // マウス移動イベントの追加
  document.addEventListener('mousemove', onMouseMove, false);

  // ウィンドウサイズ変更時の処理
  window.addEventListener('resize', onWindowResize, false);
}

// マウス移動イベントの処理
function onMouseMove(event) {
  var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

  // 視点移動
  controls.getObject().rotation.y -= movementX * 0.002;
  controls.getObject().rotation.x -= movementY * 0.002;
}

// ウィンドウサイズ変更時の処理
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// レンダリング関数の呼び出し
render();

function render() {
  // フレーム更新
  requestAnimationFrame(render);

  // レンダリング
  renderer.render(scene, camera);
}

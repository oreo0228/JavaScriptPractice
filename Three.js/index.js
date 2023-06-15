window.addEventListener('DOMContentLoaded', init);
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function init() {
  const width = 1920;
  const height = 1080;

  // 移動方向の変数宣言
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;

  // 移動速度と移動方向
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

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
  camera.position.set(4, 4, 2);
  // カメラコントローラーを作成
  //const controls = new OrbitControls(camera, canvasElement);
  // 滑らかにカメラコントローラーを制御する
  //controls.enableDamping = true;
  //controls.dampingFactor = 0.2;

  
  // 一人称視点
  const controls = new PointerLockControls(camera, document.body);
  window.addEventListener('click', () => {
    controls.lock();
  });

  // WASD操作
  const onKeyDown = (e) => {
    switch(e.code) {
      case "KeyW":
        moveForward = true;
        break;
      case "KeyA":
        moveLeft = true;
        break;
      case "KeyS":
        moveBackward = true;
        break;
      case "KeyD":
        moveRight = true;
        break;
    }
  };

  const onKeyUp = (e) => {
    switch(e.code) {
      case "KeyW":
        moveForward = false;
        break;
      case "KeyA":
        moveLeft = false;
        break;
      case "KeyS":
        moveBackward = false;
        break;
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // fps取得のための変数
  let prevTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    // fps取得のための変数
    let time = performance.now();

    // 前進後進判定
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);

    // 画面をクリックしたら(ポインターが非表示の時)
    if(controls.isLocked) {
      const delta = (time - prevTime) / 1000;

      // 減衰
      velocity.z -= velocity.z * 5.0 * delta;
      velocity.x -= velocity.x * 5.0 * delta;

      if(moveForward || moveBackward) {
        velocity.z -= direction.z * 200 * delta;
      }

      if(moveRight || moveLeft) {
        velocity.x -= direction.x * 200 * delta;
      }

      prevTime = time;

      controls.moveForward(-velocity.z * delta);
      controls.moveRight(-velocity.x * delta);
    }
  }

  animate();

  // マウス座標管理用のベクトル
  const mouse = new THREE.Vector2();
  // マウスイベント
  document.addEventListener('mousedown', clickPosition, false);

  function clickPosition(e) {
    var x = e.clientX;
    var y = e.clientY;
    mouse.x =  ( x / window.innerWidth ) * 2 - 1;
    mouse.y = -( y / window.innerHeight ) * 2 + 1;
    // レイキャスト(マウス位置からまっすぐに伸びる光線ベクトルを生成)
    raycaster.setFromCamera(mouse, camera);
    // その光線とぶつかったオブジェクトを得る
    const intersects = raycaster.intersectObjects(scene.children);
    // ぶつかったオブジェクトを
    if(intersects.length > 0) {
      console.log(intersects[0].distance);
    }
  }

  // マウスを動かしたときのイベント
  function handleMouseMove(event) {
    const element = event.currentTarget;
    // canvas要素上のXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;
    // canvas要素の幅・高さ
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    // -1〜+1の範囲で現在のマウス座標を登録する
    mouse.x = ( x / w ) * 2 - 1;
    mouse.y = -( y / h ) * 2 + 1;
    console.log(mouse.x, mouse.y);
  }
  
  // 背景色
  scene.background = new THREE.Color( 0x00CCFF );

  // 地面を作成
  let a = 50;
  let b = 50;
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      createGround(a, 1, b);
      a -= 2;
    }
    a = 50
    b -= 2;
  }

  // 地面ブロックの作成
  function createGround(x, y, z) {
    const texture = new THREE.TextureLoader().load('images/Ground.png');
    const groundGeometry = new THREE.BoxGeometry(2, 2, 2);
    const groundMaterial = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(groundGeometry, groundMaterial);
    cube.position.set(x, y, z);
    cube.name = 'Ground';
    scene.add(cube);
  }

  createTree(0, 1, 0, 5);

  // 木の作成
  function createTree(x, y, z, h) {
    for (let i = 0; i <= h; i++, y += 2) {
      const texture = new THREE.TextureLoader().load('images/wood.png');
      const groundGeometry = new THREE.BoxGeometry(2, 2, 2);
      const groundMaterial = new THREE.MeshPhongMaterial({map: texture});
      const cube = new THREE.Mesh(groundGeometry, groundMaterial);
      cube.position.set(x, y, z);
      cube.name = 'Tree';
      scene.add(cube);
    }
  }

  // 座標軸を追加
  const axes = new THREE.AxesHelper(100);
  scene.add(axes);

  // 平行光源
  const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1); // ライトの方向
  // シーンに追加
  scene.add(light);

  // 画面の中央に黒い点を表示するためのマテリアルとジオメトリを作成
  const pointMaterial = new THREE.PointsMaterial({ color: 0x000000 });
  const pointGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -5)]); // カメラの前方に配置
  // ポイントオブジェクトを作成し、シーンに追加
  const pointObject = new THREE.Points(pointGeometry, pointMaterial);
  camera.add(pointObject);

  // レイキャストを作成
  const raycaster = new THREE.Raycaster();

  // 初回実行
  tick();
  // 毎フレーム時に実行される
  function tick() {

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
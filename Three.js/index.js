window.addEventListener('DOMContentLoaded', init);
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function init() {
  const width = 1900;
  const height = 920;

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
  camera.position.set(4, 3, 2);
  scene.add(camera);

  // 画面中央に＋を表示
  const line1 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.01, -1),
      new THREE.Vector3(0, 0.01, -1),
    ]),
    new THREE.MeshNormalMaterial()
  );
  line1.raycast = function() {};
  const line2 = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.01, 0, -1),
    new THREE.Vector3(0.01, 0, -1),
  ]),
  new THREE.MeshNormalMaterial()
  );
  line2.raycast = function() {};
  camera.add(line1);
  camera.add(line2);
  
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
        velocity.z -= direction.z * 100 * delta;
      }

      if(moveRight || moveLeft) {
        velocity.x -= direction.x * 100 * delta;
      }

      prevTime = time;

      controls.moveForward(-velocity.z * delta);
      controls.moveRight(-velocity.x * delta);
    }
  }

  animate();

  // マウス座標管理用のベクトル
  const mouse = new THREE.Vector2();
  // レイキャストを作成
  const raycaster = new THREE.Raycaster();
  // マウスイベント
  //document.addEventListener('mousedown', clickPosition, false);
  document.addEventListener('mousedown', generateRaycast, false);

  // 画面中央からレイキャストを生成
  function generateRaycast(e) {
    const center = new THREE.Vector3(0, 0, 0);
    /*
    // カメラの視点（中心位置）を取得
    const cameraCenter = new THREE.Vector3();
    camera.getWorldPosition(cameraCenter);

    // マウスの位置を正規化デバイス座標系（Normalized Device Coordinates, NDC）に変換
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // マウス位置のベクトルを3D空間に変換
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    */

    // カメラの中心位置からレイキャストを生成
    const ray = new THREE.Raycaster();
    ray.setFromCamera(center, camera);
    //const ray = new THREE.Raycaster(center, camera);

    // レイキャストにぶつかったオブジェクトを得る
    const intersects = ray.intersectObjects(scene.children);

    if(intersects.length > 0) {
      //console.log(intersects[0]);
      console.log(intersects[0].normal);
      console.log(intersects[0].point.x);
      console.log(intersects[0]);
    }
    // レイキャストの結果を返す（必要に応じて処理を実行）
    return ray;
  }
  
  // 背景色
  scene.background = new THREE.Color( 0x00CCFF );

  // 地面を作成
  let a = 1;
  let b = 1;
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      createGround(a, -1, b);
      a += 2;
    }
    a = 1
    b += 2;
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

  createTree(5, 1, 5, 5);

  // 木の作成
  function createTree(x, y, z, h) {
    for (let i = 0; i < h; i++, y += 2) {
      const texture = new THREE.TextureLoader().load('images/wood.png');
      const groundGeometry = new THREE.BoxGeometry(2, 2, 2);
      const groundMaterial = new THREE.MeshPhongMaterial({map: texture});
      const cube = new THREE.Mesh(groundGeometry, groundMaterial);
      cube.position.set(x, y, z);
      cube.name = 'Tree';
      scene.add(cube);
    }
  }

  const putObject = (e) =>{
    console.log('putObject');
    if (e.code === "KeyG") {
      const ray = generateRaycast();
      // レイキャストにぶつかったオブジェクトを得る
      const intersects = ray.intersectObjects(scene.children);
      if (intersects.length === 0) {
        return;
      }
      console.log(intersects[0]);

      var pointX = Math.floor(intersects[0].object.position.x);
      var pointY = Math.floor(intersects[0].object.position.y);
      var pointZ = Math.floor(intersects[0].object.position.z);
      if (pointX % 2 === 0) {
        pointX += 1;
      }
      if (pointY % 2 === 0) {
        pointX += 1;
      }
      if (pointZ % 2 === 0) {
        pointX += 1;
      }
      const normal = intersects[0].normal;

      pointX += normal.x * 2;
      pointY += normal.y * 2;
      pointZ += normal.z * 2;
    
      putGround(pointX, pointY, pointZ);
      console.log("Put!");
    }  
  }
  document.addEventListener('keydown', putObject);

  function putGround(x, y, z) {
    const texture = new THREE.TextureLoader().load('images/Ground.png');
    const groundGeometry = new THREE.BoxGeometry(2, 2, 2);
    const groundMaterial = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(groundGeometry, groundMaterial);
    cube.position.set(x, y, z);
    cube.name = 'Ground';
    scene.add(cube);
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

  /*
  // 画面の中央に黒い点を表示するためのマテリアルとジオメトリを作成
  const pointMaterial = new THREE.PointsMaterial({ color: 0x000000 });
  // カメラの前方に配置
  const pointGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -5)]);
  // ポイントオブジェクトを作成し、シーンに追加
  const pointObject = new THREE.Points(pointGeometry, pointMaterial);
  camera.add(pointObject);
  */

  // 初回実行
  tick();
  // 毎フレーム時に実行される
  function tick() {

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
window.addEventListener('DOMContentLoaded', init);
import * as THREE from "three";
//import * as CANNON from 'cannon';
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

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

  //aaa
  const world = new CANNON.World();
  world.broadphase = new CANNON.NaiveBroadphase(); // 物体検知のオブジェクト
  world.solver.iterations = 5; // 反復計算回数
  world.solver.tolerance = 0.1; // 許容値
  world.gravity.set(0, -9.82, 0); // gravity z = -9.82 m/s²

  // ビューポート用のカメラ
  const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera2.position.set(5, 8, 15);

  // 小さなビューポートのレンダリング
  const viewportWidth = window.innerWidth / 4; // ビューポートの幅
  const viewportHeight = window.innerHeight / 4; // ビューポートの高さ
  const viewportRenderer = new THREE.WebGLRenderer({ alpha: true });
  viewportRenderer.setSize(viewportWidth, viewportHeight);
  document.body.appendChild(viewportRenderer.domElement);
  viewportRenderer.domElement.style.position = 'absolute';
  viewportRenderer.domElement.style.top = '10px';
  viewportRenderer.domElement.style.left = '10px';

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  // カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
  camera.position.set(2, 3, 2);
  scene.add(camera);

  // 体を作成
  const mybody = {};
  {
    mybody.body = new CANNON.Body({
      mass: 0, 
      shape: new CANNON.Box(new CANNON.Vec3(1, 2, 1)),
      position: new CANNON.Vec3(2, 3, 4),
    });
    world.add(mybody.body);

    const texture = new THREE.TextureLoader().load('images/Ground.png');
    mybody.view = new THREE.Mesh(
      new THREE.BoxGeometry(2, 4, 2),
      new THREE.MeshPhongMaterial({map: texture})
    );
    scene.add(mybody.view);
  }

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

  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, -1, -5),
    ]),
    new THREE.MeshNormalMaterial()
  );
  camera.add(line);

  // マウス座標管理用のベクトル
  const mouse = new THREE.Vector2();
  // レイキャストを作成
  const raycaster = new THREE.Raycaster();
  // マウスイベント
  //document.addEventListener('mousedown', clickPosition, false);
  document.addEventListener('mousedown', generateRaycast, false);

  // 画面中央からレイキャストを生成
  function generateRaycast() {
    const center = new THREE.Vector3(0, 0, 0);

    // カメラの中心位置からレイキャストを生成
    const ray = new THREE.Raycaster();
    ray.setFromCamera(center, camera);

    // レイキャストにぶつかったオブジェクトを得る
    const intersects = ray.intersectObjects(scene.children);

    if(intersects.length > 0) {
      //console.log(intersects[0]);
      //console.log(intersects[0].normal);
      //console.log(intersects[0].point.x);
      //console.log(intersects[0]);
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

  /*
  function createGround(x, y, z) {
    // 質量を持った地面
    const ground = {};
    {
      ground.body = new CANNON.Body({
        mass: 0, 
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        position: new CANNON.Vec3(x, y, z),
      });
      world.add(ground.body);

      const texture = new THREE.TextureLoader().load('images/Ground.png');
      ground.view = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({map: texture})
      );
      scene.add(ground.view);
    }
  }
  */

  
  // 質量を持った地面
  const ground = {};
  {
    ground.body = new CANNON.Body({
      mass: 0, 
      shape: new CANNON.Box(new CANNON.Vec3(2, 2, 2)),
      position: new CANNON.Vec3(0, 0, 0),
    });
    world.add(ground.body);

    const texture = new THREE.TextureLoader().load('images/Ground.png');
    ground.view = new THREE.Mesh(
      new THREE.BoxGeometry(4, 4, 4),
      new THREE.MeshPhongMaterial({map: texture})
    );
    scene.add(ground.view);
  }
  
  

  // 球の設定
  const sphere = {};
  {
    sphere.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(2),
      position: new CANNON.Vec3(1, 6, 1),
      type: CANNON.Body.STATIC,
    });
    world.add(sphere.body);
  
    sphere.view = new THREE.Mesh(
      new THREE.SphereGeometry(2, 20, 20),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    sphere.view.castShadow = true;
    sphere.view.receiveShadow = true;
    scene.add(sphere.view);
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

  // 右クリックでブロックを設置
  const putObject = (e) =>{
    //console.log('putObject');
    if (e.button === 2) {
      const ray = generateRaycast();
      // レイキャストにぶつかったオブジェクトを得る
      const intersects = ray.intersectObjects(scene.children);
      // オブジェクトが何もないor5マス以上離れていたら終了
      if (intersects.length === 0) {
        return;
      } else if (intersects[0].distance > 11) {
        return;
      }

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
    
      if (selectedItemIndex === 0) {
        putTree(pointX, pointY, pointZ);
      } else if (selectedItemIndex === 1) {
        putGround(pointX, pointY, pointZ);
      } else if (selectedItemIndex === 2) {
        return;
      }
    }  
  }
  document.addEventListener('click', putObject);

  // 地面ブロックを設置
  function putGround(x, y, z) {
    const texture = new THREE.TextureLoader().load('images/Ground.png');
    const groundGeometry = new THREE.BoxGeometry(2, 2, 2);
    const groundMaterial = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(groundGeometry, groundMaterial);
    cube.position.set(x, y, z);
    cube.name = 'Ground';
    scene.add(cube);
  }

  //木ブロックを設置
  function putTree(x, y, z) {
    const texture = new THREE.TextureLoader().load('images/Wood.png');
    const groundGeometry = new THREE.BoxGeometry(2, 2, 2);
    const groundMaterial = new THREE.MeshPhongMaterial({map: texture});
    const cube = new THREE.Mesh(groundGeometry, groundMaterial);
    cube.position.set(x, y, z);
    cube.name = 'Tree';
    scene.add(cube);
  }

  // 左クリックでブロックを削除
  function removeBlock(e) {
    if (e.button === 0) {
      console.log('removeEvent!');
      const ray = generateRaycast();
      // レイキャストにぶつかったオブジェクトを得る
      const intersects = ray.intersectObjects(scene.children);
      // オブジェクトが何もないor5マス以上離れていたら終了
      if (intersects.length === 0) {
        return;
      } else if (intersects[0].distance > 11) {
        return;
      }
      scene.remove(intersects[0].object);
    }
  }
  document.addEventListener('click', removeBlock);

  // アイテムインベントリの選択アイテムインデックス
  let selectedItemIndex = 0;

  // アイテムの種類とテクスチャ
  const items = [
    { name: 'Wood', texture: 'images/wood.png' },
    { name: 'Ground', texture: 'images/Ground.png' },
    { name: 'item3', texture: 'images/tya.png' },
    // 追加のアイテムをここに追加
  ];

  // アイテムインベントリを作成する関数
  function createInventory() {
    // アイテムインベントリ要素を取得
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';

    // アイテムを表示する要素を作成
    items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('inventory-item');
      itemElement.style.backgroundImage = `url(${item.texture})`;

      // アイテムをクリックしたときの処理
      itemElement.addEventListener('click', () => {
        // 選択アイテムインデックスを更新
        selectedItemIndex = index;
        // 選択アイテムをハイライト
        highlightSelectedItem();
      });

      // アイテムをインベントリに追加
      inventory.appendChild(itemElement);
    });

    // 初期選択アイテムをハイライト
    highlightSelectedItem();
  }

  // 初期のアイテムインベントリを作成
  createInventory();

  // マウスホイールで選択アイテムを変更するイベントリスナーを追加
  document.addEventListener('wheel', (event) => {
    event.preventDefault();

    // マウスホイールの方向を取得
    const delta = Math.sign(event.deltaY);

    // 選択アイテムインデックスを更新
    selectedItemIndex += delta;

    // アイテムのループ処理
    if (selectedItemIndex < 0) {
      selectedItemIndex = items.length - 1;
    } else if (selectedItemIndex >= items.length) {
      selectedItemIndex = 0;
    }
    console.log(items[selectedItemIndex]);

    // 選択アイテムをハイライト
    highlightSelectedItem();
  }, {passive: false});

  // 選択アイテムをハイライトする関数
  function highlightSelectedItem() {
    const inventoryItems = document.querySelectorAll('.inventory-item');

    // 全てのアイテムのハイライトを解除
    inventoryItems.forEach((item) => {
      item.classList.remove('highlight');
    });

    // 選択アイテムをハイライト
    inventoryItems[selectedItemIndex].classList.add('highlight');
  }

  //
  /*
  function threeToCannonQuaternion(threeQuaternion) {
    return new CANNON.Quaternion(
      threeQuaternion.x,
      threeQuaternion.y,
      threeQuaternion.z,
      threeQuaternion.w
    );
  }
  */
 
  function threeToCannonQuaternion(threeQuaternion) {
    return new CANNON.Quaternion(
      0,
      threeQuaternion.y,
      0,
      threeQuaternion.w
    );
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

  //
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
  hemisphereLight.position.set(100, 100, 100);
  scene.add(hemisphereLight);

  var preposi = new CANNON.Vec3();
  
  function handleCollision(e) {
    console.log("collision");
    const contact = e.contact;
    const body = contact.bi;
    const obj = contact.bj;

    body.position.set(preposi);
  }
  world.addEventListener('collide', handleCollision);

  function animate() {
    requestAnimationFrame(animate);

    world.step(1.0 / 60.0);

    preposi = mybody.body.position;

    // カメラ2のビューポートにシーンをレンダリング
    viewportRenderer.setViewport(0, 0, viewportWidth, viewportHeight);
    viewportRenderer.setScissor(0, 0, viewportWidth, viewportHeight);
    viewportRenderer.setScissorTest(true);
    viewportRenderer.setClearColor(0x000000, 0);
    viewportRenderer.render(scene, camera2);


    // fps取得のための変数
    let time = performance.now();

    // 前進後進判定
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);

    const moveSpeed = 1.0;
    const force = new CANNON.Vec3();

    // cannon.jsのオブジェクトの操作
    if(controls.isLocked) {
      const delta = (time - prevTime) / 1000; //0.017
      var thQuaternion = new THREE.Quaternion();
      var caQuaternion = new CANNON.Quaternion();

      var localDirection = new CANNON.Vec3(0, 0, 1);
      var globalDirectionZ = new CANNON.Vec3();
      var globalDirectionX = new CANNON.Vec3();

      thQuaternion = camera.quaternion;
      caQuaternion = threeToCannonQuaternion(thQuaternion);
      mybody.body.quaternion = caQuaternion;

      const forward = new CANNON.Vec3(0, 0, -1);
      caQuaternion.vmult(forward, globalDirectionZ);
      globalDirectionZ.normalize();
      const right = new CANNON.Vec3(11, 0, 0);
      caQuaternion.vmult(right, globalDirectionX);
      globalDirectionX.normalize();

      if(moveForward) {
        mybody.body.position.x += globalDirectionZ.x * 0.2;
        mybody.body.position.y += globalDirectionZ.y * 0.2;
        mybody.body.position.z += globalDirectionZ.z * 0.2;
        camera.position.x += globalDirectionZ.x * 0.2;
        camera.position.y += globalDirectionZ.y * 0.2;
        camera.position.z += globalDirectionZ.z * 0.2;
      } else if(moveBackward) {
        mybody.body.position.x -= globalDirectionZ.x * 0.2;
        mybody.body.position.y -= globalDirectionZ.y * 0.2;
        mybody.body.position.z -= globalDirectionZ.z * 0.2;
        camera.position.x -= globalDirectionZ.x * 0.2;
        camera.position.y -= globalDirectionZ.y * 0.2;
        camera.position.z -= globalDirectionZ.z * 0.2;
      }

      if(moveRight) {
        mybody.body.position.x += globalDirectionX.x * 0.2;
        mybody.body.position.y += globalDirectionX.y * 0.2;
        mybody.body.position.z += globalDirectionX.z * 0.2;
        camera.position.x += globalDirectionX.x * 0.2;
        camera.position.y += globalDirectionX.y * 0.2;
        camera.position.z += globalDirectionX.z * 0.2;
      } else if(moveLeft) {
        mybody.body.position.x -= globalDirectionX.x * 0.2;
        mybody.body.position.y -= globalDirectionX.y * 0.2;
        mybody.body.position.z -= globalDirectionX.z * 0.2;
        camera.position.x -= globalDirectionX.x * 0.2;
        camera.position.y -= globalDirectionX.y * 0.2;
        camera.position.z -= globalDirectionX.z * 0.2;
      }

    }

    //camera.position.set(mybody.body.position);

    /*
    // 画面をクリックしたら(ポインターが非表示の時)
    if(controls.isLocked) {
      var myPosition = new THREE.Vector3();
      var cannonVec = new CANNON.Vec3();
      var quaternion = new CANNON.Quaternion();

      var axis = new CANNON.Vec3(0, 1, 0);
      var angle = Math.PI * 2;

      mybody.body.quaternion.setFromAxisAngle(axis, angle);

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
      myPosition = camera.position;
      console.log("camera: " + myPosition);
      cannonVec.copy(myPosition);
      mybody.body.position = cannonVec;
      console.log("Body: " + cannonVec);
    }
    */

    /*
    // 体とカメラを動かす
    if(controls.isLocked) {
      const delta = (time - prevTime) / 1000; //0.017

      if(moveForward) {
        mybody.body.position.z -= delta * 10;
      } else if(moveBackward) {
        mybody.body.position.z += delta * 10;
      }

      if(moveRight) {
        mybody.body.position.x += delta * 10;
      } else if(moveLeft) {
        mybody.body.position.x -= delta * 10;
      }

      prevTime = time;

      //controls.moveForward(-velocity.z * delta);
      //controls.moveRight(-velocity.x * delta);
    }
    */
    

    update(ground);
    update(sphere);
    update(mybody);
  }
  function update(object) {
    object.view.position.copy(object.body.position);
    object.view.quaternion.copy(object.body.quaternion);
  }
  animate();

  // 初回実行
  tick();
  // 毎フレーム時に実行される
  function tick() {

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
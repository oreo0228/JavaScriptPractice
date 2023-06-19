// ページが読み込まれた後に実行されるコード
window.addEventListener('DOMContentLoaded', () => {
  // コンテナ要素を取得
  const container = document.getElementById('canvas-container');

  // サイズを指定
  const width = container.clientWidth;
  const height = container.clientHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  // コンテナにレンダラーのDOM要素を追加
  container.appendChild(renderer.domElement);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  // ジオメトリとマテリアルを作成
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);

  // シーンにオブジェクトを追加
  scene.add(cube);

  // アイテムインベントリの作成
  const inventory = document.createElement('div');
  inventory.id = 'inventory';

  // アイテムの種類とテクスチャを定義
  const items = [
    { name: 'item1', texture: 'textures/item1.png' },
    { name: 'item2', texture: 'textures/item2.png' },
    { name: 'item3', texture: 'textures/item3.png' },
    // 追加のアイテムをここに追加
  ];

  // アイテムを表示する要素を作成
  items.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('inventory-item');
    itemElement.style.backgroundImage = `url(${item.texture})`;

    // アイテムをクリックしたときの処理
    itemElement.addEventListener('click', () => {
      // ここにアイテムを使用する処理を追加
      console.log(`Selected item: ${item.name}`);
    });

    // アイテムをインベントリに追加
    inventory.appendChild(itemElement);
  });

  // コンテナにアイテムインベントリを追加
  container.appendChild(inventory);

  // レンダリングループ
  function animate() {
    requestAnimationFrame(animate);

    // オブジェクトの回転
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // レンダリング
    renderer.render(scene, camera);
  }

  // レンダリングループを開始
  animate();
});

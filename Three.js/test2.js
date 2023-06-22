function main() {
    //----------------------------------------------------------------------
    // setup cannon.js
    //----------------------------------------------------------------------
    const world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase(); // 物体検知のオブジェクト
    world.solver.iterations = 5; // 反復計算回数
    world.solver.tolerance = 0.1; // 許容値
    world.gravity.set(0, 0, -9.82); // gravity z = -9.82 m/s²
  
    //----------------------------------------------------------------------
    // setup three.js
    //----------------------------------------------------------------------
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height );
    camera.position.set(0, -12, 8);
    camera.lookAt(0, 0, 0);
    
    const scene = new THREE.Scene();
    const spotLight = new THREE.SpotLight(0xffffff, 1.0);
    spotLight.position.set(8, -8, 12);
    spotLight.lookAt(new THREE.Vector3(0, 0, 0));
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);
  
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    scene.add(new THREE.AxesHelper(100));
    
    //----------------------------------------------------------------------
    // content (cannon.jsとthree.jsと同じ形状のオブジェクトを作る)
    //----------------------------------------------------------------------
  
    // 地面の設定
    const ground = {};
    {
      ground.body = new CANNON.Body({
        mass: 0, shape: new CANNON.Plane(), 
        position: new CANNON.Vec3(0, 0, 0),
      });
      world.add(ground.body);
  
      ground.view = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      );
    
      ground.view.receiveShadow = true;
      scene.add(ground.view);
    }
  
    // 立方体の設定
    const box = {};
    {
      box.body = new CANNON.Body({
        mass: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), 
        position: new CANNON.Vec3(-0.5, 0, 5),
      });
      world.add(box.body);
      
      box.view = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      box.view.castShadow = true;
      box.view.receiveShadow = true;
      scene.add(box.view);
    }
    
    // 球の設定
    const sphere = {};
    {
      sphere.body = new CANNON.Body({
        shape: new CANNON.Sphere(1),
        position: new CANNON.Vec3(+0.5, 0, 8),
        mass: 1,
      });
      world.add(sphere.body);
    
      sphere.view = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      sphere.view.castShadow = true;
      sphere.view.receiveShadow = true;
      scene.add(sphere.view);
    }
    
    //----------------------------------------------------------------------
    // animation
    //----------------------------------------------------------------------
    function animate() {
      world.step(1.0 / 60.0);
      
      update(box);
      update(sphere);
      renderer.render(scene, camera);
    
      requestAnimationFrame(animate);
    }
    function update(object) {
      object.view.position.copy(object.body.position);
      object.view.quaternion.copy(object.body.quaternion);
    }
    animate();
  }
  
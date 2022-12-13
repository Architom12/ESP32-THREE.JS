let scene, camera, renderer, cube, container;


function init3D() {
  container = document.querySelector(".scene");

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 30);

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(50, 50, 100);
  scene.add(light);
  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  // Create a geometry
  let loader = new THREE.GLTFLoader();
  loader.load("./scene.gltf", function (gltf) {
    cube = gltf.scene.children[0];
    scene.add(cube);
    camera.position.z = 5;
    renderer.setAnimationLoop( ( )=>{

      if(cube){
      camera.lookAt( cube );
      
      }
      renderer.render(scene, camera);
      
      })
  });
}
function parentSize(elem) {
  return {w:elem.parentElement.clientWidth,
          h:elem.parentElement.clientHeight}
}


// Resize the 3D object when the browser window changes size
function onWindowResize() {
  let {w,h}= parentSize(renderer.domElement);
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize( w,h);
}

// Create the 3D representation
init3D();
window.addEventListener("resize", onWindowResize, false);

// Create events for the sensor readings
if (!!window.EventSource) {
  var source = new EventSource("/events");

  source.addEventListener(
    "open",
    function (e) {
      console.log("Events Connected");
    },
    false
  );

  source.addEventListener(
    "error",
    function (e) {
      if (e.target.readyState != EventSource.OPEN) {
        console.log("Events Disconnected");
      }
    },
    false
  );

  source.addEventListener(
    "gyro_readings",
    function (e) {
      //console.log("gyro_readings", e.data);
      var obj = JSON.parse(e.data);
      document.getElementById("gyroX").innerHTML = obj.gyroX;
      document.getElementById("gyroY").innerHTML = obj.gyroY;
      document.getElementById("gyroZ").innerHTML = obj.gyroZ;

      // Change cube rotation after receiving the readinds
      if(cube){  //Make sure it's been loaded before trying to change it!
        cube.rotation.x = obj.gyroY;
        cube.rotation.z = obj.gyroX;
        cube.rotation.y = obj.gyroZ;
      }
      renderer.setAnimationLoop( ( )=>{

        if(cube){
        camera.lookAt( cube );
        
        }
        renderer.render(scene, camera);
        
        })
    },
    false
  );

  source.addEventListener(
    "temperature_reading",
    function (e) {
      console.log("temperature_reading", e.data);
      document.getElementById("temp").innerHTML = e.data;
    },
    false
  );

  source.addEventListener(
    "accelerometer_readings",
    function (e) {
      console.log("accelerometer_readings", e.data);
      var obj = JSON.parse(e.data);
      document.getElementById("accX").innerHTML = obj.accX;
      document.getElementById("accY").innerHTML = obj.accY;
      document.getElementById("accZ").innerHTML = obj.accZ;
    },
    false
  );
}

function resetPosition(element) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/" + element.id, true);
  console.log(element.id);
  xhr.send();
}

var fileArea = document.getElementById('dragDropArea');
var fileInput = document.getElementById('fileInput');
var grayscaleElement =document.getElementById('grayscale-btn');
var mosaicElement = document.getElementById('mosaic-btn');
var mosaicSlider = document.getElementById('mosaic-slider');
var binaryElement = document.getElementById('binary-btn');
var binarySlider = document.getElementById('binary-slider');
var faceDetectionElement = document.getElementById('faceDetection-btn');
var resetElement = document.getElementById('reset-btn');

const MODEL_URL = "./weights";

//const canvas = document.getElementById('canvas');
const imageInput = document.getElementById('imageInput');
// プレビュー表示用
const previewImage = document.getElementById('preview');
// オリジナル画像
let originalImageSrc = '';
// オリジナル画像URL
let originalImageUrl = '';

//プレビュー表示
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    //originalImageUrl = URL.createObjectURL(event.target.file[0]);
    const reader = new FileReader();

    reader.onload = function(e) {
      previewImage.src = e.target.result;
      originalImageSrc = e.target.result;
    }

    reader.readAsDataURL(file);
  });


// グレースケールボタンが押された時
grayscaleElement.addEventListener('click', function() {
    //var img = document.getElementById('preview');
    var img = new Image();
    img.src = originalImageSrc;
  
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
  
    canvas.width = img.width;
    canvas.height = img.height;
  
    // 画像をキャンバスに描画
    context.drawImage(img, 0, 0);
  
    // グレースケールに変換
    var imageData = context.getImageData(0, 0, img.width, img.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
  
    // 変換後の画像をプレビュー表示  
    context.putImageData(imageData, 0, 0);
    //img.src = canvas.toDataURL();
    previewImage.src = canvas.toDataURL();
});

// 2値化ボタンが押されたとき
binaryElement.addEventListener('click', function(e) {
    // 閾値
    const THRESHOLD = 128;
    // 閾値で2値化
    binary(originalImageSrc, THRESHOLD);
});

//スライダーで2値化
binarySlider.addEventListener('change', function(e) {
    var value = document.getElementById('binary-slider').value;
    // スライダーの値で2値化
    binary(originalImageSrc, Number(value));
});

// 2値化
function binary(url, k) {
    const THRESHOLD = k;
    //var img = document.getElementById('previewImage');
    var img = new Image();
    img.src = url;
  
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
  
    canvas.width = img.width;
    canvas.height = img.height;

    context.drawImage(img, 0, 0, img.width, img.height);

    var imageData = context.getImageData(0, 0, img.width, img.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
    
        var y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        y = parseInt(y, 10);
        //閾値未満は0、閾値以上は255
        if (y > THRESHOLD) {
            y = 255;
        } else {
            y = 0;
        }
        data[i] = y;
        data[i + 1] = y;
        data[i + 2] = y;
        //data[i + 3] = imageData[i + 3];
    }
    context.putImageData(imageData, 0, 0);
    previewImage.src = canvas.toDataURL();
}

// クリックされたらモザイク化
mosaicElement.addEventListener('click', function() {
    mosaic(originalImageSrc, 20);
});

//スライダーでモザイク化
mosaicSlider.addEventListener('change', function(e) {
    var value = document.getElementById('mosaic-slider').value;
    // スライダーの値でモザイク化
    mosaic(originalImageSrc, Number(value));
});

function mosaic(url, k) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = new Image();
    img.src = url;

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    blurColor(canvas, context, k);

    previewImage.src = canvas.toDataURL();
}

function blurColor(canvas, ctx, blockSize) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y += blockSize) {
        for (let x = 0; x < canvas.width; x += blockSize) {
            const red = data[(y * canvas.width + x) * 4];
            const green = data[(y * canvas.width + x) * 4 + 1];
            const blue = data[(y * canvas.width + x) * 4 + 2];

            for (let i = 0; i < blockSize; i++) {
                for (let j = 0; j < blockSize; j++) {
                    const pixelIndex = ((y + i) * canvas.width + (x + j)) * 4;
                    data[pixelIndex] = red;
                    data[pixelIndex + 1] = green;
                    data[pixelIndex + 2] = blue;
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// 顔認識
faceDetectionElement.addEventListener("click", function() {
    detectAllFaces(originalImageSrc);
});

window.onload = (event)=>{
	console.log("onload!");
	loadModels();
}

async function loadModels(){
	console.log("loadModels");
	Promise.all([
		faceapi.loadSsdMobilenetv1Model(MODEL_URL),
		faceapi.loadFaceLandmarkModel(MODEL_URL),
		faceapi.loadFaceRecognitionModel(MODEL_URL)
	]);
}

async function detectAllFaces(url){
	console.log("detectAllFaces");
    var img = new Image();
    img.src = url;
	
	// 1, 画像の読み込み
	//img = await faceapi.fetchImage(FILE_URL);
    //img.src = await faceapi.fetchImage(originalImageSrc);

	// 2, HTMLからキャンバスを取得し画像を描画
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
	//canvas = document.getElementById("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	//context = canvas.getContext("2d");
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(img, 0, 0);// 画像の描画

	// 3, 顔認識の実行と認識結果の取得
	const iSize = {width: img.width, height: img.height};
	const fData = await faceapi.detectAllFaces(img).withFaceLandmarks();
	
	// 4, 認識結果のリサイズ
	const rData = await faceapi.resizeResults(fData, iSize);
	rData.forEach(data=>{drawResult(data, canvas, context);});
}

function drawResult(data, canvas, context){
	console.log("drawResult!!");
	//console.log(data);

	const box = data.detection.box;// 長方形のデータ
	const mrks = data.landmarks.positions;

	context.fillStyle = "red";
	context.strokeStyle = "red";
	context.lineWidth = 4;
	context.strokeRect(box.x, box.y, box.width, box.height);// 長方形の描画
    previewImage.src = canvas.toDataURL();
}

//もとに戻す
resetElement.addEventListener('click', function() {
    previewImage.src = originalImageSrc;
});

/*
// 画像を保存ボタンが押された時の処理
document.getElementById('saveBtn').addEventListener('click', function() {
    var img = document.getElementById('preview');
    var downloadLink = document.getElementById('downloadLink');

    downloadLink.href = img.src;
    downloadLink.download = 'processed_image.png';
    downloadLink.style.display = 'block';
});
*/
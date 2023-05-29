var fileArea = document.getElementById('dragDropArea');
var fileInput = document.getElementById('fileInput');
var grayscaleElement =document.getElementById('grayscale-btn');
var mosaicElement = document.getElementById('mosaic-btn');
var binaryElement = document.getElementById('binary-btn');
var binarySlider = document.getElementById('binary-slider');
var resetElement = document.getElementById('reset-btn');

const canvas = document.getElementById('canvas');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('preview');
let originalImageSrc = '';

//プレビュー表示
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      previewImage.src = e.target.result;
      originalImageSrc = e.target.result;
    }
    console.log(originalImageSrc);

    reader.readAsDataURL(file);
  });

// グレースケールボタンが押された時
grayscaleElement.addEventListener('click', function() {
    var img = document.getElementById('preview');
  
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

function binary(url, k) {
    const THRESHOLD = k;
    //var img = document.getElementById('previewImage');
    var img = new Image();
    img.src = url;
    console.log(img.src);
  
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
    console.log('binary-slider');
}

//
//二値化ボタンが押された時
binaryElement.addEventListener('click', function() {
    //閾値
    const THRESHOLD = 128;

    var img = document.getElementById('preview');
  
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
    img.src = canvas.toDataURL();
    console.log('binary');
});

//2値化のスライドバー
binarySlider.addEventListener('change', function(e) {
    var value = document.getElementById('binary-slider').value;
    binary(originalImageSrc, Number(value));
});

//スライドバー
/*
document.getElementById('slider').addEventListener('change', function(e) {
    var value = document.getElementById('output1').value;

    drawImage(image, Number(value));
});
*/

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
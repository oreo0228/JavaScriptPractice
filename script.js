var fileArea = document.getElementById('dragDropArea');
var fileInput = document.getElementById('fileInput');
var grayscaleElement =document.getElementById('grayscale-btn');
var mosaicElement = document.getElementById('mosaic-btn');
var binaryElement = document.getElementById('binary-btn');
var binarySlider = document.getElementById('binary-slider');
var resetElement = document.getElementById('reset-btn');

//const canvas = document.getElementById('canvas');
const imageInput = document.getElementById('imageInput');
// プレビュー表示用
const previewImage = document.getElementById('preview');
// オリジナル画像
let originalImageSrc = '';

//プレビュー表示
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
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

// モザイク化
mosaicElement.addEventListener('click', function() {
    mosaic(originalImageSrc, 5);
});

function mosaic(url, k) {
    var img = new Image();
    img.src = url;
  
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d',{
        willReadFrequently: true
    });
    var imageData = context.getImageData(0, 0, img.width, img.height);
    var data = imageData.data;

    img.onload = () => {
        var scale = 1;
        var fixed_w = img.width * scale;
        var fixed_h = img.height * scale;
        canvas.width = fixed_w;
        canvas.height = fixed_h;
        context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            fixed_w,
            fixed_h,
        );

        if (k > 1) {
            var i, j;
            for (i = 0; i < canvas.width; i += k) {
                for (j = 0; j < canvas.height; j += k) {
                    blurColor(i, j, k, k, canvas, context, data);
                }
            }
            cutRemnant(0, 0, i - k, j - k, canvas, context, data);
        }
    };
    context.putImageData(imageData, 0, 0);
    previewImage.src = canvas.toDataURL();
}

function blurColor(x, y, w, h, canvas, ctx, data) {
    //var canvas = document.createElement('canvas');
    //let ctx = canvas.getContext('2d');
    let r, g, b;
    r = g = b = 0;

    //var src = ctx.getImageData(x, y, w, h);
    var dst = ctx.createImageData(w, h);

    for (var i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    r /= data.length / 4;
    g /= data.length / 4;
    b /= data.length / 4;

    r = Math.ceil(r);
    g = Math.ceil(g);
    b = Math.ceil(b);

    for (var i = 0; i < data.length; i += 4) {
        dst.data[i] = r;
        dst.data[i + 1] = g;
        dst.data[i + 2] = b;
        dst.data[i + 3] = 255;
    }

    ctx.putImageData(dst, x, y);
    //previewImage.src = canvas.toDataURL();
}

function cutRemnant(x, y, w, h, canvas, ctx, data) {
    //var canvas = document.createElement('canvas');
    //var ctx = canvas.getContext('2d');
  
    //var src = ctx.getImageData(x, y, w, h);
    var dst = ctx.createImageData(canvas.width, canvas.height);
  
    for (var i = 0; i < data.length; i += 4) {
      dst.data[i + 3] = 0;
    }
  
    ctx.putImageData(dst, x, y);
    ctx.putImageData(src, x, y);
    //previewImage.src = canvas.toDataURL();
    //console.log(previewImage.src);
}

function resizeCanvas(width, height, func) {
    var img = new Image();
    img.onload = function() {
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      if (func) {
        func();
      }
    };
    img.src = canvas.toDataURL();
    //previewImage.src = canvas.toDataURL();
  }

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
var fileArea = document.getElementById('dragDropArea');
var fileInput = document.getElementById('fileInput');
var grayscaleElement =document.getElementById('grayscale-btn');
var mosaicElement = document.getElementById('mosaic-btn');
var binaryElement = document.getElementById('binary-btn');
const canvas = document.getElementById('canvas');

fileArea.addEventListener('dragover', function(evt){
    evt.preventDefault();
    fileArea.classList.add('dragover');
});

fileArea.addEventListener('dragleave', function(evt){
    evt.preventDefault();
    fileArea.classList.remove('dragover');
});

fileArea.addEventListener('drop', function(evt){
    evt.preventDefault();
    fileArea.classList.remove('dragenter');
    var files = evt.dataTransfer.files;
    console.log("DRAG & DROP");
    console.table(files);
    fileInput.files = files;
    photoPreview('onChenge',files[0]);
});

function photoPreview(event, f = null) {
    var file = f;
    if(file === null){
        file = event.target.files[0];
    }
    var reader = new FileReader();
    var preview = document.getElementById("preview");
    // ここに画像が入る
    var previewImage = document.getElementById("previewImage");

    if(previewImage != null) {
        preview.removeChild(previewImage);
    }
    reader.onload = function(event) {
        var img = document.createElement("img");
        img.setAttribute("src", reader.result);
        img.setAttribute("id", "previewImage");
        //img.width = "800"
        preview.appendChild(img);
    };

    reader.readAsDataURL(file);
}

// グレースケールボタンが押された時
grayscaleElement.addEventListener('click', function() {
    var img = document.getElementById('previewImage');
  
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
    img.src = canvas.toDataURL();
});

//
//二値化ボタンが押された時
binaryElement.getElementByID('click', function() {
    
});

//スライドバー
document.getElementById('slider').addEventListener('change', function(e) {
    var value = document.getElementById('output1').value;
    drawImage(image, Number(value));
});

// 画像を保存ボタンが押された時の処理
document.getElementById('saveBtn').addEventListener('click', function() {
    var img = document.getElementById('preview');
    var downloadLink = document.getElementById('downloadLink');

    downloadLink.href = img.src;
    downloadLink.download = 'processed_image.png';
    downloadLink.style.display = 'block';
});
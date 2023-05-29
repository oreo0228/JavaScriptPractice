const grayscaleElement = document.createElement('grayscale-btn');

// 画像ファイルが選択された時の処理
document.getElementById('imageInput').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var imageType = /^image\//;

    if (!file || !imageType.test(file.type)) {
      return;
    }

    var img = document.getElementById('preview');
    img.file = file;

    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);

    reader.readAsDataURL(file);
  });


// グレースケールボタンが押された時の処理
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
    img.src = canvas.toDataURL();
});

// 画像を保存ボタンが押された時の処理
document.getElementById('saveBtn').addEventListener('click', function() {
    var img = document.getElementById('preview');
    var downloadLink = document.getElementById('downloadLink');

    downloadLink.href = img.src;
    downloadLink.download = 'processed_image.png';
    downloadLink.style.display = 'block';
});

//スライドバー
document.getElementById('slider').addEventListener('change', function(e) {
    var value = document.getElementById('output1').value;
    drawImage(image, Number(value));
});
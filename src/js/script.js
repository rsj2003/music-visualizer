const canvasC = document.getElementById("canvas");
const ctx = canvasC.getContext("2d");
const visualizerC = document.createElement("canvas");
const vCtx = visualizerC.getContext("2d");
const particleC = document.createElement("canvas");
const pCtx = particleC.getContext("2d");
const svgC = document.createElement("canvas");
const svg = svgC.getContext("2d");
const titleC = document.createElement("canvas");
const title = titleC.getContext("2d");
const timeC = document.createElement("canvas");
const time = timeC.getContext("2d");
const lyricsC = document.createElement("canvas");
const lyrics = lyricsC.getContext("2d");
const gradientC = document.createElement("canvas");
const gCtx = gradientC.getContext("2d");
const backgroundC = document.createElement("canvas");
const bgCtx = backgroundC.getContext("2d");
const audioFile = document.getElementById("audioFile");
const lyricsFile = document.getElementById("lyricsFile");
const backgroundImage = document.getElementById("backgroundImage");
const audio = document.getElementById("audio");
const $controller = document.getElementById("controller");
const $controllerMoveBar = document.getElementById("controllerMoveBar");
const $colorController = document.getElementById("colorController");
const $colorControllerMoveBar = document.getElementById("colorControllerMoveBar");
const $musicList = document.getElementById("musicList");
const $musicListMoveBar = document.getElementById("musicListMoveBar");
const $scroll = document.querySelector("#scroll");
const $list = document.querySelector("#scroll>.list");
const $alert = document.getElementById("alert");
const $backgroundColor = document.getElementById("backgroundColor");
const $particleColor = document.getElementById("particleColor");
const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, timeDown: false, volumeDown: false, click: false, down: false};
const controller = {x: 0, y: 0, move: false, display: false};
const colorController = {x: 0, y: 0, move: false, type: "", display: false};
const musicList = {x: 0, y: 0, move: false, type: "", display: false};
const background = new Object();
const particle = new Object();
const bgImage = {img: new Image()};

// input
const $hexC = document.getElementById("hexC");
const $hex = document.getElementById("hex");
const $hslC = document.getElementById("hslC");
const $hslSaturation = document.getElementById("hslSaturation");
const $hslLightness = document.getElementById("hslLightness");
const $conversionSpeed = document.getElementById("conversionSpeed");
const $hueStep = document.getElementById("hueStep");
const $gradient = document.getElementById("gradient");
const $hslGradientHue = document.getElementById("hslGradientHue");
const $hslGradientSaturation = document.getElementById("hslGradientSaturation");
const $hslGradientLightness = document.getElementById("hslGradientLightness");
const $backgroundAlpha = document.getElementById("backgroundAlpha");
const $backgroundCover = document.getElementById("backgroundCover");
const $playtimeDecimal = document.getElementById("playtimeDecimal");

// audio animation
let analyser;
let dataArray;
let bufferLength = 128;
let files = new Array();
let lyricsFiles = new Array();
let audioCtx;
let src;
let WIDTH = canvasC.width;
let HEIGHT = canvasC.height;
let WID = WIDTH / 2;
let HEI = HEIGHT / 2;
let audioPlay = false;
let audioPlaing = false;
let radius = 300;
let minRadius = 300;
let rotate = 180;
let audioNum = 0;
let audioLoop = localStorage.getItem("loop") ?? false;
let audioTitle = "Unselected";
let audioTitleX = 0;
let audioTitleXTime = 0;
let audioTitleWidth = 0;
let audioLyricsWidth = 0;
let audioShuffle = localStorage.getItem("shuffle") ?? false;
let audioShuffleList = new Array();
let lyricsScroll = 0;
let lyricsScrollFrom = {scroll: 0, move: false, size: 0, his: 0};
let playLyrics;
let lyricsValue = false;
let playtimeDecimal = localStorage.getItem("playtimeDecimal") ?? false;

background.hue = 0;
background.type = localStorage.getItem("backgroundType") ?? "hsl";
background.saturation = Number(localStorage.getItem("backgroundSaturation") ?? 100);
background.lightness = Number(localStorage.getItem("backgroundLightness") ?? 75);
background.hex = localStorage.getItem("backgroundHex") ?? "#666666";
background.gradient = {boolean: localStorage.getItem("backgroundGradient") ?? false, first: Number(localStorage.getItem("backgroundGradientFirst") ?? 50), last: Number(localStorage.getItem("backgroundGradientLast") ?? 100)};
background.gradient.hue = Number(localStorage.getItem("backgroundGradientHue") ?? 180);
background.gradient.saturation = Number(localStorage.getItem("backgroundGradientSaturation") ?? 100);
background.gradient.lightness = Number(localStorage.getItem("backgroundGradientLightness") ?? 75);
background.conversion = Number(localStorage.getItem("backgroundConversion") ?? 0.1);
background.hueStep = Number(localStorage.getItem("backgroundHueStep") ?? 0);

particle.hue = 0;
particle.type = localStorage.getItem("particleType") ?? "hex";
particle.saturation = Number(localStorage.getItem("particleSaturation") ?? 100);
particle.lightness = Number(localStorage.getItem("particleLightness") ?? 75);
particle.hex = localStorage.getItem("particleHex") ?? "#ffffff";
particle.gradient = {boolean: localStorage.getItem("particleGradient") ?? false, first: Number(localStorage.getItem("particleGradientFirst") ?? 50), last: Number(localStorage.getItem("particleGradientLast") ?? 100)};
particle.gradient.hue = Number(localStorage.getItem("particleGradientHue") ?? 180);
particle.gradient.saturation = Number(localStorage.getItem("particleGradientSaturation") ?? 100);
particle.gradient.lightness = Number(localStorage.getItem("particleGradientLightness") ?? 75);
particle.conversion = Number(localStorage.getItem("particleConversion") ?? 0.1);
particle.hueStep = Number(localStorage.getItem("particleHueStep") ?? 90);
particle.color = "";
particle.colorTransA = "";
particle.colorTransB = "";

bgImage.type = localStorage.getItem("backgroundCover") ?? "cover";
bgImage.alpha = Number(localStorage.getItem("backgroundAlpha") ?? 1);


if(audioLoop === "true") audioLoop = true;
else audioLoop = false;
if(audioShuffle === "true") audioShuffle = true;
else audioShuffle = false;
if(playtimeDecimal === "true") playtimeDecimal = true;
else playtimeDecimal = false;

if(bgImage.type === "cover") $backgroundCover.checked = true;
$backgroundAlpha.value = bgImage.alpha;

$playtimeDecimal.checked = playtimeDecimal;

if(background.gradient.boolean === "true") background.gradient.boolean = true;
else background.gradient.boolean = false;
if(particle.gradient.boolean === "true") particle.gradient.boolean = true;
else particle.gradient.boolean = false;

let particleList = new Array();
let musicListMove = {idx: 0, mouseY: 0, target: ""};
let interval;
let shift = false;

// svg
let repeat = new Image();
repeat.src = "./src/svg/repeat.svg";
let menu = new Image();
menu.src = "./src/svg/menu.svg";
let shuffle = new Image();
shuffle.src = "./src/svg/shuffle.svg";
let music = new Image();
music.src = "./src/svg/music.svg";

function init() {
  canvasC.width = window.innerWidth;
  canvasC.height = window.innerHeight;
  WIDTH = canvasC.width;
  HEIGHT = canvasC.height;
  WID = WIDTH / 2;
  HEI = HEIGHT / 2;

  titleC.width = 500;
  titleC.height  = 90;

  lyricsC.width = 480;
  lyricsC.height  = 85;

  visualizerC.width = particleC.width = gradientC.width = backgroundC.width = WIDTH;
  visualizerC.height = particleC.height = gradientC.height = backgroundC.height = HEIGHT;

  gCtx.fillStyle = `hsl(${background.hue}, ${background.saturation}%, ${background.lightness}%)`;
  gCtx.fillRect(0, 0, WIDTH, HEIGHT);
  vCtx.translate(WIDTH / 2, HEIGHT / 2);

  audio.volume = localStorage.getItem("volume") ?? 0.5;

  setTimeout(e => {
    $alert.style.transition = "2s";
    $alert.style.opacity = 0;
  }, 1000);


  addEventListener();
  audioAnimate();
}

function addEventListener() {
  document.addEventListener("input", e => {
    const target = e.target
    const id = target.id
    const value = target.value;
    if(target === audioFile && audioFile.value !== "") {
      if(files.length === 0){
        for(let i = 0; i < target.files.length; i++) {
          files.push(target.files[i]);
        }
        audioShuffleList = new Array();
        for(let i = 0; i < files.length; i++) {
          audioShuffleList.push(i);
        }
        if(audioShuffle) {
          audioShuffleList.sort(function(a, b) {
            return Math.random() - 0.5;
          })
        }
  
        audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
        audio.load();
        audio.play();
        audioPlaing = true;
        
        audioTitleX = 0;
        audioTitleXTime = 0;
        lyricsScroll = lyricsScrollFrom.scroll = 0;
        
        if(!audioPlay) {
          audioCtx = new AudioContext();
          src = audioCtx.createMediaElementSource(audio);
          analyser = audioCtx.createAnalyser();
      
          src.connect(analyser);
          analyser.connect(audioCtx.destination);
      
          analyser.fftSize = 256;
          bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
      
          audioPlay = true;
        }
      }else {
        for(let i = 0; i < target.files.length; i++) {
          files.push(target.files[i]);
          audioShuffleList.push(audioShuffleList.length);
        }
      }
      $list.innerHTML = "";
      files.forEach(music => {
        $list.innerHTML += 
        `<li class="item">
          <div class="drag"></div>
          <div class="musicData">${music.name}</div>
          <div class="delete">&Cross;</div>
        </li>`;
      })
      $list.style.height = `${$list.childNodes.length * 42}px`;
    }
    if(target === lyricsFile && lyricsFile.value !== "") {
      for(let i = 0; i < lyricsFile.files.length; i++) {
        let reader = new FileReader();
        reader.onload = function () {
          lyricses = reader.result;
          
          const arr = [];
          lyricses.split("\n").forEach(text => {
            let data = {time: text.split("] -")[0].replace(/\[?/g,"").split(":"), text: text.split("] -")};
            if(data.time.length < 3) {
              data.time = (Number(data.time[0]) * 60) + Number(data.time[1]);
            }
            data.lyrics = "";
            for(let l = 1; l <= data.text.length - 1; l++) {
              data.lyrics += data.text[l];
              if(l + 1 <= data.text.length - 1) data.lyrics += "] -";
            }
            data.lyrics = data.lyrics.replace(/(^\s*)|(\s*$)/, "");
            delete data.text;
            arr.push(data);
          });
          
          let l = 0;
          lyricsFiles.forEach(f => {
            if(f.title === lyricsFile.files[i].name.replace(/\.txt$/, "")) {
              lyricsFiles.splice(l, 1)
              l--;
            };
            l++;
          })

          lyricsFiles.push({title: lyricsFile.files[i].name.replace(/\.txt$/, ""),lyrics: arr});
          lyricsScrollFrom.move = true;
        }
        reader.readAsText(lyricsFile.files[i], "UTF-8");
      }
      // setTimeout(e => target.value = "", lyricsFile.files.length);
    }
    if(target === backgroundImage) {
      let file = e.target.files[0];
      if(!file.type.match("image/.*")) {
        this.alert("이미지만 업로드 할 수 있습니다.");
      }else {
        var reader = new this.FileReader;
        reader.onload = function(r) {
          bgImage.img.setAttribute("src",r.target.result);
          target.value = "";
        }
        reader.readAsDataURL(file);
      }
    }
    let object;
    if(colorController.type === "background") object = background;
    if(colorController.type === "particle") object = particle;
    switch(id) {
      case "hslSaturation" :
        object.saturation = Number(value);
        localStorage.setItem(`${colorController.type}Saturation`, object.saturation);
        break;
      case "hslLightness" :
        object.lightness = Number(value);
        localStorage.setItem(`${colorController.type}Lightness`, object.lightness);
        break;
      case "hslGradientHue" :
        object.gradient.hue = Number(value);
        localStorage.setItem(`${colorController.type}GradientHue`, object.gradient.hue);
        break;
      case "hslGradientSaturation" :
        object.gradient.saturation = Number(value);
        localStorage.setItem(`${colorController.type}GradientSaturation`, object.gradient.saturation);
        break;
      case "hslGradientLightness" :
        object.gradient.lightness = Number(value);
        localStorage.setItem(`${colorController.type}GradientLightness`, object.gradient.lightness);
        break;
      case "gradient" :
        object.gradient.boolean = target.checked;
        localStorage.setItem(`${colorController.type}Gradient`, object.gradient.boolean);
        break;
      case "conversionSpeed" :
        object.conversion = Number(value);
        localStorage.setItem(`${colorController.type}Conversion`, object.conversion);
        break;
      case "hueStep" :
        object.hueStep = Number(value);
        localStorage.setItem(`${colorController.type}HueStep`, object.hueStep);
        break;
      case "hexC" :
        object.type = "hex";
        localStorage.setItem(`${colorController.type}Type`, object.type);
        break;
      case "hslC" :
        object.type = "hsl";
        localStorage.setItem(`${colorController.type}Type`, object.type);
        break;
      case "hex" :
        object.hex = value;
        localStorage.setItem(`${colorController.type}Hex`, object.hex);
        break;
    }
    switch(id) {
      case "backgroundAlpha" :
        bgImage.alpha = Number(value);
        localStorage.setItem(`backgroundAlpha`, bgImage.alpha);
        break;
      case "backgroundCover" :
        bgImage.type = target.checked ? "cover" : "fill";
        localStorage.setItem(`backgroundCover`, bgImage.type);
        break;
      case "playtimeDecimal" :
        playtimeDecimal = target.checked;
        localStorage.setItem(`playtimeDecimal`, playtimeDecimal);
        break;
    }
  })

  document.addEventListener("keydown", e => {
    let key = e.key.toLowerCase();
    if(key === "tab") {
      e.preventDefault();
      $controller.classList.toggle("toggle");
      controller.display = hasClass($controller, "toggle");
      if(!controller.display) {
        $colorController.classList.remove("toggle");
        $musicList.classList.remove("toggle");
      }else {
        if(colorController.display) $colorController.classList.add("toggle");
        if(musicList.display) $musicList.classList.add("toggle");
      }
    }
    if(key === " ") {
      e.preventDefault();
      if(audioPlaing) {
        audioPlaing = false;
        audio.pause();
      }else {
        if(audio.src) {
          audioPlaing = true;
          audio.play();
        }
      }
    }
    if(shift) {
      if(key === "arrowleft") {
        if(audio.currentTime > 3) audio.currentTime = 0;
        else{
          audioNum--;
          if(audioNum < 0) {
            audioNum = files.length - 1;
            if(audioShuffle) {
              audioShuffleList.sort(function(a, b) {
                return Math.random() - 0.5;
              })
            }
          }
          audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
          audio.load();
          audioTitleX = 0;
          audioTitleXTime = 0;
          if(audioPlaing) audio.play();
          else audio.pause();
        }
        lyricsScroll = lyricsScrollFrom.scroll = 0;
      }
      if(key === "arrowright") {
        audioNum++;
        if(audioNum >= files.length) {
          audioNum = 0;
          if(audioShuffle) {
            audioShuffleList.sort(function(a, b) {
              return Math.random() - 0.5;
            })
          }
        }
        audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
        audio.load();
        audioTitleX = 0;
        audioTitleXTime = 0;
        lyricsScroll = lyricsScrollFrom.scroll = 0;
        if(audioPlaing) audio.play();
        else audio.pause();
      }
    }else {
      if(key === "arrowleft") {
        audio.currentTime -= 5;
        if(audio.currentTime < 0) audio.currentTime = 0;
        lyricsScrollFrom.move = true;
      }
      if(key === "arrowright") {
        audio.currentTime += 5;
        lyricsScrollFrom.move = true;
      }
    }
    if(key === "arrowdown") {
      if(audio.volume < 0.05) audio.volume = 0;
      else audio.volume -= 0.05;
    }
    if(key === "arrowup") {
      if(audio.volume > 0.95) audio.volume = 1;
      else audio.volume += 0.05;
    }
    if(key === "l") {
      if(audioLoop) {
        audioLoop = false;
      }else {
        audioLoop = true;
      }
      localStorage.setItem("loop", audioLoop);
    }
    if(key === "s") {
      if(audioShuffle) {
        audioShuffle = false;
        if(audioShuffleList.length !== 0) audioNum = audioShuffleList[audioNum];
        audioShuffleList.sort(function(a, b) {
          return a - b;
        })
      }else {
        audioShuffle = true;
        audioShuffleList.sort(function(a, b) {
          return Math.random() - 0.5;
        })
        audioShuffleList.sort(function(a, b) {
          if(a === audioNum) return -1;
          else return 0;
        })
        audioNum = 0;
      }
      localStorage.setItem("shuffle", audioShuffle);
    }
    if(key === "p") {
      if(musicList.display && !controller.display && !hasClass($musicList, "toggle")) {
        $musicList.classList.add("toggle");
      }
      else if(musicList.display) {
        musicList.display = false;
        $musicList.classList.remove("toggle");
      }else {
        musicList.display = true;
        $musicList.classList.add("toggle");
      }
    }
    if(key === "shift") {
      shift = true;
    }
    localStorage.setItem("volume", audio.volume);
  })

  document.addEventListener("keyup", e => {
    let key = e.key.toLowerCase();
    if(key === "shift") {
      shift = false;
    }
  })

  document.addEventListener("mousedown", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.click = {x: mouse.x, y: mouse.y};
    let target = e.target;
    let r = Math.sqrt(((mouse.x - WID) * (mouse.x - WID)) + ((mouse.y - HEI) * (mouse.y - HEI)));
    if(target === canvasC) {
      if(r < radius && r > radius - 40){
        let deg = Math.atan2(mouse.y - HEI, mouse.x - WID) * 180 / Math.PI;
        if(deg < 0) deg = 180 + (180 + deg);
        if(deg <= 270 ) {
          mouse.timeDown = true;
          audio.currentTime = audio.duration / 270  * deg;
          lyricsScrollFrom.move = true;
        }
        if(deg >= 275 && deg <= 355) {
          mouse.volumeDown = true;
          audio.volume = (1 / 80) * (355 - deg);
        }
      }else{
        mouse.down = true;
      }
    }
    if(target === $controllerMoveBar) {
      controller.move = true;
      controller.x = e.offsetX + 2;
      controller.y = e.offsetY + 2;
    }
    if(target === $colorControllerMoveBar) {
      colorController.move = true;
      colorController.x = e.offsetX + 2;
      colorController.y = e.offsetY + 2;
    }
    if(target === $musicListMoveBar) {
      musicList.move = true;
      musicList.x = e.offsetX + 2;
      musicList.y = e.offsetY + 2;
    }
    if(hasClass(target, "drag")) {
      musicListMove.mouseY = e.clientY;
      musicListMove.target = target.closest(".item");
      musicListMove.idx = indexInParent(musicListMove.target);
      musicListMove.top = musicListMove.idx * 42;
      musicListMove.target.style.top = `${musicListMove.top}px`;
      musicListMove.scroll = $scroll.scrollTop;
      // if(musicListMove.idx < $list.childNodes.length - 1) $list.childNodes[musicListMove.idx + 1].style.marginTop = '42px';
      // if(musicListMove.idx === $list.childNodes.length - 1) $list.childNodes[$list.childNodes.length - 2].style.marginBottom = '42px';
      if(musicListMove.idx < $list.childNodes.length - 1) $list.childNodes[musicListMove.idx + 1].style.transform = 'translateY(42px)';
      musicListMove.target.classList.add("move");
      console.log(musicListMove);
      $list.childNodes.forEach((e, i) => {
        if(e !== musicListMove.target) {
          // e.classList.add("ready");
          if(i > musicListMove.idx){
            e.style.transform = 'translateY(42px)';
          }
          setTimeout(_ => {
            e.style.transition = ".2s";
          })
        }
      })
      interval = setInterval(function() {
        if(musicListMove.target) {
          let top = musicListMove.top + mouse.y - musicListMove.mouseY + $scroll.scrollTop - musicListMove.scroll;
          if(top < 0) top = 0;
          if(top > ($list.childNodes.length - 1) * 42) top = ($list.childNodes.length - 1) * 42;
          musicListMove.target.style.top = `${top}px`;
          $list.childNodes.forEach((e, i) => {
            if(i < musicListMove.idx && i >= Math.round(top / 42)) {
              // e.style.marginTop = "42px";
              e.style.transform = 'translateY(42px)';
            }else if(i > musicListMove.idx && i >= Math.round(top / 42) + 1){
              // e.style.marginTop = "42px";
              e.style.transform = 'translateY(42px)';
            }else {
              e.style.marginTop = "";
              e.style.marginBottom = "";
              e.style.transform = "";
            }
          })
          // console.log(Math.round(top / 42));
        }
      })
    }
  });

  document.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if(mouse.timeDown || mouse.volumeDown) {
      let deg = Math.atan2(mouse.y - HEI, mouse.x - WID) * 180 / Math.PI;
      if(deg < 0) deg = 180 + (180 + deg);
      if(deg <= 270 && mouse.timeDown) audio.currentTime = audio.duration / 270  * deg;
      if(deg > 270 && deg <= 315 && mouse.timeDown) audio.currentTime = audio.duration;
      if(deg > 315 && mouse.timeDown) audio.currentTime = 0;
      if(deg >= 275 && deg <= 355 && mouse.volumeDown) audio.volume = (1 / 80) * (355 - deg);
      if(deg >= 135 && deg < 275 && mouse.volumeDown) audio.volume = 1;
      if(deg < 135 && mouse.volumeDown) audio.volume = 0;
      if(mouse.timeDown) lyricsScrollFrom.move = true;
      localStorage.setItem("volume", audio.volume);
    }
    if(controller.move) {
      $controller.style.left = `${mouse.x - controller.x}px`;
      $controller.style.top = `${mouse.y - controller.y}px`;
    }
    if(colorController.move) {
      $colorController.style.left = `${mouse.x - colorController.x}px`;
      $colorController.style.top = `${mouse.y - colorController.y}px`;
    }
    if(musicList.move) {
      $musicList.style.left = `${mouse.x - musicList.x}px`;
      $musicList.style.top = `${mouse.y - musicList.y}px`;
    }
    if(mouse.down) {
      let x = mouse.x + Math.random() * 10 - 5;
      let y = mouse.y + Math.random() * 10 - 5;
      let size = Math.random() * 5 + 2;
      particleList.push({size: size, x: x, y: y, step: Math.random() * 360, alpha: 1});
    }
  })

  document.addEventListener("mouseup", e => {
    if(mouse.timeDown) lyricsScrollFrom.move = true;
    mouse.timeDown = false;
    mouse.volumeDown = false;
    mouse.down = false;
    if(mouse.click.x === e.clientX && mouse.click.y === e.clientY) {
      let r = Math.sqrt(((mouse.click.x - WID) * (mouse.click.x - WID)) + ((mouse.click.y - HEI - 165) * (mouse.click.y - HEI - 165)));
      if(r <= 35) {
        if(audioPlaing) {
          audioPlaing = false;
          audio.pause();
        }else {
          if(audio.src) {
            audioPlaing = true;
            audio.play();
          }
        }
      }
      r = Math.sqrt(((mouse.click.x - WID - 70) * (mouse.click.x - WID - 70)) + ((mouse.click.y - HEI - 225) * (mouse.click.y - HEI - 225)));
      if(r <= 25) {
        if(audioLoop) {
          audioLoop = false;
        }else {
          audioLoop = true;
        }
        localStorage.setItem("loop", audioLoop);
      }
      r = Math.sqrt(((mouse.click.x - WID + 70) * (mouse.click.x - WID + 70)) + ((mouse.click.y - HEI - 225) * (mouse.click.y - HEI - 225)));
      if(r <= 25) {
        if(audioShuffle) {
          audioShuffle = false;
          if(audioShuffleList.length !== 0) audioNum = audioShuffleList[audioNum];
          audioShuffleList.sort(function(a, b) {
            return a - b;
          })
        }else {
          audioShuffle = true;
          audioShuffleList.sort(function(a, b) {
            return Math.random() - 0.5;
          })
          audioShuffleList.sort(function(a, b) {
            if(a === audioNum) return -1;
            else return 0;
          })
          audioNum = 0;
        }
        localStorage.setItem("shuffle", audioShuffle);
      }
      r = Math.sqrt(((mouse.click.x - WID) * (mouse.click.x - WID)) + ((mouse.click.y - HEI - 225) * (mouse.click.y - HEI - 225)));
      if(r <= 25) {
        if(musicList.display && !controller.display && !hasClass($musicList, "toggle")) {
          $musicList.classList.add("toggle");
        }
        else if(musicList.display) {
          musicList.display = false;
          $musicList.classList.remove("toggle");
        }else {
          musicList.display = true;
          $musicList.classList.add("toggle");
        }
      }
      r = Math.sqrt(((mouse.click.x - WID) * (mouse.click.x - WID)) + ((mouse.click.y - HEI + 200) * (mouse.click.y - HEI + 200)));
      if(r <= 30) {
        e.preventDefault();
        $controller.classList.toggle("toggle");
        controller.display = hasClass($controller, "toggle");
        if(!controller.display) {
          $colorController.classList.remove("toggle");
          $musicList.classList.remove("toggle");
        }else {
          if(colorController.display) $colorController.classList.add("toggle");
          if(musicList.display) $musicList.classList.add("toggle");
        }
      }
      if(mouse.click.x >= WID - 120 && mouse.click.x <= WID - 40 && mouse.click.y >= HEI + 135 && mouse.click.y <= HEI + 195) {
        if(audio.currentTime > 3) audio.currentTime = 0;
        else{
          audioNum--;
          if(audioNum < 0) {
            audioNum = files.length - 1;
            if(audioShuffle) {
              audioShuffleList.sort(function(a, b) {
                return Math.random() - 0.5;
              })
            }
          }
          audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
          audio.load();
          audioTitleX = 0;
          audioTitleXTime = 0;
          if(audioPlaing) audio.play();
          else audio.pause();
        }
        lyricsScroll = lyricsScrollFrom.scroll = 0;
      }
      if(mouse.click.x >= WID + 40 && mouse.click.x <= WID + 120 && mouse.click.y >= HEI + 135 && mouse.click.y <= HEI + 195) {
        audioNum++;
        if(audioNum >= files.length) {
          audioNum = 0;
          if(audioShuffle) {
            audioShuffleList.sort(function(a, b) {
              return Math.random() - 0.5;
            })
          }
        }
        audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
        audio.load();
        audioTitleX = 0;
        audioTitleXTime = 0;
        lyricsScroll = lyricsScrollFrom.scroll = 0;
        if(audioPlaing) audio.play();
        else audio.pause();
      }
      if(mouse.click.x >= WID - 240 && mouse.click.x <= WID + 240 && mouse.click.y >= HEI + 45 && mouse.click.y <= HEI + 130) {
        lyricsScrollFrom.move = true;
      }
    }
    if(controller.move) {
      $controller.style.left = `${mouse.x - controller.x}px`;
      $controller.style.top = `${mouse.y - controller.y}px`;
      controller.move = false;
    }
    if(colorController.move) {
      $colorController.style.left = `${mouse.x - colorController.x}px`;
      $colorController.style.top = `${mouse.y - colorController.y}px`;
      colorController.move = false;
    }
    if(musicList.move) {
      $musicList.style.left = `${mouse.x - musicList.x}px`;
      $musicList.style.top = `${mouse.y - musicList.y}px`;
      musicList.move = false;
    }
    if(audio.currentTime >= audio.duration) {
      audioNum++;
      if(audioNum >= files.length) audioNum = 0;
      audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
      audio.load();
      audioTitleX = 0;
      audioTitleXTime = 0;
      lyricsScroll = lyricsScrollFrom.scroll = 0;
      if(audioPlaing) audio.play();
      else audio.pause();
    }
    mouse.click = false;
    if(musicListMove.target) {
      let top = musicListMove.top + mouse.y - musicListMove.mouseY + $scroll.scrollTop - musicListMove.scroll;
      let idx;
      let move;
      let splice;
      let selectMusic = audioShuffleList[audioNum];

      if(musicListMove.idx < Math.round(top / 42)) idx = Math.round(top / 42) + 1;
      else idx = Math.round(top / 42)
      $list.insertBefore(musicListMove.target, $list.childNodes[idx]);
    
      move = files.splice(musicListMove.idx, 1);
      if(idx > musicListMove.idx) splice = files.splice(idx - 1, files.length);
      else splice = files.splice(idx, files.length);
      files = files.concat(move);
      files = files.concat(splice);

      if(idx > musicListMove.idx && idx > selectMusic && musicListMove.idx < selectMusic) selectMusic--;
      else if(idx < musicListMove.idx && idx <= selectMusic && musicListMove.idx > selectMusic) selectMusic++;
      else if (musicListMove.idx === selectMusic) selectMusic = Math.round(top / 42);

      if(audioShuffle) {
        audioNum = 0;
        audioShuffleList.sort(function(a, b) {
          return Math.random() - 0.5;
        })
        audioShuffleList.sort(function(a, b) {
          if(a === selectMusic) return -1;
          else return 0;
        })
      }else audioNum = selectMusic;

      musicListMove.target.classList.remove("move");
      musicListMove.target = "";
      $list.childNodes.forEach(i => {
        i.style.marginTop = "";
        i.style.marginBottom = "";
        i.style.transition = "";
        i.style.transform = "";
      })
      clearInterval(interval);
    }
  });
  
  document.addEventListener("click", e => {
    let target = e.target;
    let object = "";
    if(target === audioFile) {
      audioFile.value = ""
    }
    if(target === lyricsFile) {
      lyricsFile.value = "";
    }
    if(target === $backgroundColor) {
      if(colorController.display && colorController.type === "background") {
        $colorController.classList.remove("toggle");
        colorController.display = false;
        colorController.type = "";
      }else if(colorController.display){
        colorController.type = "background";
        object = background;
      }else {
        $colorController.classList.add("toggle");
        colorController.type = "background";
        colorController.display = true;
        object = background;
      }
    }
    if(target === $particleColor) {
      if(colorController.display && colorController.type === "particle") {
        $colorController.classList.remove("toggle");
        colorController.display = false;
        colorController.type = "";
      }else if(colorController.display){
        colorController.type = "particle";
        object = particle;
      }else {
        $colorController.classList.add("toggle");
        colorController.type = "particle";
        colorController.display = true;
        object = particle;
      }
    }
    if(target.id === "reset") {
      if(colorController.type === "background") object = background;
      if(colorController.type === "particle") object = particle;

      object.saturation = 100;
      object.lightness = 75;
      object.gradient.hue = 180;
      object.gradient.saturation = 1000;
      object.gradient.lightness = 75;
      object.gradient.boolean = false;
      object.conversion = 0.1;
      if(colorController.type === "background") {
        object.hueStep = 0;
        object.type = "hsl";
        object.hex = "#666666";
      }else {
        object.hueStep = 90;
        object.type = "hex";
        object.hex = "#ffffff";
      }

      localStorage.removeItem(`${colorController.type}Saturation`);
      localStorage.removeItem(`${colorController.type}Lightness`);
      localStorage.removeItem(`${colorController.type}GradientHue`);
      localStorage.removeItem(`${colorController.type}GradientSaturation`);
      localStorage.removeItem(`${colorController.type}GradientLightness`);
      localStorage.removeItem(`${colorController.type}Gradient`);
      localStorage.removeItem(`${colorController.type}Conversion`);
      localStorage.removeItem(`${colorController.type}HueStep`);
      localStorage.removeItem(`${colorController.type}Type`);
      localStorage.removeItem(`${colorController.type}Hex`);
    }
    if(object !== "") {
      if(object.type === "hex") $hexC.checked = true;
      else $hslC.checked = true;
      if(object.gradient.boolean === true) $gradient.checked = true;
      else $gradient.checked = false;

      $hex.value = object.hex;

      $hslSaturation.value = object.saturation;
      $hslLightness.value = object.lightness;
      $conversionSpeed.value = object.conversion;
      $hueStep.value = object.hueStep;
      $hslGradientHue.value = object.gradient.hue;
      $hslGradientSaturation.value = object.gradient.saturation;
      $hslGradientLightness.value = object.gradient.lightness;
    }
    if(hasClass(target, "delete")) {
      files.splice(indexInParent(target.closest(".item")), 1);
      if(audioShuffleList[audioNum] === indexInParent(target.closest(".item"))) {
        if(audioShuffle) {
          audioNum = 0;
          audioShuffleList = new Array();
          for(let i = 0; i < files.length; i++) {
            audioShuffleList.push(i);
          }
          if(audioShuffle) {
            audioShuffleList.sort(function(a, b) {
              return Math.random() - 0.5;
            })
          }
        }else {
          if(audioNum >= files.length) audioNum = 0;
          audioShuffleList.splice(-1, 1);
        }
        if(files.length === 0) {
          audio.src = "";
          audioPlaing = false;
        }
        else audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
        audio.load();
        audioTitleX = 0;
        audioTitleXTime = 0;
        lyricsScroll = lyricsScrollFrom.scroll = 0;
        if(audioPlaing) audio.play();
      }else {
        if(audioNum > indexInParent(target.closest(".item"))) audioNum--;
        if(audioShuffle) {
          let musicNum = audioShuffleList[audioNum];
          if(musicNum > indexInParent(target.closest(".item"))) musicNum--;
          audioNum = 0;
          audioShuffleList = new Array();
          for(let i = 0; i < files.length; i++) {
            audioShuffleList.push(i);
          }
          if(audioShuffle) {
            audioShuffleList.sort(function(a, b) {
              return Math.random() - 0.5;
            })
          }
          audioShuffleList.sort(function(a, b) {
            if(a === musicNum) return -1;
            else return 0;
          })
        }
      }
      target.closest(".item").remove();
      $list.style.height = `${$list.childNodes.length * 42}px`;
    }
    if(hasClass(target, "musicData")) {
      if(audioShuffle) {
        audioNum = 0;
        audioShuffleList.sort(function(a, b) {
          return Math.random() - 0.5;
        })
        audioShuffleList.sort(function(a, b) {
          if(a === indexInParent(target.closest(".item"))) return -1;
          else return 0;
        })
      }else {
        audioNum = indexInParent(target.closest(".item"));
      }
      audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
      audio.load();
      audioTitleX = 0;
      audioTitleXTime = 0;
      lyricsScroll = lyricsScrollFrom.scroll = 0;
      audio.play();
    }
  })

  audio.addEventListener("ended", e => {
    if(!mouse.timeDown) {
      if(audioPlaing) {
        audioNum++;
        if(audioNum >= files.length) {
          audioNum = 0;
          if(audioShuffle) {
            audioShuffleList.sort(function(a, b) {
              return Math.random() - 0.5;
            })
          }
          if(!audioLoop){
            audio.pause();
            audioPlaing = false;
          }
        }
        audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
        audio.load();
        if(audioPlaing) audio.play();
        audioTitleX = 0;
        audioTitleXTime = 0;
        lyricsScroll = lyricsScrollFrom.scroll = 0;
      }else {
        audioNum++;
        if(audioNum >= files.length) {
          audioNum = 0;
          if(audioShuffle) {
            audioShuffleList.sort(function(a, b) {
              return Math.random() - 0.5;
            })
          }
        }
        audio.src = URL.createObjectURL(files[audioShuffleList[audioNum]]);
        audio.pause();
        audioPlaing = false;
        audioTitleX = 0;
        audioTitleXTime = 0;
        lyricsScroll = lyricsScrollFrom.scroll = 0;
      }
    }
  })

  document.addEventListener("mousewheel", e => {
    if(e.target === canvasC) {
      if(e.wheelDelta > 0) lyricsScroll += 10;
      else lyricsScroll -= 10;
      if(lyricsScroll > 0) lyricsScroll = 0;
      if(lyricsScroll < - lyricsScrollFrom.size + 47) {
        lyricsScroll = - lyricsScrollFrom.size + 47;
      }
      // if(lyricsScroll < (lyricsFiles[lyricsValue].lyrics.length - 1) * -47) {
      //   lyricsScroll = (lyricsFiles[lyricsValue].lyrics.length - 1) * -47;
      // }
    }
  })
}

function audioAnimate() {
  let barWidth = (radius * 2 * Math.PI / bufferLength) / 3 / 2 * 2;
  let barHeight;
  let deg = 360 / bufferLength / 2;
  let avr = 0;
  let durationS = audio.duration   || 0.00;
  let durationM = 0;
  let durationH = 0;
  let currentS = audio.currentTime || 0.00;
  let currentM = 0;
  let currentH = 0;

  if(currentS > durationS) currentS = durationS;

  if(durationS >= 60) {
    durationM = Math.floor(durationS / 60);
    durationS = durationS % 60;
  }
  if(durationM >= 60) {
    durationH = Math.floor(durationM / 60);
    durationM = durationM % 60;
  }

  if(currentS >= 60) {
    currentM = Math.floor(currentS / 60);
    currentS = currentS % 60;
  }
  if(currentM >= 60) {
    currentH = Math.floor(currentM / 60);
    currentM = currentM % 60;
  }

  if(playtimeDecimal) {
    durationS = durationS.toFixed(2);
    currentS = currentS.toFixed(2);
  }else {
    durationS = Math.floor(durationS);
    currentS = Math.floor(currentS);
  }

  canvasC.width = window.innerWidth;
  canvasC.height = window.innerHeight;
  WIDTH = canvasC.width;
  HEIGHT = canvasC.height;
  WID = WIDTH / 2;
  HEI = HEIGHT / 2;

  visualizerC.width = particleC.width = gradientC.width = backgroundC.width = WIDTH;
  visualizerC.height = particleC.height = gradientC.height = backgroundC.height = HEIGHT;

  if(files.length > 0) {
    audioTitle = files[audioShuffleList[audioNum]].name.replace(/\.mp3|\.ogg|\.wav$/, "");
  }else {
    audioTitle = "Unselected";
  }
  audioTitleWidth = title.measureText(audioTitle).width;

  if(background.type === "hsl") {
    if(background.gradient.boolean) {
      let grd;
      let per = HEIGHT / 100;
      let hue = background.hue + background.gradient.hue + background.hueStep;
      if(background.gradient > 360) background.gradient -= background.gradient - (background.gradient % 360);
      grd = ctx.createLinearGradient(0, per * background.gradient.first, 0, per * background.gradient.last);
      grd.addColorStop(0,`hsl(${background.hue + background.hueStep}, ${background.saturation}%, ${background.lightness}%)`);
      grd.addColorStop(1,`hsl(${hue}, ${background.gradient.saturation}%, ${background.gradient.lightness}%)`);
      ctx.fillStyle = grd;
    }else {
      ctx.fillStyle = `hsl(${background.hue + background.hueStep}, ${background.saturation}%, ${background.lightness}%)`;
    }
  }else {
    ctx.fillStyle = background.hex;
  }
  background.hue += background.conversion;
  if(background.hue > 360) background.hue -= background.hue - (background.hue % 360);
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  vCtx.translate(WIDTH / 2, HEIGHT / 2);
  vCtx.rotate(180 * Math.PI / 180);

  if(bgImage.img.src !== "") {
    let bgWidth = bgImage.img.width;
    let bgHeight = bgImage.img.height;
    let w = bgWidth / backgroundC.width;
    let h = bgHeight / backgroundC.height;
    if(bgImage.type === "cover") {
      if(w < h) {
        bgHeight *= backgroundC.width / bgWidth;
        bgWidth = backgroundC.width;
      }else {
        bgWidth *= backgroundC.height / bgHeight;
        bgHeight = backgroundC.height;
      }
    }else {
      if(w > h) {
        bgHeight *= backgroundC.width / bgWidth;
        bgWidth = backgroundC.width;
      }else {
        bgWidth *= backgroundC.height / bgHeight;
        bgHeight = backgroundC.height;
      }
    }
    bgCtx.fillStyle = `rgba(0, 0, 0, ${bgImage.alpha})`;
    bgCtx.fillRect(0, 0, backgroundC.width, backgroundC.height);
    bgCtx.globalCompositeOperation = "source-in";
    bgCtx.drawImage(bgImage.img, WID - (bgWidth / 2), HEI - (bgHeight / 2), bgWidth, bgHeight);
    bgCtx.globalCompositeOperation = "source-over";
    ctx.drawImage(backgroundC, 0, 0);
  }
  
  if(particle.type === "hsl") {
    if(particle.gradient.boolean) {
      let grd;
      let per = HEIGHT / 100;
      let hue = particle.hue + particle.gradient.hue + particle.hueStep;
      if(particle.gradient > 360) particle.gradient -= particle.gradient - (particle.gradient % 360);
      grd = gCtx.createLinearGradient(0, per * particle.gradient.first, 0, per * particle.gradient.last);
      grd.addColorStop(0,`hsl(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%)`);
      grd.addColorStop(1,`hsl(${hue}, ${particle.gradient.saturation}%, ${particle.gradient.lightness}%)`);
      particle.color = grd;
      particle.colorTransA = `hsla(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%, 0.533)`;
      particle.colorTransB = `hsla(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%, 0.333)`;
    }else {
      particle.color = `hsl(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%)`;
      particle.colorTransA = `hsla(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%, 0.533)`;
      particle.colorTransB = `hsla(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%, 0.333)`;
    }
    particle.particleColor = `hsla(${particle.hue + particle.hueStep}, ${particle.saturation}%, ${particle.lightness}%, `;
  }else {
    particle.color = particle.hex;
    particle.colorTransA = `${particle.hex}88`;
    particle.colorTransB = `${particle.hex}55`;
    particle.particleColor = `${particle.hex}`;
  }
  particle.hue += particle.conversion;
  if(particle.hue > 360) particle.hue -= particle.hue - (particle.hue % 360);

  radius = minRadius;

  if(audioPlay) {
    analyser.getByteFrequencyData(dataArray);
    let x = Math.random() * (WIDTH + bufferLength * 2) - bufferLength;
    let y = HEIGHT + bufferLength / 10;
    for (let i = 0; i < bufferLength; i++) {
      avr += dataArray[i];
    }
    avr /= bufferLength;
    if(avr > 0.1) {
      let push = Math.round(Math.random() * (256 / avr));
      if(push === 0) particleList.push({size: avr / 8, x: x, y: y, step: Math.random() * 360, alpha: 1});
    }
  }
  
  radius += avr / 5;
  

  vCtx.clearRect(- WIDTH / 2, - HEIGHT / 2, WIDTH, HEIGHT);
  
  vCtx.fillStyle = particle.color;
  rotate += avr / 500 + 0.02;
  vCtx.rotate(rotate * Math.PI / 180);
  for (let i = 0; i < bufferLength; i++) {
    vCtx.rotate(deg * Math.PI / 180);
    if(audioPlay) barHeight = dataArray[i] / 3 + 2;
    if(!audioPlay) barHeight = 2;
    
    vCtx.fillRect(- barWidth / 2, radius/* - barHeight / 2*/, barWidth, barHeight);
  }
  for (let i = 0; i < bufferLength; i++) {
    vCtx.rotate(deg * Math.PI / 180);
    if(audioPlay) barHeight = dataArray[i] / 3 + 2;
    if(!audioPlay) barHeight = 2;
    
    vCtx.fillRect(- barWidth / 2, radius/* - barHeight / 2*/, barWidth, barHeight);
  }

  let removeList = new Array();
  particleList.forEach((i, idx) => {
    if(i.size < 0.1) removeList.unshift(idx);
    else if(i.alpha < 0) removeList.unshift(idx);
    else {
      i.y -= 2;
      i.size -= 0.03;
      i.alpha -= 0.002;
      i.step += 2;
      // pCtx.fillStyle = `rgba(255, 255, 255, ${i.alpha})`;
      if(particle.type === "hsl") pCtx.fillStyle = `${particle.particleColor}${i.alpha})`;
      else {
        let hexAlpha = Math.round(i.alpha * 255).toString(16);
        pCtx.fillStyle = `${particle.particleColor}${hexAlpha}`
      }
      pCtx.arc(i.x + Math.cos(i.step * Math.PI / 180) * i.size, i.y, i.size, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.beginPath();
    }
  })
  removeList.forEach(i => particleList.splice(i, 1));

  pCtx.strokeStyle = particle.color;
  pCtx.lineWidth = 10;
  pCtx.lineCap = "round";
  pCtx.lineJoin = "round";

  if(audioPlaing) {
    // console.log(Math.floor(audio.currentTime));
    // console.log(Math.floor(audio.duration));
    pCtx.moveTo(WID - 15, HEI + 140);
    pCtx.lineTo(WID - 15, HEI + 190);
    pCtx.stroke();
    pCtx.beginPath();
    pCtx.moveTo(WID + 15, HEI + 140);
    pCtx.lineTo(WID + 15, HEI + 190);
    pCtx.stroke();
    pCtx.beginPath();
  }
  else {
    pCtx.moveTo(WID - 15, HEI + 140);
    pCtx.lineTo(WID + 20, HEI + 165);
    pCtx.lineTo(WID - 15, HEI + 190);
    pCtx.lineTo(WID - 15, HEI + 140);
    pCtx.stroke();
    pCtx.beginPath();
  }

  pCtx.lineWidth = 8;

  pCtx.moveTo(WID - 50, HEI + 145);
  pCtx.lineTo(WID - 80, HEI + 165);
  pCtx.lineTo(WID - 80, HEI + 145);
  pCtx.lineTo(WID - 110, HEI + 165);
  pCtx.lineTo(WID - 110, HEI + 145);
  pCtx.lineTo(WID - 110, HEI + 185);
  pCtx.lineTo(WID - 110, HEI + 165);
  pCtx.lineTo(WID - 80, HEI + 185);
  pCtx.lineTo(WID - 80, HEI + 165);
  pCtx.lineTo(WID - 50, HEI + 185);
  pCtx.lineTo(WID - 50, HEI + 145);
  pCtx.stroke();
  pCtx.beginPath();

  pCtx.moveTo(WID + 50, HEI + 145);
  pCtx.lineTo(WID + 80, HEI + 165);
  pCtx.lineTo(WID + 80, HEI + 145);
  pCtx.lineTo(WID + 110, HEI + 165);
  pCtx.lineTo(WID + 110, HEI + 145);
  pCtx.lineTo(WID + 110, HEI + 185);
  pCtx.lineTo(WID + 110, HEI + 165);
  pCtx.lineTo(WID + 80, HEI + 185);
  pCtx.lineTo(WID + 80, HEI + 165);
  pCtx.lineTo(WID + 50, HEI + 185);
  pCtx.lineTo(WID + 50, HEI + 145);
  pCtx.stroke();
  pCtx.beginPath();

  if(audioLoop){
    drawSvg(gCtx, repeat, particle.color, WID + 70, HEI + 225, 30, false);
  }else {
    drawSvg(gCtx, repeat, particle.colorTransA, WID + 70, HEI + 225, 30, false);
  }
  if(audioShuffle){
    drawSvg(gCtx, shuffle, particle.color, WID - 70, HEI + 225, 30, false);
  }else {
    drawSvg(gCtx, shuffle, particle.colorTransA, WID - 70, HEI + 225, 30, false);
  }
  drawSvg(gCtx, menu, particle.color, WID, HEI + 225, 30, false);
  drawSvg(gCtx, music, particle.color, WID, HEI - 200, 50, false);

  title.font = "75px Comic Sans MS";
  title.fillStyle = particle.color;
  title.clearRect(0, 0, titleC.width, titleC.height);
  if(audioTitleX <= 0 && audioTitleXTime < 100 && audioTitleWidth > 500) audioTitleXTime++;
  else if(audioTitleX < audioTitleWidth - 500 && audioTitleXTime >= 100) audioTitleX += 0.8;
  else if(audioTitleX >= audioTitleWidth - 500 && audioTitleXTime > 0) audioTitleXTime--;
  else if(audioTitleX >= audioTitleWidth - 500 && audioTitleXTime <= 0) audioTitleX = 0;
  title.fillText(audioTitle,  - audioTitleX, 65);
  let timeText;
  if (playtimeDecimal) timeText = `${fillZero(currentM, 2)}:${fillZero(currentS, 5)} / ${fillZero(durationM, 2)}:${fillZero(durationS, 5)}`;
  else timeText = `${fillZero(currentM, 2)}:${fillZero(currentS, 2)} / ${fillZero(durationM, 2)}:${fillZero(durationS, 2)}`;
  if(durationH > 0) {
    timeText = `${fillZero(currentH, 2)}:${fillZero(currentM, 2)}:${fillZero(currentS, 2)} / ${fillZero(durationH, 2)}:${fillZero(durationM, 2)}:${fillZero(durationS, 2)}`;
  }

  timeC.width = time.measureText(timeText).width;
  time.font = "45px Comic Sans MS";
  time.fillStyle = particle.color;
  time.fillText(timeText, 0, 65, 480);
  

  lyricsValue = false;

  lyricsFiles.forEach((e, i) => {
    if(e.title === audioTitle) lyricsValue = i;
  })

  lyricsScrollFrom.size = 0;
  lyrics.clearRect(0, 0, lyricsC.width, lyricsC.height);
  if(lyricsValue !== false) {
    // lyrics.fillStyle = "#fff3";
    // lyrics.fillRect(0, 0, lyricsC.width, lyricsC.height);
    lyrics.font = "20px Comic Sans MS";
    lyrics.textAlign = "center";
    lyrics.fillStyle = particle.color;
    lyrics.fillStyle = particle.colorTransB;
    lyricsFiles[lyricsValue].lyrics.forEach((t, i) => {
      if(lyricsFiles[lyricsValue].lyrics.length - 1 > i) {
        let nextTime = lyricsFiles[lyricsValue].lyrics[i + 1].time;
        let nextIdx = 1;
        while(nextTime === t.time && lyricsFiles[lyricsValue].lyrics.length > i + nextIdx) {
          nextIdx++;
          if(typeof(lyricsFiles[lyricsValue].lyrics[i + nextIdx]) === "undefined") {
            nextTime = audio.duration;
            console.log(i + nextIdx);
          }else {
            nextTime = lyricsFiles[lyricsValue].lyrics[i + nextIdx].time;
          }
        }
        if(audio.currentTime >= t.time && audio.currentTime < nextTime) {
          lyrics.fillStyle = particle.color;
          if(playLyrics !== i && (i === 0 || t.time !== lyricsFiles[lyricsValue].lyrics[i - 1].time)) {
            lyricsScrollFrom.scroll = - lyricsScrollFrom.size;
            if(lyricsScrollFrom.scroll - 50 - ((nextIdx - 1) * 23) < lyricsScroll && lyricsScrollFrom.his + 110 > lyricsScroll) lyricsScroll = lyricsScrollFrom.scroll;
            playLyrics = i;
            lyricsScrollFrom.his = lyricsScrollFrom.scroll;
          }
        }else {
          lyrics.fillStyle = particle.colorTransB;
        }
      }else if(audio.currentTime >= t.time) {
        lyrics.fillStyle = particle.color;
        if(playLyrics !== i && t.time !== lyricsFiles[lyricsValue].lyrics[i - 1].time) {
          lyricsScrollFrom.scroll = - lyricsScrollFrom.size;
          if(lyricsScrollFrom.scroll - 50 < lyricsScroll && lyricsScrollFrom.his + 110 > lyricsScroll) lyricsScroll = lyricsScrollFrom.scroll;
          playLyrics = i;
          lyricsScrollFrom.his = lyricsScrollFrom.scroll;
        }
      }else {
        lyrics.fillStyle = particle.colorTransB;
      }
      if(lyricsScrollFrom.move) lyricsScroll = lyricsScrollFrom.scroll;
      audioLyricsWidth = lyrics.measureText(t.lyrics).width / 2;
      // lyrics.fillText(t.lyrics, lyricsC.width / 2 - audioLyricsWidth, lyricsScroll + (i * 47) + 23);
      lyrics.fillText(t.lyrics, lyricsC.width / 2, lyricsScroll + lyricsScrollFrom.size + 23, lyricsC.width);
      if(lyricsFiles[lyricsValue].lyrics.length - 1 > i) {
        if(t.time === lyricsFiles[lyricsValue].lyrics[i + 1].time) lyricsScrollFrom.size += 23;
        else lyricsScrollFrom.size += 47;
      }else lyricsScrollFrom.size += 47;
    })
    if(lyricsScrollFrom.move) {
      lyricsScroll = lyricsScrollFrom.scroll;
      lyricsScrollFrom.move = false;
    }
  }

  pCtx.strokeStyle = particle.colorTransB;
  pCtx.arc(WID, HEI, radius - 20, 0, 270 * Math.PI / 180);
  pCtx.stroke();
  pCtx.beginPath();
  pCtx.arc(WID, HEI, radius - 20, 275 * Math.PI / 180, 355 * Math.PI / 180);
  pCtx.stroke();
  pCtx.beginPath();
  
  let playTime = 270 / audio.duration * audio.currentTime;
  let volume = audio.volume * 80;
  if(!playTime) playTime = 0;
  
  pCtx.strokeStyle = particle.color;
  pCtx.arc(WID, HEI, radius - 20, 0, playTime * Math.PI / 180);
  pCtx.stroke();
  pCtx.beginPath();
  pCtx.arc(WID, HEI, radius - 20, (355 * Math.PI / 180) - (volume * Math.PI / 180), 355 * Math.PI / 180);
  pCtx.stroke();
  pCtx.beginPath();

  gCtx.drawImage(visualizerC, 0, 0);
  gCtx.drawImage(particleC, 0, 0);
  if(audioTitleWidth > 500) {
    gCtx.drawImage(titleC, WID - titleC.width / 2, HEI - titleC.height / 2);
  }else {
    gCtx.drawImage(titleC, WID - audioTitleWidth / 2, HEI - titleC.height / 2);
  }
  gCtx.drawImage(lyricsC, WID - lyricsC.width / 2, HEI + 45);
  if(timeC.width < 490) gCtx.drawImage(timeC, WID - timeC.width / 2, HEI - 160);
  else gCtx.drawImage(timeC, WID - 480 / 2, HEI - 160);
  if(particle.type === "hsl" && particle.gradient.boolean) {
    gCtx.globalCompositeOperation = "source-in";
    gCtx.fillStyle = particle.color;
    gCtx.fillRect(0, 0, WIDTH, HEIGHT);
    gCtx.globalCompositeOperation = "source-over";
  }
  ctx.drawImage(gradientC, 0, 0);
  requestAnimationFrame(audioAnimate);
}

window.onload = init;

function hasClass(element, className) {
  return element.classList.contains(className);
};

function drawSvg(cvs, svgImage, color, x, y, width, height) {
  if(height !== false) {
    svgImage.height = height;
  }else {
    svgImage.height *= width / svgImage.width;
  }
  svgImage.width = width;
  svgC.width = svgImage.width;
  svgC.height = svgImage.height;
  svg.fillStyle = color;
  svg.globalCompositeOperation = "source-over";
  svg.fillRect(0, 0, svgC.width, svgC.height);
  svg.globalCompositeOperation = "destination-in";
  svg.drawImage(svgImage, 0, 0, svgC.width, svgC.height);
  cvs.drawImage(svgC, x - svgC.width / 2, y - svgC.height / 2);
}

function fillZero(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function indexInParent(node) {
  var children = node.parentNode.childNodes;
  var num = 0;
  for (var i = 0; i < children.length; i++) {
       if (children[i] == node) return num;
       if (children[i].nodeType == 1) num++;
  }
  return -1;
}
let thing = null;
class Site {
	constructor() {
		const $this = this;
		this.video = document.getElementById('vid');
		this._shoot = document.getElementById("but");
		this._container = document.getElementById('print');
		this._detectBox = document.getElementById('dect');
		this._print = document.getElementById('bt');
		
		Promise.all([
		  faceapi.nets.tinyFaceDetector.loadFromUri('./models/'),
		  faceapi.nets.faceLandmark68Net.loadFromUri('./models/'),
		  faceapi.nets.faceRecognitionNet.loadFromUri('./models/'),
		  faceapi.nets.faceExpressionNet.loadFromUri('./models/')
		]).then($this.enableButton.bind($this))

		this.bindEvents();
	}

	startVideo() {
		const $this = this;
		navigator.getUserMedia(
		  { video: {} },
		  stream => $this.video.srcObject = stream,
		  err => console.error(err)
		)
		this._shoot.style.display = 'none';
	}

	enableButton() {
		this._shoot.style.display = 'block';
	}

	bindEvents() {
		this._shoot.addEventListener("click", this.startVideo.bind(this));
		this.video.addEventListener('play', this.detect.bind(this));
		this._print.addEventListener('click', function() {
			window.print();
		})
	}

	detect() {
		const $this = this;
		const canvas = faceapi.createCanvasFromMedia($this.video);
		this._detectBox.append(canvas)
		const displaySize = { width: 248, height: 296 }
		console.log(displaySize,);
		faceapi.matchDimensions(canvas, displaySize)
		setInterval(async () => {
		  const detections = await faceapi.detectAllFaces($this.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
		  const resizedDetections = faceapi.resizeResults(detections, displaySize)
		  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		  faceapi.draw.drawDetections(canvas, resizedDetections)
		  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
		  faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
		  if(detections.length) {
		  	if(detections[0].expressions) {
				  if(detections[0].expressions.happy < 0.9) {
				  	thing.style.display = 'block';
				  	$this.video.style.opacity = '0';
				  } else {
				  	thing.style.display = 'none';
				  	$this.video.style.opacity = '1';
				  }
				}
			}
		}, 100)
	}
}

new Site();


let capture;
let vScale = 10;
function setup() {
  let cnv = createCanvas(595, 841);
  cnv.parent('thing');
  thing = document.querySelector('.print canvas')
  capture = createCapture(VIDEO);
  capture.size(640/vScale,480/vScale);
  capture.hide();
  strokeCap(SQUARE)
}

function draw() {
  // image(capture, 0, 0, capture.width, capture.height);
  clear();

  translate(width, 0);
  scale(-1, 1);
  translate(0, 0);
  translate(-width/2, 0)
  scale(841/480);

  capture.loadPixels();
  for(var x = 0; x<capture.width; x++) {
    for(var y = 0; y<capture.height; y++) {
      var index = (x + y * capture.width) * 4;
      var r = capture.pixels[index]
      var g = capture.pixels[index+1]
      var b = capture.pixels[index+2]
      var bright = (r+g+b)/3;
      var w = map(bright,0,255,10,1);
      strokeWeight(w)
      line(x*vScale+(vScale-(vScale*0.5)), y*vScale, x*vScale, y*vScale+vScale);

    }
  }
  
}
new Site();
var balls = document.getElementsByClassName("ball");
          document.onmousemove = function(){
            var x = event.clientX * 100 / window.innerWidth + "%";
            var y = event.clientY * 100 / window.innerHeight + "%";

            for(var i=0;i<2;i++){
              balls[i].style.left = x;
              balls[i].style.top = y;
              balls[i].style.transform = "translate(-" + x +",-" + y +")";
            }
          }

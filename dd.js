class App extends React.Component {
  image64Data = null
  uploadSizeLimit = 4
  canvas=null
  topText = ''
  bottomText = ''
  textType = {
    top: "t1",
    bottom: "t2"
  }
  fontSizeFactors =  {
    text1: 1,
    text2: 1
  }
  imageToLoadIncanvas = null
  defaultcanvasWidth = 600


    constructor() {
      super();
      this.message = 'World';
    }
    componentDidMount(){
       console.log("gfgfg")
    }

    getBase64ofUpoaded = function(){
        let img = this.files[0];
        let validExts = ["image/png", "image/jpeg", "image/gif"];
        if(img/1024/1024>this.uploadSizeLimit){
            return alert("Max upload is 4MB")
        }
        if(validExts.indexOf(img.type)>=0){
            let reader = new FileReader;
                reader.onload = function(data64){
                       this.image64Data = data64.target.result;
                       base64ToImage();
                }
                reader.readAsDataURL(img)
        }else{
           return alert("Invalid file type")
        }
    }

    base64ToImage = function(){
        let image = new Image;
            image.src = this.image64Data
            image.setAttribute("crossOrigin", "anonymous")
            image.onload = function(){
                  imageToLoadInthis.canvas = image;
                  rednerImageInothis.canvas(image);
            }
    }
    rednerImageInothis.canvas = function(file){
        this.canvas.width = defaultthis.canvasWidth;
        this.canvas.height = (file.height/file.width)*defaultthis.canvasWidth;
        this.canvas.toDataURL();
        let contxt = this.canvas.getContext('2d');
        contxt.fillStyle = "white";
        contxt.strokeStyle = "black";
        contxt.lineWidth = 4;
        contxt.textAlign = "center";
        let fontSize = this.canvas.height/8;
        contxt.font = fontSize + "px Impact Web, Impact";
        contxt.miterLimit = 2;
        drawthis.canvas();
    }
    drawthis.canvas = function(){
        drawImage();
        topText = (topText=="")? "top text": topText;
        bottomText = (bottomText=="")? "bottom text": bottomText;
        addTextOnthis.canvas(topText, textType.top); addTextOnthis.canvas(bottomText, textType.bottom);
    }
    drawImage = function(){
        this.canvas.getContext('2d').drawImage(imageToLoadInthis.canvas, 0, 0, this.canvas.width, this.canvas.height);
    }

    addTextOnthis.canvas = function(txt, type, c, d){
        txt = txt.toUpperCase();
        // console.log(this.canvas);
        let f = this.canvas.getContext('2d');
        type = type || textType.top;
        console.log(type);
        let g = .06,
            h = .0798,
            topX = 20,
            topY = 10,
            k = d;
        if (!k) {
            var l = this.canvas.width * h;
            (type==textType.top)
            ? k = l*fontSizeFactors.text1
            : k = l*fontSizeFactors.text2
        }
        f.font = k + "px Impact Web, Impact", f.miterLimit = 2;
        //get the length of max word having with more than this.canvas
        for(var m = this.canvas.width / 2, n = txt.split(" "), o = n[0], p = 0; p < n.length; p++){
            o = n[p].length > o.length ? n[p] : o;
        }
        let q = false;
        if(!d && f.measureText(o).width > this.canvas.width - 36){
             for(var p = h; p >= g; p = .9 * p)
                 if (k = .9 * k, f.font = k + "px Impact Web, Impact", f.measureText(o).width < this.canvas.width - 36) {
                     q = true;
                     console.log(p);
                     break;
             }
        }else{
           q = d ? false : true
        }

        if(f.measureText(txt).width > this.canvas.width - 36){
            c = "undefined" == typeof c ? k + topY : c;
            type === textType.bottom && (c = this.canvas.height - topX)
            var r = n.length;
            if(type==textType.top){
                  for (var p = r, s = []; p--; ) {
                       var t = n.slice(0, p).join(" ");
                       if(t.indexOf("\n") != -1){
                            for (var u = txt.split("\n"), v = 0; v < u.length; v++)
                                s = s.concat(getLines(u[v].split(" "), this.canvas, f));
                            n = n.slice(p, n.length - (u.length - 1)),
                            p = n.length - (u.length - 1)
                       }else{
                            f.measureText(t).width <= this.canvas.width - 36 ? (s.push(t),
                            n = n.slice(p, r),
                            p = r = n.length + 1,
                            txt = n.slice(0, p).join(" ")) : 1 == p && n.length > 0 && (s.push(t),
                            n = n.slice(p, n.length),
                            p = n.length + 1);
                       }
                        if (0 == t.length || 0 == n.length)
                            break
                  }
                  if (s.length > 1)
                      return void drawLines(s, type, m, this.canvas, f, topY, topX, k)
              console.log("top");
            }else if(type==textType.bottom){
                       for (var p = r, s = []; p--; ) {
                        var t = n.slice(0, p).join(" ");
                        if (-1 != t.indexOf("\n")) {
                            for (var u = txt.split("\n"), v = 0; v < u.length; v++)
                                s = s.concat(getLines(u[v].split(" "), this.canvas, f));
                            n = n.slice(p, n.length - (u.length - 1)),
                            p = n.length - (u.length - 1)
                        } else
                            f.measureText(t).width <= this.canvas.width - 36 ? (s.push(t),
                            n = n.slice(p, r),
                            p = r = n.length + 1,
                            txt = n.slice(0, p).join(" ")) : 1 == p && n.length > 0 && (s.push(t),
                            n = n.slice(p, n.length),
                            p = n.length + 1);
                        if (0 == t.length || 0 == n.length)
                            break
                    }
                    if (s.length > 1)
                        return void drawLines(s, type, m, this.canvas, f, topY, topX, k)
              console.log("bottom");
            }
        }
        let text = txt.split("\n");
        drawLines(text, type, m, this.canvas, f, topY, topX, k)
    }

    drawLines = function(a, b, c, d, e, f, g, h){
      for (var i = 0; i < a.length; i++) {
           if(b===textType.top){
              y = f + (i + 1) * h;
           }else if(b===textType.bottom){
              y = d.height - g - Math.max(0, a.length - i - 1) * h
           }
           var j = a[i].trim(),
               k = 2 * Math.round(.9 * d.width / 2);
           e.strokeText(j, c, y, k), e.fillText(j, c, y, .9 * d.width)
      }
    }



     getLines =  function(a, b, c) {
            var d = a.length
              , e = a.length
              , f = []
              , g = a.join(" ");
            if (1 == d || c.measureText(g).width <= b.width - 36)
                return f.push(g),
                f;
            for (; e--; ) {
                var h = a.slice(0, e).join(" ");
                if (c.measureText(h).width <= b.width - 36 ? (f.push(h),
                a = a.slice(e, d),
                e = d = a.length + 1,
                g = a.slice(0, e).join(" ")) : 1 == e && a.length > 0 && (f.push(h),
                a = a.slice(e, a.length),
                e = a.length + 1),
                0 == h.length || 0 == a.length)
                    break
            }
            return f
    }

    changeTopMemeText = function(){
        topText = this.value
        drawthis.canvas()
    }
    changeBottomMemeText = function(){
        bottomText = this.value
        drawthis.canvas()
    }

    increaseTopFontSize = function(e){
       changeFontSizeHelper(textType.top, .1),
       drawthis.canvas()
    }
    decreaseTopFontSize = function(e){
       changeFontSizeHelper(textType.top, -.1),
       drawthis.canvas()
    }

    increaseBottomFontSize = function(e){
       changeFontSizeHelper(textType.bottom, .1),
       drawthis.canvas()
    }
    decreaseBottomFontSize = function(e){
       changeFontSizeHelper(textType.bottom, -.1),
       drawthis.canvas()
    }
    changeFontSizeHelper =  function(a, b) {
            if (a == textType.top) {
                var c = fontSizeFactors.text1;
                c + b >= .1 && (fontSizeFactors.text1 = c + b)
            } else if (a == textType.bottom) {
                var c = fontSizeFactors.text2;
                c + b >= .1 && (fontSizeFactors.text2 = c + b)
            }
    }






    render() {
     return (
        <div>
          <input type="file" id="choose_file"/>
          <br></br><br></br>
          <textarea name="" id="meme-top-txt" cols="20" rows="2"></textarea>
          <div>
              <button id="decrease_top_font_size">-</button>
             <button id="increase_top_font_size">+</button>
          </div>
          <textarea name="" id="meme-bottom-txt" cols="20" rows="2"></textarea>
          <div>
           <button id="decrease_bottom_font_size">-</button>
           <button id="increase_bottom_font_size">+</button>
          </div>
          <this.canvas id='this.canvas' width='600' height='250'></this.canvas>
        </div>
    );
  }
}
ReactDOM.render(<App/>, window.root);

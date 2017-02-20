// returns a function that calls `fn` when args are != from the previous call
// Otherwise (same args), do nothing.
// A special case of memoize.
function cacheFunctionFor( fn ) {
  let old_args = []
  return (...args) => {
    if(args != old_args){
      old_args = args
      fn(...args)
    }
    else return;
  }
}

let $ = function(selector){
  if(typeof selector == 'string'){ return document.querySelector(selector) }
  if(typeof selector == 'object' && selector.nodeType == 1){ return selector }
  throw TypeError("$() received an invalid input (" + selector + "). Must be a string or DOMNode! ")
}

// from pairsArray [[name,x], ...] to object {name: x, ...}
let fromPairs = (pairsArr) => {
  let o = {}
  pairsArr.map( ([name,img]) => { o[name] = img})
  return o;
}

/*
 * Dynamic catties avatar using ES6 and canvas.
 * Author: barrabinfc
 *
 * Usage:
 *
 *  <div class="avatar" data-seed="myusername@gmail.com">
 *        <img alt="myusername@gmail.com" class="small">
 *  </div>
 *  <div class="avatar" data-seed="otherusername@gmail.com">
 *        <img alt="otherusername@gmail.com" class="big">
 *  </div>
 *  <script>
 *    var cat = new Meowatar({selector: '.avatar'})
 *  </script>
 *
 *
 */
  class Meowatar {
    constructor(opts){
      this.options = Object.assign( {selector:   '.avatar',
                                     img_tag:    'img',
                                     assets_path: '/avatars/',
                                     seed: 0,
                                     w: 256,
                                     h: 256,
                                     parts: {
                                       'body':      {url_prefix: 'body', qtd: 15},
                                       'fur':       {url_prefix: 'fur', qtd: 10},
                                       'eyes':      {url_prefix: 'eyes', qtd: 15},
                                       'mouth':     {url_prefix: 'mouth', qtd: 10 },
                                       'acessorie': {url_prefix: 'accessorie', qtd: 20},
                                       //'zz':        {url_prefix: 'zz', qtd: 2}
                                     }} , opts )
      this.seed = this.options.seed;
      this.addClassOnceFor = cacheFunctionFor( this.addClass )
      this.addCanvas()
      this.render()
    }

    // get the image URL for body `part` `i`
    cattyURL(part, i){
      return this.options.assets_path + (this.options.parts[part].url_prefix + '_' +
                                        ((i % this.options.parts[part].qtd )+1) + '.png')
    }


    // set seed from a Number or a String.
    seedStart( startSeed ){
      let parseStr = ( seed ) => { return seed.split('').reduce( (a,b) => {return a + b.charCodeAt()}, 0) }
      let error    = ()       => { throw TypeError("meowatar - Seed must be a number or string") }

      this._seed = ((typeof startSeed == 'number')
                    ? startSeed
                    : (typeof startSeed == 'string')
                       ?  parseStr(startSeed)
                       : error() )
    }

    /* pseudo-random with seed reproducibility
     * Repeats every 233280 iteractions
     * https://en.wikipedia.org/wiki/Linear_congruential_generator
     */
    seededRandom(max, min) {
        max = max || 1000;
        min = min || 0;

        this._seed = (this._seed * 9301 + 49297) % 233280;
        var rnd = this._seed / 233280;

        return Math.floor( min + rnd * (max - min));
    }

    addCanvas() {
      this.containers = document.querySelectorAll(this.options.selector)
      this.canvas_el = document.createElement('canvas')
      this.canvas_el.width = this.options.w; this.canvas_el.height = this.options.h;
    }
    getDataURL(){ return this.canvas_el.toDataURL(); }



    // load a single image Element
    loadImage(name, img_uri){
      return new Promise( (resolve, reject) => {
        var newImg = new Image()
        newImg.src = img_uri
        newImg.onload = () => { resolve(newImg) }
        newImg.onerror = () => { reject(newImg) }
        return newImg
      })
    }

    /*
     * Load a group of images: [['name',imgURL], ...] , returns a promise
     */
    preloadImages( imagesURL ) {
      return Promise.all( imagesURL.map( ([name,url]) => {
        return this.loadImage(name,url).then( (img) => {
          return [name, img]
        })
      }))
    }

    getCtx(){
      if(!this.canvas_el)
          this.addCanvas()
      return this.canvas_el.getContext('2d')
    }

    drawImg( img ){
      this._ctx.drawImage(img, 0,0, this.options.w, this.options.h )
    }

    addClass( el, klass ) {
      $(el).className += (' ' + klass)
    }

    // show avatar on the <img> tag of parent Element
    showImage( container_el , dataURL ) {
      let img = $(container_el).querySelector( this.options.img_tag )
      img.src = dataURL
    }

    /*
     * Render every selector matched
     */
    render(){
      this.containers.forEach( (el) => {
        let seed = el.getAttribute('data-seed') || this.seed
        window.requestAnimationFrame( this.draw.bind( this, seed , el) )
      })
    }

    /* Create a new avatar from the seed.
       The same seed will yield always the same avatar
       Renders to EL
     */
    draw( startSeed=Math.floor( Math.random()*1000) , el=this.containers[0]) {
      this.seedStart(startSeed)
      this._ctx = this.getCtx()

      let _imagesURL = [   ['body',       this.cattyURL('body',this.seededRandom())],
                           ['fur',        this.cattyURL('fur', this.seededRandom())],
                           ['eyes',       this.cattyURL('eyes',this.seededRandom())],
                           ['mouth',      this.cattyURL('mouth',this.seededRandom())],
                           ['acessorie',  this.cattyURL('acessorie',this.seededRandom())],
                        ]

      // load all images
      this.preloadImages( _imagesURL).then( (imgs) => {
        let _images = fromPairs(imgs)

        // now draw it on <el>
        this._ctx.clearRect(0,0, this.options.w, this.options.h)
        this.drawImg( _images.body )
        this.drawImg( _images.fur )
        this.drawImg( _images.eyes )
        this.drawImg( _images.mouth )
        this.drawImg( _images.acessorie )

        // and show as a <img> tag
        this.showImage( el , this.getDataURL() )
        this.addClassOnceFor( el, 'loaded')
      })
    }
  }

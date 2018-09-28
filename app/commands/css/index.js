'use strict'

const Massage = class {
  get command () {
    return 'css'
  }
  get alias () {
    return null
  }
  get description () {
    return 'Save other CSS files inside CSS directory'
  }
  get options () {
    return []
  }
  get onInit () {
    return false
  }
  get onForge () {
    return true
  }  
  get onDone () {
    return false
  }
  action () {
    const agartha = process.agartha
    const path = require('path')
    try {
      const app = agartha.appDir()
      const build = agartha.appBuildDir()
      const sassConfiguration = agartha.configurations.sass()
      const { sassy } = require(path.join(agartha.cwd(), 'lib/transform/sass.js'))
      const write = require(path.join(agartha.cwd(), 'lib/write'))
      const sass = new sassy()      

      let ie8Result = sass.renderSync({
        file: path.join(app, 'app/sass/ie8.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/ie8.css'), ie8Result.css.toString())

      let ie7Result = sass.renderSync({
        file: path.join(app, 'app/sass/ie7.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/ie7.css'), ie7Result.css.toString())

      let adnResult = sass.renderSync({
        file: path.join(app, 'app/sass/rosie-html5-alpha-default-normal.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/rosie-html5-alpha-default-normal.css'), adnResult.css.toString())

      let adn12Result = sass.renderSync({
        file: path.join(app, 'app/sass/alpha-default-normal-12.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/alpha-default-normal-12.css'), adn12Result.css.toString())      

      let c1 = sass.renderSync({
        file: path.join(app, 'app/sass/rosie-html5-alpha-default-narrow.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/rosie-html5-alpha-default-narrow.css'), c1.css.toString())      

      let c2 = sass.renderSync({
        file: path.join(app, 'app/sass/alpha-default-narrow-12.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/alpha-default-narrow-12.css'), c2.css.toString())  

      let c3 = sass.renderSync({
        file: path.join(app, 'app/sass/rosie-html5-alpha-default-wide.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/rosie-html5-alpha-default-wide.css'), c3.css.toString())  

      let c4 = sass.renderSync({
        file: path.join(app, 'app/sass/alpha-default-wide-12.scss'),
        outputStyle: sassConfiguration.dist.options.style
      })

      write(path.join(build, 'css/alpha-default-wide-12.css'), c4.css.toString())  
      
      
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = exports = Massage

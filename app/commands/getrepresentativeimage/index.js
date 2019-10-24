'use strict'

const GetrepResentativeImage = class {
  get command () {
    return 'getrepresentativeimage'
  }
  get alias () {
    return 'gri'
  }
  get description () {
    return 'Get representative image for each interview'
  }
  get options () {
    return []
  }
  get onInit () {
    return false
  }
  get onDone () {
    return false
  }
  action () {
    const agartha = process.agartha
    try {
      let localsource = agartha.read.json(agartha.path.join(agartha.appDir(), 'app/localsource/interviews.json'))
      const representativeImageDir = agartha.path.join(agartha.appDir(), 'app/images')
      const docs = localsource.response.docs    
      const search = 'http://sites.dlib.nyu.edu/rosie'
      const replace = ''
      let basename = null
      agartha._.each(localsource.response.docs, (document) => {        
        let image = document.metadata.rosie_representative_image.value[0]
        let imageBasename = agartha.path.basename(image)     
        let name = document.identifier + '-interview-thumbnail' + agartha.path.extname(image)
        agartha.request(image).pipe(agartha.fs.createWriteStream(agartha.path.join(representativeImageDir, name)))
      })
    } catch (e) {
      console.log(e)
      agartha.exit(e)
    }
  }
}

module.exports = exports = GetrepResentativeImage

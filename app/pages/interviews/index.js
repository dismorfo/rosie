function front (data) {

  'use strict';

  // Agartha should be in in the process Object by now.
  // if not, we are not running inside Agartha CLI; kill
  if (process.agartha === undefined) process.exit()

  const agartha = process.agartha
  
  agartha.emit('task.done', data)

}

exports.front = front


const { 
  appBuildDir, 
  Command, 
  get
} = require('hephaestus');

module.exports = class SyncAmazonS3Bucket extends Command {

  get command () {
    return 'sync-amazons3bucket';
  }

  get description () {
    return 'SyncAmazonS3Bucket';
  }

  action () {
    try {

      const s3 = require('s3-node-client');
      const accessKeyId = get('S3_ACCESSKEY');
      const secretAccessKey = get('S3_SECRET');
      const region = get('S3_REGION');
      const bucket = get('S3_BUCKET');
      const acl = 'public-read';
      const deleteRemoved = true;
      const localDir = appBuildDir();

      const client = s3.createClient({
        s3Options: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          region: region,
        },
      });

      const uploader = client.uploadDir({
        localDir: localDir,
        deleteRemoved: deleteRemoved,
        s3Params: {
          Bucket: bucket,
          ACL: acl,
        },
      });

      uploader.on('error', (err) => {
        console.error('unable to sync:', err.stack);
      });

      uploader.on('progress', () => {
        console.log('progress', uploader.progressAmount, uploader.progressTotal);
      });

      uploader.on('end', () => {
        console.log('done uploading');
      });

    } catch (error) {
      console.log(error);
    }

  }
};

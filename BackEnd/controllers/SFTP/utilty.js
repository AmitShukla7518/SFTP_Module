let Client = require('ssh2-sftp-client');

let client = new Client();
/**
 * @function connect
 * @param {*} Object_Witch_Contains_Host_Port_.....
 * @returns Return Connection Massage
 */


exports.connect = async function (options) {
    
    try {
        await client.connect(options);
        return(`Connecting to ${options.host}:${options.port}`);
   } catch (err) {
        return err
    }
}

/**
 * @function disconnect
 */
exports.disconnect = async function () {
    await  client.end();
}


/**
 * @function listFiles
 * @param {*} remoteDir_and_FileGlobllyDefine
 * @returns Return All List of All Files
 */
exports.listFiles = async function (remoteDir, fileGlob) {
   
    let fileObjects;
    try {
        fileObjects = await  client.list(remoteDir, fileGlob);
        return fileObjects
    } catch (err) {
        return err;
    }

    const fileNames = [];

    for (const file of fileObjects) {
        if (file.type === 'd') {
            console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
        } else {
            console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
        }

        fileNames.push(file.name);
    }

    return fileNames;
}

/**
 * @function uploadFile
 * @param {*} LocalFile ,Remote File
 * @returns Return  Massage
 */
exports.uploadFile = async function (localFile, remoteFile) {
    console.log(`Uploading ${localFile} to ${remoteFile} ...`);
    try {
        await  client.put(localFile, remoteFile);
    } catch (err) {
        console.error('Uploading failed:', err);
    }
}


/**
 * @function downloadFile
 * @param {*} RemoteFile ,Local File
 * @returns Return  Massage
 */
  exports.downloadFile= async function(remoteFile, localFile) {
    console.log(`Downloading ${remoteFile} to ${localFile} ...`);
    try {
      await  client.get(remoteFile, localFile);
    } catch (err) {
      console.error('Downloading failed:', err);
    }
  }



/**
 * @function deleteFile
 * @param {*} RemoteFile
 * @returns Return  Massage
 */
  exports.deleteFile  = async function(remoteFile) {
    console.log(`Deleting ${remoteFile}`);
    try {
      await  client.delete(remoteFile);
    } catch (err) {
      console.error('Deleting failed:', err);
    }
  }

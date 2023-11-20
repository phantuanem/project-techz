const drive = require('./drive')
const stream = require("stream");

class Upload {
    async setFilePublic(fileId) {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })

            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink'
            })

            return getUrl.data;
        } catch (error) {
            console.error(error);
        }
    }

    async uploadFile(dataFile, folderID, nameFile, typeFile) {
        try {
            const uploadImg = dataFile.split(/,(.+)/)[1];
            const buf = new Buffer.from(uploadImg, "base64"); // Added
            const bs = new stream.PassThrough(); // Added
            bs.end(buf);
            const createFile = await drive.files.create({
                requestBody: {
                    name: nameFile,
                    mimeType: typeFile,
                    parents: folderID ? [`${folderID}`] : ''
                },
                media: {
                    mimeType: 'image/jpg',
                    body: bs
                }
            })
            const fileId = createFile.data.id;
            const getUrl = await this.setFilePublic(fileId);
            return {
                fileId,
                linkDownload: getUrl.webContentLink,
                linkView: 'https://drive.google.com/uc?export=view&id=' + fileId
            }

        } catch (error) {
            console.error(error);
        }
        return false
    }

    async deleteFile(fileId) {
        try {
            console.log('Delete File:::', fileId);
            const deleteFile = await drive.files.delete({
                fileId: fileId
            })
            return deleteFile.status
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new Upload
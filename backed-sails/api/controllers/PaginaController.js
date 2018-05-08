// carrega libs
const Storage = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');


// configura o Google Cloud
const CLOUD_ID = 'sgcc-182614';
const CLOUD_BUCKET = 'sgcc-storage-data';

const storage = Storage({
    projectId: CLOUD_ID,
    keyFileName: '../../gcloud-key.json'
});
const bucket = storage.bucket(CLOUD_BUCKET);

// configura o Google Vision Api
const visionClient = new vision.ImageAnnotatorClient({
    keyFileName: '../../gcloud-key.json'
});

module.exports = {

    uploadPagina(req, res) {

        console.log(req.body);
        console.log(req.file);

        if (!req.file) {
            return res.badRequest('Arquivo não enviado');
        }

        req.file('page').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000
        }, (err, uploadedFiles) => {
            if (err) {
                console.log(err);
                return res.badRequest(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            }

            const bucket = storage.bucket(CLOUD_BUCKET);

            bucket
                .upload(uploadedFiles[0].fd)
                .then(item => {

                    Pagina.create({
                        scan: getPublicUrl(item[0].id),
                        pagina: req.body.pagina,
                        livro: req.body.livroId
                    }).exec( (erro, ok) => {
                        if (erro) return res.badRequest(erro);

                        visionClient
                            .documentTextDetection(`gs://${CLOUD_BUCKET}/${item[0].id}`)
                            .then(results => {
                                const fullTextAnnotation = results[0].fullTextAnnotation;
                                console.log(fullTextAnnotation.text);
                                res.json({fileUrl: getPublicUrl(item[0].id), file: item[0].id, texto: fullTextAnnotation.text});
                            })
                            .catch(errs => {
                                res.badRequest(errs);
                            });
                    });
                    // res.json({fileUrl: getPublicUrl(item[0].id), file: item[0].id});
                })
                .catch(error => {
                    console.log(error);
                    res.badRequest(error);
                });
        });

    }  

};

function getPublicUrl (filename) {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
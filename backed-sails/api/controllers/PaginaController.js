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
                    console.log('# upload OK');
                    console.log(item[0].id);

                    Pagina.create({
                        scan: getPublicUrl(item[0].id),
                        pagina: req.body.pagina,
                        livro: req.body.livroId
                    }).exec( (erro, ok) => {
                        if (erro) return res.badRequest(erro);

                        console.log('# pagina OK');

                        visionClient
                            .documentTextDetection(`gs://${CLOUD_BUCKET}/${item[0].id}`)
                            .then(results => {
                                console.log('# vision OK');

                                if (results && results instanceof Array && results.length && results[0].fullTextAnnotation && results[0].fullTextAnnotation.text) {
                                    console.log('# OCR OK');
                                    res.json({ok: true, pagina: ok, fileUrl: getPublicUrl(item[0].id), file: item[0].id, texto: results[0].fullTextAnnotation.text});
                                } else {
                                    res.json({ok: false, pagina: ok, fileUrl: getPublicUrl(item[0].id), file: item[0].id});
                                }
                            })
                            .catch(errs => {
                                console.log('# vison ERR');
                                res.badRequest(errs);
                            });
                    });
                    // res.json({fileUrl: getPublicUrl(item[0].id), file: item[0].id});
                })
                .catch(error => {
                    console.log('# upload ERR');
                    res.badRequest(error);
                });
        });

    },

    teste(req, res) {
        visionClient
            .documentTextDetection(`gs://${CLOUD_BUCKET}/pagina.jpg`)
            .then(results => {
                res.json(results);
            })
            .catch(errs => {
                res.badRequest(errs);
            });
    }

};

function getPublicUrl (filename) {
    return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
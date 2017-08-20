/**
 * Classifies an image
 * @param req.body.url The URL for an image either.
 *                     images/test.jpg or https://example.com/test.jpg
 * @param req.file The image file.
 */
app.post('/api/classify', app.upload.single('images_file'), function(req, res) {
  var params = {
    url: null,
    images_file: null
  };

  if (req.file) { // file image
    params.images_file = fs.createReadStream(req.file.path);
  } else if (req.body.url && req.body.url.indexOf('images') === 0) { // local image
    params.images_file = fs.createReadStream(path.join('public', req.body.url));
  } else if (req.body.image_data) {
    // write the base64 image to a temp file
    var resource = parseBase64Image(req.body.image_data);
    var temp = path.join(os.tmpdir(), uuid.v1() + '.' + resource.type);
    fs.writeFileSync(temp, resource.data);
    params.images_file = fs.createReadStream(temp);
  } else if (req.body.url) { // url
    params.url = req.body.url;
  } else { // malformed url
    return res.status(400).json({ error: 'Malformed URL', code: 400 });
  }

  if (params.images_file) {
    delete params.url;
  } else {
    delete params.images_file;
  }
  var methods = [];
  if (req.body.classifier_id || process.env.OVERRIDE_CLASSIFIER_ID) {
    params.classifier_ids = req.body.classifier_id ? [req.body.classifier_id] : [process.env.OVERRIDE_CLASSIFIER_ID];
    methods.push('classify');
  } else {
    params.classifier_ids = ['default', 'food'];
    params.threshold = 0.5; //So the classifers only show images with a confindence level of 0.5 or higher
    methods.push('classify');
    methods.push('detectFaces');
    methods.push('recognizeText');
  }

  // run the 3 classifiers asynchronously and combine the results
  async.parallel(methods.map(function(method) {
    var fn = visualRecognition[method].bind(visualRecognition, params);
    if (method === 'recognizeText' || method === 'detectFaces') {
      return async.reflect(async.timeout(fn, TWENTY_SECONDS));
    } else {
      return async.reflect(fn);
    }
  }), function(err, results) {
    // delete the recognized file
    if (params.images_file && !req.body.url) {
      deleteUploadedFile(params.images_file);
    }

    if (err) {
      console.log(err);
      return res.status(err.code || 500).json(err);
    }
    // combine the results
    var combine = results.map(function(result) {
      if (result.value && result.value.length) {
        // value is an array of arguments passed to the callback (excluding the error).
        // In this case, it's the result and then the request object.
        // We only want the result.
        result.value = result.value[0];
      }
      return result;
    }).reduce(function(prev, cur) {
      return extend(true, prev, cur);
    });
    if (combine.value) {
      // save the classifier_id as part of the response
      if (req.body.classifier_id) {
        combine.value.classifier_ids = req.body.classifier_id;
      }
      combine.value.raw = {};
      methods.map(function(methodName, idx) {
        combine.value.raw[methodName] = encodeURIComponent(JSON.stringify(results[idx].value));
      });
      res.json(combine.value);
    } else {
      res.status(400).json(combine.error);
    }
  });
});

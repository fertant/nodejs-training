import fs from 'fs';
import csvjson from 'csvjson';
import { promisify } from 'util';

class Importer {

  import(path) {
    var readFileAsync = promisify(fs.readFile);
    return readFileAsync(path, { encoding : 'utf8'})
      .then((content) => {
        content = csvjson.toObject(content, {delimiter : ',', headers : 'id,data'});
        console.log(content);
      })
      .catch((error) => {
        console.error(error);
        throw error;
    });
  }

  importSync(path) {
    var data = fs.readFileSync(path, { encoding : 'utf8'});
    data = csvjson.toObject(data, {delimiter : ',', headers : 'id,data'});
    console.log(data);
    return data;
  }
}

module.exports = new Importer();

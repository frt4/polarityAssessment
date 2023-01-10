var axios = require('axios');
const shodan = 'https://internetdb.shodan.io/';
const successStatusCode = 200;

/**
 * The `doLookup` method should query the Shodan InternetDB for each IPv4 address passed into the `entities`
 * parameter.  You can try your method out by running the command `npm run search` in the root of this project.
 *
 * @param entities {Array} - An array of entity objects.  See `.data/input.json` for an example of what the `entities`
 * parameter looks like.
 * @returns {Promise<*[]>} - An array of results objects (See README.md for the full output specification).
 */
async function doLookup(entities) {
    const lookupResults = [];
    // Add additional logic here that will query the Shodan InternetDB API
    // and add the results to the `lookupResults` array.
    // Please see the README.md for full instructions

    let requests = [];
    // build out the request objects
    for (let i = 0; i < entities.length; i++) {
        // make sure the value exists
        if (entities[i].value) {
            const fullUrl = shodan + entities[i].value;
            requests.push(axios.get(fullUrl, {
                validateStatus: function(status) {
                    return status; // return all status codes as they will just be logged as data null
                }
            }));
        }
        
    }

    await axios.all(requests)
    .then(await function(results) {
        results.forEach(result => {
            if (result.status === successStatusCode) {
                const index = entities.findIndex((x) => x.value === result.request.path.substring(1));
                if (index !== -1) {
                    lookupResults.push({
                        entity: entities[index],
                        data: result.data
                    });
                }
            }
            else {
                const index = entities.findIndex((x) => x.value === result.request.path.substring(1));
                if (index !== -1) {
                    lookupResults.push({
                        entity: entities[index],
                        data: null
                    });
                }
            }
        });
    }).catch(error => {
        console.log(error);
    });

    return lookupResults;
}

module.exports = {
    doLookup
}
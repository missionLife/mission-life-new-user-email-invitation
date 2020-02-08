import fetch from 'node-fetch';


export default async function fetchWrapper(url, options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError(`options in fetchWrapper must be an object.  Value provided: ${options}`);
  }

  if (!url || typeof url !== 'string') {
    throw new TypeError(`url in fetchWrapper must be a string.  Value provided: ${url}`);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error while fetching URL - ${url} - Status Code: ${response.status} - options - ${JSON.stringify(options)}`);
  }

  return response.json();
}
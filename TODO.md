# sending image urls over request instead of base64 data

// local image, encode as base64
// url image, convert to base64

// send all base64 images over request to endpoint
// download all base64 images

// ALTERNATIVE
// not convert all img elements to base64

// but instead
// local images and uploaded and we get link
// url images stay url

// we send urls in elementsObjects for images
// other elements are encoded as base64 images
// but large data content, ie image elements are just sent as urls

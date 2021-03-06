export const blobify = (list = []) => {
  // takes list and returns blobs of 25 or less because Dynamo is a lil bitch
  const isObject = list.constructor === Object;
  const arrayList = isObject ? Object.keys(list) : list;

  return arrayList.reduce((blob, next) => {
    const item = isObject ? list[next] : next; // returns full item whether list is Object or Array
    const filledBlobs = [...blob].slice(0, (blob.length - 1)); // extracts all but last blob
    const lastBlob = blob[blob.length - 1];
    return (lastBlob.length < 25) ?
      [...filledBlobs, [...lastBlob, item]] : // blob isn't full so add item to it
      [...blob, [item]]; // last blob was full so start new blob
  }, [[]]); // instantiate with nested array for return statement logic
};

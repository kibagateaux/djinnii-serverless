export const blobify = (list = []) => {
  // takes list and returns blobs of 25 or less because Dynamo is a lil bitch
  const isObject = list.constructor === Object;
  const arrayList = isObject ? Object.keys(list) : list;

  return arrayList.reduce((blob, next) => {
    const lastBlob = blob[blob.length - 1];
    const filledBlobs = [...blob].slice(0, (blob.length - 1));
    const item = isObject ? list[next] : next; // returns full item whether list is Object or Array
    return (lastBlob.length < 25) ?
      [...filledBlobs, [...lastBlob, item]] :
      [...blob, [item]];
  }, [[]]);
};

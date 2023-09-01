exports.Requestment = ({ request, data }) => {
  try {
    let invalid = {};
    if (data == undefined) data = {};
    for (const key in request) {
      if (Object.hasOwnProperty.call(request, key)) {
        const el = request[key];
        if (data[el] == "" || data[el] == undefined) {
          invalid[el] = "request";
        }
      }
    }
    return invalid;
  } catch (err) {
    return res.json({ error: true });
  }
};

exports.EmailValidation = (email) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }

  return false;
};
exports.ValidateIPaddress = (str) => {
  var ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (str !== "" && str.match(ipFormat)) {
    return true;
  }

  return false;
};
exports.LowerCase = (str) => {
  return str.toLowerCase();
};

exports.Allow = (link) => {
  try {
    const matchGGD =
      /(?:https?:\/\/)?(?:[\w\-]+\.)*(?:drive|docs)\.google\.com\/(?:(?:folderview|open|uc)\?(?:[\w\-\%]+=[\w\-\%]*&)*id=|(?:folder|file|document|presentation)\/d\/|spreadsheet\/ccc\?(?:[\w\-\%]+=[\w\-\%]*&)*key=)([\w\-]{28,})/i;
    const matchMP4 = /([\w\-]{1,200})\.(mp4)$/i;

    const setData = {};
    setData.status = true;

    if (matchGGD.test(link)) {
      const match = link.match(matchGGD);
      setData.source = match[1];
      setData.type = "gdrive";
    } else if (matchMP4.test(link)) {
      const match = link.match(matchMP4);
      setData.title = match[1];
      setData.type = "direct";
      setData.source = source;
    } else {
      setData.status = false;
    }
    return setData;
  } catch (error) {
    return;
  }
};

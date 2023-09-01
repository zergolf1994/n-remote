"use strict";

const { File } = require("../models");

exports.Token = (length = 10) => {
  let result = "",
    characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.Slug = async (length = 10) => {
  let result = "",
    characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const exist = await File.List.findOne({ slug: result });
  if (exist?._id) return this.Token(20);
  
  return result;
};

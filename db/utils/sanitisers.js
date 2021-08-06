exports.numberSanitiser = (number) => {
  const parsednumber = parseInt(number);
  if (!Number.isNaN(parsednumber)) {
    return parsednumber.toString();
  } else return "NaN";
};

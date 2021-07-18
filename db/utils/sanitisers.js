exports.limitSanitiser = (limit) => {
  const parsedLimit = parseInt(limit);
  if (!Number.isNaN(parsedLimit)) {
    return parsedLimit.toString();
  } else return "NaN";
};

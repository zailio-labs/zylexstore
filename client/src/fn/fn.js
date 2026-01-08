export const makeid = (num = 12) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var characters9 = characters.length;
  for (var i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters9));
  }
  return result;
};
function removeTrailingZeroes(value) {
    return parseFloat(value.toFixed(1)).toString();
};
export function formatNumber(num) {
    if (num >= 1000000) {
        return removeTrailingZeroes(num / 1000000) + 'm';
    } else if (num >= 1000) {
        return removeTrailingZeroes(num / 1000) + 'k';
    } else {
        return num.toString();
    }
};
export function roundNumber(n) {
  if (n < 100) {
    return Math.ceil(n / 10) * 10 + '+';
  } else if (n < 1000) {
    return Math.ceil(n / 100) * 100 + '+';
  } else if (n < 10000) {
    return (Math.ceil(n / 100) * 100 / 1000).toFixed(1) + 'k+';
  } else if (n < 100000) {
    return (Math.ceil(n / 1000) * 1000 / 1000).toFixed(1) + 'k+';
  } else {
    return (Math.ceil(n / 100000) * 100000 / 100000).toFixed(1) + 'L+';
  }
};
export const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

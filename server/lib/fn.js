const makeid = (num = 12, type='both') => {
  let result = "";
  const characters =
    type == 'int' ? '0123456789': type=='str' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters9 = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters9));
  }
  return result;
};

const filterMostSuitable = (searchTerm, listedData) => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const scoredlistedData = listedData.map(item => {
        let score = 0;
        if (searchTerms.some(term => item.name.toLowerCase().includes(term))) {
            score += 3; // Increment score if title matches
        }
        if(item.tags.includes(',')) {
          item.tags.split(',').forEach(tag => {
            if (searchTerms.includes(tag.toLowerCase())) {
                score += 1; // Increment score for each matching tag
            }
          }) 
        } else {
          [item.tags].forEach(tag => {
            if (searchTerms.includes(tag.toLowerCase())) {
                score += 1; // Increment score for each matching tag
            }
          })
        }
        return { item, score };
    });
    scoredlistedData.sort((a, b) => b.score - a.score);
    return scoredlistedData.map(scoreditem => scoreditem.item);
};
module.exports = {makeid,filterMostSuitable}

var random = function() {

  return function random(team, size, isSexSensitive, isForceSizeAsMemberCountInGroup) {
    return didive(split(team), size, isSexSensitive, isForceSizeAsMemberCountInGroup);
  };

  function split(team) {
    return team.reduce(function(result, current) {
      result[current.sex].push(current);
      return result;
    }, { female: [], male: [], length: team.length })
  }

  function didive(team, size, isSexSensitive, isForceSizeAsMemberCountInGroup) {
    var female = team.female;
    var male = team.male;

    // 当选择 sex sensitive 的时候，我们大多数情况希望以每组多少人来算
    // 比如分房，每组是 2 人，所以 size 在这里的设定不是「多少组」
    if(isSexSensitive) {
      return loop(female, Math.ceil(female.length / size))
        .concat(loop(male, Math.ceil(male.length / size)));
    }

    // 可以强制按每组多少人来计算，而不区分性别,那需要分的组数为:Math.ceil(team.length / size)
    if(isForceSizeAsMemberCountInGroup) size = Math.ceil(team.length / size);

    var females = loop(female, size);//把女生随机分成size组
    var males = loop(male, size).reverse();//把男生随机分成size组

    /**
     * 这里把males和females的值对换，为了下面map遍历females的时候是遍历长度长的一组性别，
     * 合并数组的时候能覆盖短的一组，短的不够的部分作为为[]合并
     */
    if(females.length - males.length < 0) females = [males, males = females][0];
    return females.map(function(group, i) {
      return group.concat(males[i] || []);//
    });
  }

  /**
   * arr要分组的群体
   * size全体要分成的组数
   */
  function loop(arr, size){
    var i = 0;
    var result = [];

    while(arr.length) {//当数组元素都分出去后，长度为0
      var index = Math.floor(Math.random() * arr.length);
      if(!result[i]) result[i] = [];
      result[i].push(arr.splice(index, 1)[0]);//往i组分一个成员
      if(++i === size) i = 0;//当i===size时，表示经过一次循环往size组中每组分了一个，把i=0,继续再次循环分成员，知道循环结束
    }

    return result;
  }
}();

// node
try{
  process.argv;
  module.exports = random;
} catch(e) {};

export default {
  /**
   * 字符串判空
   * @param str 字符串
   */
  isNullOrEmpty(str){
    return !str || typeof str == 'undefined' || str == ''
  },
  isBase64,
  isJSON,
  isArray,
  isNumber,
  isChinaPoneNumber,
  isEmail,
  mergeJSON,
  mergeJsonArray,

  /**
   * 生成不重复随机数
   * @param randomLength 字符长度
   */
  genNonDuplicateID(randomLength){
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substr(3,randomLength)
    return idStr
  },
  /**
   * 通过一个B的文件大小获取可读的文件大小字符串
   * @param filesize 文件大小 单位B
   */
  getReadableFileSize(filesize : number){
    let sizeStr = '';
    if(filesize >= 1073741824){
      filesize = Math.round(filesize/1073741824*100)/100;
      sizeStr = filesize + "GB";
    }else if(filesize >= 1048576) {
      filesize = Math.round(filesize/1048576*100)/100;
      sizeStr = filesize + "MB";
    }else{
      filesize = Math.round(filesize/1024*100)/100;
      sizeStr = filesize + "KB";
    }
    return sizeStr;
  },

  getFriendlyTime() {
    let now = new Date(), hour = now.getHours() 
    if (hour < 9){return("早上")} 
    else if (hour < 12){return("上午")} 
    else if (hour < 14){return("中午")} 
    else if (hour < 17){return("下午")} 
    else if (hour < 19){return("傍晚")} 
    else return "晚上"
  },

  /**
   * 在 value/label 的数组中查找
   * @param list 数组
   * @param value value
   */
  findInList(list : Array<{
    value: number,
    label: string
  }>, value : number) {
    for (let i = 0; i < list.length; i++) {
      if(value == list[i].value)
        return list[i];
    }
    return null;
  },
  
  pad,
  formatNumberWithComma,

  clone,
  cloneValue,

  swapItems,
  upData,
  downData,

  setCookie,
  getCookie,
  delCookie,

  calcTimeSurplus,
  /**
   * 转换时间为 刚刚、几分钟前、几小时前、几天前...
   * @param dateTimeStamp 时间
   */
  calcTimeAgo(time : Date) { 
    
    if(!time) 
      return '神秘时间';
    
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var year = day * 365;
    var now = new Date().getTime();
    var diffValue = now - time.getTime();
    var result;
    if (diffValue < 0) {
        return;
    }
    var yearC = diffValue / year;
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (yearC >= 1) {
        result = Math.floor(yearC) + "年前";
    } else if (monthC >= 1) {
        result = Math.floor(monthC) + "月前";
    } else if (weekC >= 1) {
        result = Math.floor(weekC) + "周前";
    } else if (dayC >= 1) {
        result = Math.floor(dayC) + "天前";
    } else if (hourC >= 1) {
        result = Math.floor(hourC) + "小时前";
    } else if (minC >= 1) {
        result = Math.floor(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
  },


  setClassWithSwitch(el : HTMLElement, on : boolean, class1 : string, class2 : string) {
    if(on) {
      if(el.classList.contains(class1))el.classList.remove(class1);
      if(!el.classList.contains(class2))el.classList.add(class2);
    }else {
      if(el.classList.contains(class2))el.classList.remove(class2);
      if(!el.classList.contains(class1))el.classList.add(class1);
    }
  }
}


/*
 * 功能：按千位逗号分割
 * 参数：s，需要格式化的数值.
 * 参数：type,判断格式化后是否需要小数位.
 * 返回：返回格式化后的数值字符串.
 */
function formatNumberWithComma(s, type) {
  if (/[^0-9\.]/.test(s))
      return "0";
  if (s == null || s == "")
      return "0";
  s = s.toString().replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(s))
      s = s.replace(re, "$1,$2");
  s = s.replace(/,(\d\d)$/, ".$1");
  if (type == 0) { // 不带小数位(默认是有小数位)
      var a = s.split(".");
      if (a[1] == "00") {
          s = a[0];
      }
  }
  return s;
}

/**
 * 克隆对象
 * @param {Object} obj 要克隆对象
 */
function clone(obj) {
  let temp = null;
  if (obj instanceof Array) {
    temp = obj.concat();
  } else if (obj instanceof Function) {
    //函数是共享的是无所谓的，js也没有什么办法可以在定义后再修改函数内容
    temp = obj;
  } else {
    temp = new Object();
    for (let item in obj) {
      let val = obj[item];
      if(val == null) temp[item] = null;
      else temp[item] = typeof val == 'object' ? clone(val) : val; //这里也没有判断是否为函数，因为对于函数，我们将它和一般值一样处理
    }
  }
  return temp;
}
/**
 * 将源对象每个属性都复制到目标对象（不管目标对象有没有对应属性）
 * @param {*} setObj 
 * @param {*} sourceObj 
 */
function cloneValue(setObj, sourceObj){
  if(!setObj || !sourceObj) return;
  Object.keys(setObj).forEach(function(key){
    if(typeof sourceObj[key] != 'undefined') {
      if(isJSON(setObj[key])) cloneValue(setObj[key], sourceObj[key]);
      else setObj[key] = sourceObj[key];
    }
  });
}


function mergeJSON(minor, main) {
  for (var key in minor) {
    if (main[key] === undefined) { // 不冲突的，直接赋值 
      main[key] = minor[key];
      continue;
    }
    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以（minor）为准为主，
    if (isJSON(minor[key]) || isArray(minor[key])) { // arguments.callee 递归调用，并且与函数名解耦 
      main[key] = mergeJSON(minor[key], main[key]);
    } else {
      main[key] = minor[key];
    }
  }
  return main;
}
function isJSON(target) {
  return target != null && typeof target == "object" && target.constructor == Object;
}
function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}
/**
 * 混合两个 JsonArray
 * @param {*} a 
 * @param {*} b 
 */
function mergeJsonArray(a, b) {
  var r = {};
  var i = 0;
  for (var key in a) {
    r[i] = a[key];
    i++;
  }
  for (var key in b) {
    r[i] = b[key];
    i++;
  }
  return r;
}

// 字符串操作
//================


/**
* 判断字符串是否是 Base64 编码
* @param {String} str 
*/
function isBase64(str) {
  return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
}
/**
 * 检测字符串是否是一串数字
 * @param {String} val 
 */
function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 数字补0
 */
function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}



// Cookie 操作
//================

/**
 * 设置 Cookie
 * @param {String} name Cookie 名称
 * @param {*} value 
 * @param {number} expires 过期时间（秒） 
 * @param {string} path 路径
 */
function setCookie(name, value, expires = 0, path = undefined) {
  var exp = new Date();
  exp.setTime(exp.getTime() + expires * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + (<any>exp).toGMTString() + (path ?  + ";path=" + path : '');
}
/**
 * 读取 Cookie
 * @param {String} name Cookie 名称
 */ 
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg))

    return unescape(arr[2]);
  else
    return null;
}
/**
 * 删除 Cookie
 * @param {String} name Cookie 名称
 */ 
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + (<any>exp).toGMTString();
}

//数组操作
//================

/**
 * 交换数组两个元素
 * @param {Array} arr 数组
 * @param {Number} index1 索引1
 * @param {Number} index2 索引2
 */
function swapItems(arr, index1, index2){
  　arr[index1] = arr.splice(index2,1,arr[index1])[0]
  　return arr
}
/**
 * 指定数组索引位置元素向上移
 * @param {Array} arr 数组
 * @param {Number} index 索引
 */
function upData (arr, index) {
  　if (arr.length > 1 && index !== 0)
  　　　return swapItems(arr, index, index - 1)
}
/**
 * 指定数组索引位置元素向下移
 * @param {Array} arr 数组
 * @param {Number} index 索引
 */
function downData (arr, index) {
  　if (arr.length > 1 && index !== (arr.length - 1))
    　　return swapItems(arr, index, index + 1)
}

//字符串工具
//================

/**
 * 检查字符串是否是中国的11位手机号
 * @param str 字符串
 */
function isChinaPoneNumber(str) {
  var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
      return false;
  } else {
      return true;
  }
}
/**
 * 检查字符串是否是邮箱
 * @param str 字符串
 */
function isEmail(str){
  var re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (re.test(str) != true) {
    return false;
  }else{
    return true;
  }
}

/**
 * 计算剩余时间为用户可读时间
 * @param limitTime 时间
 */
function calcTimeSurplus(limitTime : Date) {
  var date1 = new Date(limitTime);//开始时间
  //var date1=limitTime;  
  var date2=new Date();    //结束时间
 
  var date3=date1.getTime()-date2.getTime()  //时间差的毫秒数

  if(date3 <= 0) return '已经超过时间了';

  //计算出相差天数
  var days=Math.floor(date3/(24*3600*1000))
  //计算出小时数
  var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
  var hours=Math.floor(leave1/(3600*1000))
  //计算相差分钟数
  var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000))
  //计算相差秒数
  var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  var seconds=Math.round(leave3/1000)

  if(days > 0) return days + '天';
  else if(hours > 0) return hours + '小时';
  else if(minutes > 0) return minutes + '分钟';
  else if(seconds > 0) return seconds + '秒';
  
  return '已经超过时间了';
}
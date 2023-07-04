export function isEmpty(object) {
    if (object == null || object.size == 0) {
        return true;
    } else {
        return false;
    }
}

export function isNotEmpty(object) {
    return !isEmpty(object);
}

export function timeStampTurnTime(longTypeDate) {
    let dateTypeDate = "";
    let date = new Date();
    date.setTime(longTypeDate);
    dateTypeDate += date.getFullYear(); //年
    dateTypeDate += "-" + getMonth(date); //月
    dateTypeDate += "-" + getDay(date); //日
    dateTypeDate += " " + getHours(date); //时
    dateTypeDate += ":" + getMinutes(date);  //分
    dateTypeDate += ":" + getSeconds(date);  //分
    return dateTypeDate;
}

export function dateFormat(longTypeDate){
    let dateTypeDate = "";
    let date = new Date();
    date.setTime(longTypeDate);
    dateTypeDate += date.getFullYear(); //年
    dateTypeDate += "-" + getMonth(date); //月
    dateTypeDate += "-" + getDay(date); //日
    return dateTypeDate;
}
//返回 01-12 的月份值
export function getMonth(date){
    let month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if(month<10){
        month = "0" + month;
    }
    return month;
}
//返回01-30的日期
export function getDay(date){
    let day = "";
    day = date.getDate();
    if(day<10){
        day = "0" + day;
    }
    return day;
}
//小时
export function getHours(date){
    let hours = "";
    hours = date.getHours();
    if(hours<10){
        hours = "0" + hours;
    }
    return hours;
}
//分
export function getMinutes(date){
    let minute = "";
    minute = date.getMinutes();
    if(minute<10){
        minute = "0" + minute;
    }
    return minute;
}
//秒
export function getSeconds(date){
    let second = "";
    second = date.getSeconds();
    if(second<10){
        second = "0" + second;
    }
    return second;
}

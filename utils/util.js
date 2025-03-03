const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// Format Date to "01/01/2025"
function formatDate(date) {
  if (!(date instanceof Date)) {
    throw new TypeError('输入必须是一个 Date 对象');
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

// Return the next date if given a date, otherwise return today's date.
function getNextDate(dateStr){
  let date;
  if (!dateStr) {
    date = new Date();
  } else {
    const [month, day, year] = dateStr.split('/').map(Number);
    date = new Date(year, month - 1, day);
  }

  date.setDate(date.getDate() + 1);

  const nextMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const nextDay = date.getDate().toString().padStart(2, '0');
  const nextYear = date.getFullYear();

  return `${nextMonth}/${nextDay}/${nextYear}`;
}

// Get day by date
const getDay = (dateStr)=>{
  let date;
  if (!dateStr) {
    date = new Date();
  } else {
    const [month, day, year] = dateStr.split('/').map(Number);
    date = new Date(year, month - 1, day);
  }
  const dayOfWeek = date.getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

const debounce = (func, wait=3000)=>{
  let timeoutId;
  return function(...args){
    clearTimeout(timeoutId);
    timeoutId = setTimeout(()=>{
      func.apply(this,args);
    },wait);
  }
}

module.exports = {
  formatTime,
  debounce,
  formatDate,
  getNextDate,
  getDay
}

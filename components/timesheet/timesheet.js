// components/timesheet.js
const util = require('../../utils/util.js');
Component({
  properties: {
    data:{
      type: Object,
      value:{
        contact_person:"",
        location:"",
        service_engineer:"",
        work_days:[
          {
            day:"",
            date:"",
            project:"",
            in_time:"",
            out_time:"",
            hours:"",
            number_of_people:"",
            accumulated_hours:"",
            remark:""
          }
        ],
        total_hours:"",
      }  
    }
  },

  data: {
    localData:{},
  },

  lifetimes: {
    attached() {
      // Init localData
      // Deep copy due to Array content.
      this.setData({
        localData: JSON.parse(JSON.stringify(this.properties.data))
      });

      // debounce update data 1 second
      this.debouncedUpdateData = util.debounce(() => {
        this.triggerEvent('update', this.data.localData);
      }, 1000);
    }
  },

  observers: {
    'data': function(newData) {
      // Deep copy due to Array content.
      const localData = JSON.parse(JSON.stringify(newData));
      this.setData({ localData });
    }
  },

  methods: {
    // General onChange function
    bindKeyInput(e) {
      this.setData({
        [`localData.${e.currentTarget.dataset.params}`]: e.detail.value
      });
      this.debouncedUpdateData();
    },
    // Timesheet fill out.
    bindTableInput(e) {
      const index = e.currentTarget.dataset.index;
      const column = e.currentTarget.dataset.params;
      const value = e.detail.value;
      const newWorkDay = {
        ...this.data.localData.work_days[index],
        [column]:value
      }
      // Auto-fill hours
      if(column==="in_time"||column==="out_time"){
        let inTime,outTime;
        if(column==="in_time"){
          outTime = this.data.localData.work_days[index].out_time;
          inTime = value;
        }else{
          inTime = this.data.localData.work_days[index].in_time;
          outTime = value;
        }
        const hours = this.calculateHours(inTime,outTime);
        newWorkDay.hours = hours;
      }

      // Auto-fill day
      if(column==="date"){
        newWorkDay.day = util.getDay(value);
      }
      
      let newContent = this.data.localData.work_days.map((item, i) => 
        i === index ? newWorkDay : item
      );

      // Sort dates and Re-calculate accumulated hours
      newContent.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB; 
      });
      newContent.forEach((item, idx) => {
        const lastAccuHours = idx === 0 ? 0 : parseFloat(newContent[idx - 1].accumulated_hours);
        item.accumulated_hours = (lastAccuHours + parseFloat(item.hours)).toFixed(1);
      });

      this.setData({
        localData: {
          ...this.data.localData,
          work_days: newContent,
          total_hours: newContent[newContent.length-1].accumulated_hours
        }
      });
      
      this.debouncedUpdateData();
    },
    
    // Add a new line of Timesheet
    addNewLine() {
      const work_days_copy = this.data.localData.work_days;
      let nextDate;
      if(!work_days_copy||work_days_copy.length===0){
        nextDate = util.getNextDate();
      }else{
        nextDate = util.getNextDate(work_days_copy[work_days_copy.length-1].date)
      }
    
      const newWorkDay = {
        day: util.getDay(nextDate),
        date: nextDate,
        project:work_days_copy?work_days_copy[work_days_copy.length-1].project:"",
        number_of_people:work_days_copy?work_days_copy[work_days_copy.length-1].number_of_people:"",
      }
      const newContent = work_days_copy ? [...work_days_copy, newWorkDay] : [newWorkDay];
      this.setData({
        localData: {
          ...this.data.localData,
          work_days: newContent
        }
      });
      this.debouncedUpdateData();
    },

    // Delete 1 line of Timesheet
    deleteLine() {
      wx.showActionSheet({
        itemList: this.data.localData.work_days.map(item=>item.date),
        success: (res)=>{
          const newContent = this.data.localData.work_days.filter((_, i) => i !== res.tapIndex);
          this.setData({
            localData: {
              ...this.data.localData,
              work_days: newContent
            }
          });
        },
        fail: (rej)=>{
          console.log(rej.errMsg)
        }
      })
      
      this.debouncedUpdateData();
    },

    // Calculate working hour given inTime and outTime
    calculateHours(inTime, outTime) {
      function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      }
      function minutesToHours(minutes) {
        return (minutes / 60).toFixed(1);
      }
    
      // Check time format
      if (!/^\d{2}:\d{2}$/.test(inTime) || !/^\d{2}:\d{2}$/.test(outTime)) {
        return "";
      }
    
      // Calculate in minutes
      const inMinutes = timeToMinutes(inTime);
      const outMinutes = timeToMinutes(outTime);
      const workMinutes = outMinutes - inMinutes;
    
      if (workMinutes < 0) {
        throw new Error('outTime 必须晚于 inTime');
      }

      return minutesToHours(workMinutes);
    }
  }
})
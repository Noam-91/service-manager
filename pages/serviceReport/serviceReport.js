// pages/serviceReport/serviceReport.js
const util = require('../../utils/util.js')

Page({
  data: {
    jsonData:{
      vessel_name: "",
      imo: "",
      owner: "MSC",
      date: "",
      system: "EGCS",
      work_order: "",
      contact_person: "",
      service_engineer: "",
      location: "",
      departure_time: "",
      onboard_time: "",
      disembark_time: "",
      service_content: [],
      work_days:[
        {
          day:"",
          date:"",
          project:"EGCS",
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
  },

  onLoad() {
    
  },

  // Callback: update work report & timesheet
  onUpdateData(e){
    this.setData({
      jsonData:{...e.detail}
    }); 
  },

  // Prepare JSON data
  prepareData(){
    // Wait 1 second for recent data update due to debounce.
    return new Promise((resolve)=>{
      setTimeout(()=>{
        // Add numbers for service_content.
        const newData= {
                      ...this.data.jsonData,
                      service_content: this.data.jsonData.service_content.map((item,idx)=>`${idx+1}. ${item}`)
                    };
        
        resolve(JSON.stringify(newData)) ;
      },1000);
    })
  },

  // Calling cloud function to generate Doc file
  async generateDoc() {
    wx.showLoading({ title: '生成中...' })
    try{
      const preparedData = await this.prepareData();
      
      // Call cloud function
      const res = await wx.cloud.callFunction({
        name: 'generateWord',
        data: { jsonData: preparedData }
      })
    
      if (res.result.error) {
        wx.showToast({ title: '生成失败', icon: 'none' })
        return
      }
    
      const arrayBuffer = wx.base64ToArrayBuffer(res.result.fileBase64);
      
      // Create temp file and download
      const tempFilePath = `${wx.env.USER_DATA_PATH}/service report_${Date.now()}.docx`
      wx.getFileSystemManager().writeFile({
        filePath: tempFilePath,
        data: arrayBuffer,
        encoding: 'binary', 
        success: () => {
          wx.hideLoading();
          wx.openDocument({
            filePath: tempFilePath,
            showMenu: true,
            fileType: 'docx'
          })
        }
      })
    }catch(err){
      console.error(err);
    }finally{
      wx.hideLoading()
    }
  }
})
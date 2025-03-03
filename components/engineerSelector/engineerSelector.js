// components/engineerSelector/engineerSelector.js
Component({
  properties: {
    engineer:{
      type:String,
      value:""
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        service_engineer: this.properties.engineer
      });
    }
  },
  
  data:{
    service_engineer: "",
    engineerOptions:["Xu Yan",
      "Dukaixuan Ling",
      "Chongyang Wang",
      "Ke Lin",
      "Jingyang Li", 
      'New'
    ],
    newEngineerName: '', 
    showAddDialog:false
  },
  methods:{
    onSelectEngineer(e) {
      const index = e.detail.value;
      const selected = this.data.engineerOptions[index];
      if (selected === "New") {
        this.setData({ showAddDialog: true }); // Open Modal
      } else {
        this.updateSelectedEngineers(selected);
      }
    },
  
    // Update service_engineer
    updateSelectedEngineers(name) {
      const current = this.data.service_engineer.split(" / ").filter(x => x);
      if (!current.includes(name)) {
        current.push(name);
        this.setData({ service_engineer: current.join(" / ") });
        // trigger callback
        this.triggerEvent('engChange',{service_engineer: this.data.service_engineer});
      }
    },
  
    // handle new engineer name
    bindNewEngineerInput(e) {
      this.setData({ newEngineerName: e.detail.value });
    },
  
    // Confirm adding
    confirmAddEngineer() {
      const name = this.data.newEngineerName.trim();
      if (name) {
        // Update list
        this.setData({
          engineerOptions: [...this.data.engineerOptions.filter(name=>name!="New"), name, "New"]
        });
        this.updateSelectedEngineers(name);
      }
      // close modal
      this.setData({ showAddDialog: false, newEngineerName: "" });
    },
  
    // Cancel adding
    cancelAddEngineer() {
      this.setData({ showAddDialog: false, newEngineerName: "" });
    },
      
    // Clear service_engineer
    clearAllEngineers(e) {
      this.setData({ service_engineer: "" });
      this.triggerEvent('engChange',{service_engineer: this.data.service_engineer});
    }
  }
})
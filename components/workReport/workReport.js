const util = require('../../utils/util.js');

Component({
  properties: {
    data: {
      type: Object,
      value: {
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
      }
    },
  },

  lifetimes: {
    attached() {
      // Init localData
      this.setData({
        localData: JSON.parse(JSON.stringify(this.properties.data))
      });

      // debounce update data 1 second
      this.debouncedUpdateData = util.debounce(() => {
        this.triggerEvent('update', this.data.localData);
      }, 1000);
    }
  },

  data: {
    localData: {} 
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

    // Callback for engineerSelector
    onEngChange(e) {
      this.setData({
        localData: {
          ...this.data.localData,
          service_engineer: e.detail.service_engineer
        }
      });
      this.debouncedUpdateData();
    },

    // Service content onChange
    bindServiceInput(e) {
      const index = e.currentTarget.dataset.index;
      const value = e.detail.value;
      const newContent = this.data.localData.service_content.map((item, i) => 
        i === index ? value : item
      );
      this.setData({
        localData: {
          ...this.data.localData,
          service_content: newContent
        }
      });
      this.debouncedUpdateData();
    },

    // Add new line of Service content
    addNewLine() {
      const newContent = this.data.localData.service_content ? [...this.data.localData.service_content, ''] : [''];
      this.setData({
        localData: {
          ...this.data.localData,
          service_content: newContent
        }
      });
      this.debouncedUpdateData();
    },

    // Delete 1 line of Service content
    deleteLine(e) {
      const index = e.currentTarget.dataset.index;
      const newContent = this.data.localData.service_content.filter((_, i) => i !== index);
      this.setData({
        localData: {
          ...this.data.localData,
          service_content: newContent
        }
      });
      this.debouncedUpdateData();
    },
  }
});

(function(){
  var customersVue = new Vue({
    el: '#customersVue',
    data: {
      // customer_id: null,
      name: null,
      address: null,
      contactno: null,
      email: null,
      customers: []
    },

    created: function() {
      var self = this;
      axios.get('http://localhost:8000/api/customers')
        .then(function(res) {
            self.customers = res.data;
        })
        .catch(function(res) {
            self.customers = [];
        });
    },
  })
})();
accout-vue.js

(function () {
    var accountVue = new Vue ({
        el: "#accountVue",
        data: {
            tpye_id: null,
            balance: null,
            interest_rate: null,
            overdraft: null,
            accounts: []
        },

        method: {
            addAccounts: function() {
                var self = this;
                var payload = {
                    type_id = self.type_id,
                    balance = self.balance,
                    interest_rate = self.interest_rate,
                    overdraft = self.overdraft,
                };
                
                
                axios.get("'http://localhost:8000/api/accounts' + accounts.account_id", payload)
                    .then(function(res) {
                        self.accounts = res.data;
                        self.clear();
                    })
                    .catch(function(err){

                    });
            }
        }
    })
})

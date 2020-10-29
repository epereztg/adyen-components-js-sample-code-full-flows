// 0. Get clientKey
getClientKey().then(clientKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            clientKey: clientKey,
            paymentMethodsResponse
        });

        // 2. Create and mount the Component
        const dropin = checkout
            .create('dropin', {
                // Events
                onSelect: activeComponent => {
                    updateStateContainer(activeComponent.data); // Demo purposes only
                },
                onChange: state => {
                    updateStateContainer(state); // Demo purposes only
                },
                onAdditionalDetails: (state, dropin) => {
                    console.log(state.data);
                    paymentDetails(state.data)
                        .then(result => {
                            if (JSON.parse(result).resultCode == 'ChallengeShopper') {
                                dropin.handleAction(JSON.parse(result).action);
                            }
                            else if (JSON.parse(result).resultCode == 'Authorised') {
                                dropin.setStatus('success');
                            }
                             else {
                                dropin.setStatus('error');
                            }
                        })
                        .catch(error => {
                            console.log('error on submitDetails' + error)
                            throw Error(error);
                        });
                },
                onSubmit: (state, component) => {
                    makePayment(state.data)
                      .then(response => {
                            dropin.handleAction(response.action);
                        })
                        .catch(error => {
                            throw Error(error);
                        });
                }
            })
            .mount('#dropin-container');
    });
});

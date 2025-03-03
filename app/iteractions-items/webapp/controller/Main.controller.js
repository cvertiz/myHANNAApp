sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("myhanapp.iteractionsitems.controller.Main", {
        onInit: function () {
            var oModel = this.getOwnerComponent().getModel();
            console.log(oModel);
            this.getView().setModel(oModel);
        }

    });
});


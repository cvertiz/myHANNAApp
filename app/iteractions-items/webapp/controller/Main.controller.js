sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

], (Controller, Filter, FilterOperator, Sorter, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("myhanapp.iteractionsitems.controller.Main", {

        _loadViewModel: function () {
            var oModel = this.getOwnerComponent().getModel();
            console.log(oModel);
            this.getView().setModel(oModel);
        },
        onInit: function () {
            this._loadViewModel();
        },
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue"); // Obtiene el valor ingresado
            var oTable = this.getView().byId("itemsTable"); // Referencia a la tabla
            var oBinding = oTable.getBinding("items"); // Obtiene el binding de la tabla

            if (oBinding) {
                var aFilters = [];
                if (sQuery) {
                    aFilters.push(new Filter("name", FilterOperator.Contains, sQuery));
                }
                oBinding.filter(aFilters);
            }
        },

        onSortItem: function () {
            var oTable = this.getView().byId("itemsTable"); // Referencia a la tabla
            var oBinding = oTable.getBinding("items"); // Obtiene el binding de la tabla

            if (oBinding) {
                var bDescending = this._bSortDescending || false; // Alternar entre ascendente y descendente
                var oSorter = new Sorter("created_at ", bDescending);
                oBinding.sort(oSorter);

                this._bSortDescending = !bDescending; // Invertir el orden para la siguiente vez
            }
        }


    });
});
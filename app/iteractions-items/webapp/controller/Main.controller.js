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
        },

        onAddItem: function () {
                if (!this._oDialog) {
                    this._oDialog = this.getView().byId("addProductDialog");
                }
                this._oDialog.open();
            },

            onCloseDialog: function () {
                this._oDialog.close();
            },

            onSaveProduct: function () {
                var oModel = this.getView().getModel();
                console.log(oModel); // Verifica qué tipo de modelo tienes


                // Obtener valores ingresados por el usuario
                var sName = this.getView().byId("inputName").getValue();
                var fPrice = parseFloat(this.getView().byId("inputPrice").getValue());
                var sCurrency = this.getView().byId("inputCurrency").getValue();

                console.log("sname: "+ sName);
                console.log("fPrice: " + fPrice);
                console.log("sCurrency: " + sCurrency);

                // Validar que los campos no estén vacíos
                if (!sName || isNaN(fPrice) || !sCurrency) {
                    sap.m.MessageBox.error("Please enter valid values for all fields.");
                    return;
                }

                // Crear el contexto para llamar al procedimiento almacenado
                var oContext = oModel.bindContext("/InsertProduct(...)");

                // Asignar parámetros al procedimiento almacenado
                oContext.setParameter("p_name", sName);
                oContext.setParameter("p_price", fPrice);
                oContext.setParameter("p_currency", sCurrency);

                console.log(oContext)

                // Ejecutar el procedimiento almacenado
                oContext.execute().then(function () {
                    sap.m.MessageToast.show("Producto agregado correctamente");
                    oModel.refresh(); // Actualiza la tabla después de insertar
                }).catch(function (oError) {
                    sap.m.MessageBox.error("Error al agregar producto: " + oError.message);
                });

                // Cerrar el diálogo después de guardar
                this.onCloseDialog();
            }


    });
});
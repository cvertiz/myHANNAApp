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
                this._oDialog = this.getView().byId("productDialog");
            }
            this._oDialog.open();
        },
        onSaveProduct: function () {
            var oModel = this.getView().getModel(); // Modelo OData V4

            var sName = this.getView().byId("inputName").getValue();
            var fPrice = parseFloat(this.getView().byId("inputPrice").getValue());
            var sCurrency = this.getView().byId("inputCurrency").getValue();

            if (!sName || isNaN(fPrice) || !sCurrency) {
                MessageBox.error("Todos los campos son obligatorios.");
                return;
            }

            var that = this;

            var oInputName = this.getView().byId("inputName");
            var oInputPrice = this.getView().byId("inputPrice");
            var oInputCurrency = this.getView().byId("inputCurrency");

            var fnClearForm = function () {
                oInputName.setValue(""); // Limpiar campo nombre
                oInputPrice.setValue(""); // Limpiar campo precio
                oInputCurrency.setValue(""); // Limpiar campo moneda
                that._sProductId = null; // Resetear ID para evitar ediciones no deseadas
            };

            if (this._sProductId) {
                // EDITAR PRODUCTO: Llamar al procedimiento `UpdateProduct`
                var oContext = oModel.bindContext("/UpdateProduct(...)");

                oContext.setParameter("p_id", this._sProductId);
                oContext.setParameter("p_name", sName);
                oContext.setParameter("p_price", fPrice);
                oContext.setParameter("p_currency", sCurrency);

                oContext.execute().then(function () {
                    MessageToast.show("Producto actualizado correctamente");
                    oModel.refresh();
                    that._sProductId = null; // Resetear ID
                    that.getView().byId("productDialog").close();
                    fnClearForm();
                }).catch(function (oError) {
                    MessageBox.error("Error al actualizar: " + oError.message);
                });

            } else {
                // AGREGAR PRODUCTO: Llamar al procedimiento `InsertProduct`
                var oContext = oModel.bindContext("/InsertProduct(...)");

                oContext.setParameter("p_name", sName);
                oContext.setParameter("p_price", fPrice);
                oContext.setParameter("p_currency", sCurrency);

                oContext.execute().then(function () {
                    MessageToast.show("Producto agregado correctamente");
                    oModel.refresh();
                    that.getView().byId("productDialog").close();
                    fnClearForm();
                }).catch(function (oError) {
                    MessageBox.error("Error al agregar: " + oError.message);
                });
            }
        },
        onEditItem: function (oEvent) {
            var oItem = oEvent.getSource().getParent(); // Obtiene el item seleccionado
            var oContext = oItem.getBindingContext(); // Obtiene el contexto del modelo

            if (!oContext) {
                MessageBox.error("No se pudo obtener los datos del producto.");
                return;
            }

            // Guardar el ID del producto a editar
            this._sProductId = oContext.getProperty("ID");

            // Llenar el formulario con los datos existentes
            this.getView().byId("inputName").setValue(oContext.getProperty("name"));
            this.getView().byId("inputPrice").setValue(oContext.getProperty("price"));
            this.getView().byId("inputCurrency").setValue(oContext.getProperty("currency_code"));

            // Cambiar el texto del botón para diferenciar entre "Add" y "Edit"
            this.getView().byId("saveButton").setText("Update");

            // Abrir el popup
            this.getView().byId("productDialog").open();
        },
        onCloseDialog: function () {
            this.getView().byId("productDialog").close();
            this._sProductId = null; // Resetear ID para la próxima vez
        },
        onDeleteItem: function () {
            var oTable = this.getView().byId("itemsTable");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select an item to delete.");
                return;
            }

            var oBindingContext = oSelectedItem.getBindingContext();
            var sPath = oBindingContext.getPath();
            var oModel = this.getView().getModel();

            if (!(oModel instanceof sap.ui.model.odata.v4.ODataModel)) {
                console.error("Error: El modelo no es un OData V4.");
                return;
            }

            // Extraer el ID del producto
            var productID = oBindingContext.getObject().ID;
            console.log("productID: " + productID)
            var oContext = oModel.bindContext("/DeleteProduct(...)");

            oContext.setParameter("p_id", productID);

            sap.m.MessageBox.confirm("Are you sure you want to delete this product?", {
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        oContext.execute().then(function () {
                            MessageToast.show("Producto eliminado correctamente");
                            oTable.getBinding("items").refresh();
                            oTable.removeSelections(true);
                        }).catch(function (oError) {
                            MessageBox.error("Error al eliminar: " + oError.message);
                        });
                    }
                }
            });
        }

    });
});
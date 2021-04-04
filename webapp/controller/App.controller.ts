import Device from "sap/ui/Device";
import Controller from "sap/ui/core/mvc/Controller";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";

/**@name sap.ui.demo.todo.controller.App */
class AppController extends Controller {

	aSearchFilters: any[];
	aTabFilters: any[];
	sSearchQuery: any;
	sFilterKey: any;
	
	onInit() {
		this.aSearchFilters = [];
		this.aTabFilters = [];

		this.getView().setModel(new JSONModel({
			isMobile: (Device as any).browser.mobile,
			filterText: undefined
		}), "view");
	}

	/**
	 * Adds a new todo item to the bottom of the list.
	 */
	addTodo() {
		var oModel = this.getModel() as unknown as sap.ui.model.json.JSONModel;
		var aTodos = oModel.getProperty("/todos").map(function (oTodo) { return Object.assign({}, oTodo); });

		aTodos.push({
			title: oModel.getProperty("/newTodo"),
			completed: false
		});

		oModel.setProperty("/todos", aTodos);
		oModel.setProperty("/newTodo", "");
	}

	/**
	 * Removes all completed items from the todo list.
	 */
	clearCompleted() {
		var oModel = this.getModel() as unknown as sap.ui.model.json.JSONModel;
		var aTodos = oModel.getProperty("/todos").map(function (oTodo) { return Object.assign({}, oTodo); });

		var i = aTodos.length;
		while (i--) {
			var oTodo = aTodos[i];
			if (oTodo.completed) {
				aTodos.splice(i, 1);
			}
		}

		oModel.setProperty("/todos", aTodos);
	}

	/**
	 * Updates the number of items not yet completed
	 */
	updateItemsLeftCount() {
		var oModel = this.getModel();
		var aTodos = oModel.getProperty("/todos") || [];

		var iItemsLeft = aTodos.filter(function(oTodo) {
			return oTodo.completed !== true;
		}).length;

		oModel.setProperty("/itemsLeftCount", iItemsLeft);
	}

	/**
	 * Trigger search for specific items. The removal of items is disable as long as the search is used.
	 * @param {sap.ui.base.Event} oEvent Input changed event
	 */
	onSearch(oEvent) {
		var oModel = this.getModel();

		// First reset current filters
		this.aSearchFilters = [];

		// add filter for search
		this.sSearchQuery = oEvent.getSource().getValue();
		if (this.sSearchQuery && this.sSearchQuery.length > 0) {
			oModel.setProperty("/itemsRemovable", false);
			var filter = new Filter("title", FilterOperator.Contains, this.sSearchQuery);
			this.aSearchFilters.push(filter);
		} else {
			oModel.setProperty("/itemsRemovable", true);
		}

		this._applyListFilters();
	}

	private getModel(): JSONModel {
		return this.getView().getModel() as unknown as JSONModel;
	}

	onFilter(oEvent) {
		// First reset current filters
		this.aTabFilters = [];

		// add filter for search
		this.sFilterKey = oEvent.getParameter("item").getKey();

		// eslint-disable-line default-case
		switch (this.sFilterKey) {
			case "active":
				this.aTabFilters.push(new Filter("completed", FilterOperator.EQ, false));
				break;
			case "completed":
				this.aTabFilters.push(new Filter("completed", FilterOperator.EQ, true));
				break;
			case "all":
			default:
				// Don't use any filter
		}

		this._applyListFilters();
	}

	_applyListFilters() {
		var oList = this.byId("todoList");
		var oBinding = oList.getBinding("items") as any;

		oBinding.filter(this.aSearchFilters.concat(this.aTabFilters), "todos");

		var sI18nKey;
		if (this.sFilterKey && this.sFilterKey !== "all") {
			if (this.sFilterKey === "active") {
				sI18nKey = "ACTIVE_ITEMS";
			} else {
				// completed items: sFilterKey = "completed"
				sI18nKey = "COMPLETED_ITEMS";
			}
			if (this.sSearchQuery) {
				sI18nKey += "_CONTAINING";
			}
		} else if (this.sSearchQuery) {
			sI18nKey = "ITEMS_CONTAINING";
		}

		var sFilterText;
		if (sI18nKey) {
			const oResourceModel = this.getView().getModel("i18n") as unknown as sap.ui.model.resource.ResourceModel;
			var oResourceBundle = oResourceModel.getResourceBundle();
			sFilterText = oResourceBundle.getText(sI18nKey, [this.sSearchQuery]);
		}
		const model = this.getView().getModel("view") as JSONModel;
		model.setProperty("/filterText", sFilterText);
	}
}

export default AppController;
// import UIComponent from "sap/ui/core/UIComponent";
// import ComponentSupport from "sap/ui/core/ComponentSupport";

// class Component extends UIComponent {
// 	static metadata = {
// 		manifest: "json"
// 	}
	
// 	init() {
// 		const cp = new ComponentSupport();
// 	}
// }

// export default Component;

sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/core/ComponentSupport"], function(UIComponent) {
	"use strict";
	return UIComponent.extend("sap.ui.demo.todo.Component", {
		metadata: {
			manifest: "json"
		}
	});
});

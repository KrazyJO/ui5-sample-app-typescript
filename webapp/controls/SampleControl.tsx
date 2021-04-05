import Control from "sap/ui/core/Control";

export enum Colors {
    green = "green",
    red = "red",
    blue = "blue"
}

export enum Shape {
    circle = "circle",
    square = "square"
}

/**@name sap.ui.demo.todo.controls.SampleControl */
class SampleControl extends Control {

    private colorGenerator = function* () {
        const len = Object.keys(Colors).length;
        let i = 0;
        while(true) {
            if (i === len) i = 0;

            yield Object.keys(Colors)[i];
            i++
        }
    }();

    private shapeGenerator = function* () {
        const len = Object.keys(Shape).length;
        let i = 0;
        while(true) {
            if (i === len) i = 0;

            yield Object.keys(Shape)[i];
            i++
        }
    }();

    static metadata = {
        properties: {
            color: {type: "string", defaultValue: Colors.blue},
            shape: {type: "string", defaultValue: Shape.square}
        },
        events: {
            chooseShape: {},
            chooseColor: {}
        }
    }

    getColor: () => Colors;
    setColor: (color: String) => void;
    getShape: () => Shape;
    setShape: (shape: Shape) => void;

    onclick(evt: Event) {
        const target = evt.target as HTMLElement;
        if (target?.id?.endsWith("-shape")) {
            this.nextShape();
        } else if (target?.id?.endsWith("-color")) {
            this.nextColor()
        }
    }

    private nextColor() {
        const nextColor = this.colorGenerator.next().value;
        this.setColor(nextColor);
    }

    private nextShape() {
        const nextShape = this.shapeGenerator.next().value as Shape;
        this.setShape(nextShape);
    }

    private getBorderRadius() {
        return this.getShape() === Shape.circle ? "100%" : "0px";
    }

    static renderer = {
        apiVersion: 2,
        render: function(oRm, oControl: SampleControl) {
            
            const styles = {
                "background-color": oControl.getColor(),
                "border-radius": oControl.getBorderRadius()
            }

            oRm.renderV2(
                <div class="tsx-sample-control" ui5ControlData={oControl}>
                    <div class="tsx-sample-control-text">
                        <span id={oControl.getId() + "-shape"}>&lt;Shape&gt;:</span> {oControl.getShape()},
                        <span id={oControl.getId() + "-color"}> &lt;Color&gt;:</span> {oControl.getColor()}
                    </div>
                    <div style={styles} class="tsx-sample-control-shape"></div>
                </div>
            );
        }
    }
}

export default SampleControl;
import Control from "sap/ui/core/Control";

export enum colors {
    green = "green",
    red = "red",
    blue = "blue"
}

export enum shapes {
    circle = "circle",
    square = "square"
}

/**@name sap.ui.demo.todo.controls.SampleControl */
class SampleControl extends Control {

    private makeGenerator<T>(obj: any) {
        return function* (): Generator<T> {
            const len = Object.keys(obj).length;
            let i = 0;
            while(true) {
                if (i === len) i = 0;

                yield Object.keys(obj)[i] as unknown as T;
                i++
            }
        }();
    }

    private shapeGenerator = this.makeGenerator<shapes>(shapes);
    private colorGenerator = this.makeGenerator<colors>(colors);

    static metadata = {
        properties: {
            color: {type: "string", defaultValue: colors.blue},
            shape: {type: "string", defaultValue: shapes.square}
        }
    }

    getColor: () => colors;
    setColor: (color: String) => void;
    getShape: () => shapes;
    setShape: (shape: shapes) => void;

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
        const nextShape = this.shapeGenerator.next().value;
        this.setShape(nextShape);
    }

    private getBorderRadius() {
        return this.getShape() === shapes.circle ? "100%" : "0px";
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
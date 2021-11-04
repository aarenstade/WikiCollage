import html2canvas from "html2canvas";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { SelectedElementIdState } from "../data/atoms";
import { convertAllHtmlImagesToBase64 } from "../image-utils";
import styles from "../styles/layers.module.css";
import { FONTS, TEXT_COLORS } from "../styles/text";
import { CanvasElementItem } from "../types/elements";

const Test = () => {
  const [element, setElement] = useState<CanvasElementItem | null>(null);
  const [selectedId, setSelectedId] = useRecoilState(SelectedElementIdState);
  const newTextElement: CanvasElementItem = {
    type: "text",
    data: "Text HERE",
    width: 1000,
    height: 400,
    scaledWidth: 1000,
    scaledHeight: 400,
    x: 50,
    y: 50,
    textParams: {
      fontSize: 200,
      fontFamily: FONTS[0],
      color: TEXT_COLORS[1],
      fontWeight: "normal",
      margin: "0",
      padding: "0",
    },
  };
  return (
    <div>
      <div className={styles.full}>
        {/* <CanvasElement id={0} element={newTextElement} onSave={(e) => setElement(e)} onDelete={() => null} /> */}
        <div id="canvas-element-0" style={{ width: 1000, height: 400, backgroundColor: "green" }}>
          <div
            style={{
              ...newTextElement.textParams,
              width: 1000,
              height: 400,
              overflowWrap: "anywhere",
              lineHeight: `${newTextElement.textParams?.fontSize || 10}px`,
            }}
          >
            <p id="text-element" style={{ margin: 0, padding: 0 }}>
              {newTextElement.data}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            setSelectedId(null);
            const eRoot = document.getElementById("canvas-element-0");
            if (eRoot) {
              const p = eRoot.getElementsByTagName("p");
              p[0].style.transform = `translateY(-${newTextElement.textParams?.fontSize}px)`;
              const res = await html2canvas(eRoot, {
                backgroundColor: null,
                scale: 1,
                width: 1000,
                height: 400,
                windowWidth: newTextElement.scaledWidth,
                windowHeight: newTextElement.scaledHeight,
                onclone: async (clone) => {
                  await convertAllHtmlImagesToBase64(clone);
                },
              });
              const b64 = res.toDataURL("image/png");
              console.log({ b64 });
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Test;

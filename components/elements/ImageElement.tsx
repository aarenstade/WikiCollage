/* eslint-disable @next/next/no-img-element */
import { useRef, useState, VFC } from "react";
import { v4 } from "uuid";
import { MAX_FILE_SIZE } from "../../config";
import { CanvasElementItem } from "../../types/elements";
import { convertBase64ToBytes, uploadImage } from "../../utils/image-utils";
import { matchUrl } from "../../utils/utils";
import styles from "./elements.module.css";

interface ImageElementProps {
  element: CanvasElementItem;
  editing: boolean;
  onUpdate: (e: CanvasElementItem) => void;
}

interface ImageDataProps {
  element: CanvasElementItem;
  loading: boolean;
}

const ImageData: VFC<ImageDataProps> = ({ element, loading }) => {
  if (loading) {
    return (
      <div style={{ backgroundColor: "gray", width: element.scaledWidth, height: element.scaledHeight }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (element.data) {
    return (
      <img
        src={element.data}
        alt="image"
        onDragStart={(e) => e.preventDefault()}
        style={{
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      />
    );
  } else {
    return (
      <div
        className={styles.imageData}
        style={{
          backgroundColor: "black",
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      />
    );
  }
};

const ImageElement: VFC<ImageElementProps> = ({ element, editing, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onInputUrl = (url: string) => {
    const valid = matchUrl(url);
    if (valid) onUpdate({ ...element, data: url });
  };

  const onFileChangeCapture = (e: any) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].size > MAX_FILE_SIZE) {
      alert("File is bigger than 3.0MB");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      const result = reader.result;
      const path = `/tmp/${v4()}.jpg`;

      if (result) {
        if (typeof result === "string") {
          const bytes = convertBase64ToBytes(result);
          const url = await uploadImage(bytes, path);
          if (url) onUpdate({ ...element, data: url });
        } else {
          const url = await uploadImage(result, path);
          if (url) onUpdate({ ...element, data: url });
        }
      }

      setLoading(false);
    });
    reader.readAsDataURL(files[0]);
  };

  const triggerSelectFile = () => {
    if (inputFileRef.current) inputFileRef.current.click();
  };

  if (editing) {
    return (
      <div
        className={styles.imageElement}
        style={{
          width: element.scaledWidth,
          height: element.scaledHeight && element.scaledHeight + 50,
        }}
      >
        <ImageData element={element} loading={loading} />
        <div className={styles.elementBottomButtonsStack}>
          <input
            ref={inputFileRef}
            name="imageinput"
            type="file"
            accept="image/*"
            className={styles.imageInput}
            onChangeCapture={onFileChangeCapture}
          />
          <button onClick={triggerSelectFile}>Select file</button>
          <input name="image-url" type="text" placeholder="Image Url" onChange={(e) => onInputUrl(e.target.value)} />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={styles.imageElement}
        style={{
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      >
        <ImageData element={element} loading={loading} />
      </div>
    );
  }
};

export default ImageElement;

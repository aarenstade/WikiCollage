/* eslint-disable @next/next/no-img-element */
import { convertBase64ToBytes, convertImageToBase64, uploadImage } from "../../utils/image-utils";
import { useRef, useState, VFC } from "react";
import { v4 } from "uuid";
import { MAX_FILE_SIZE } from "../../config";
import { matchUrl } from "../../utils/utils";
import { CanvasElementItem } from "../../types/elements";
import useViewControl from "../../hooks/useViewControl";
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
          backgroundColor: "lightgray",
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      />
    );
  }
};

const ImageElement: VFC<ImageElementProps> = ({ element, editing, onUpdate }) => {
  const view = useViewControl();
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleNewImage = async (imageData: string) => {
    setLoading(true);
    let data: string = imageData;
    let width = 500; // default size
    let height = 500;
    let scaledWidth, scaledHeight, aspectRatio;

    if (imageData.startsWith("data:image")) {
      const image = new Image();
      image.onload = () => {
        width = image.width;
        height = image.height;
        aspectRatio = width / height;
      };
      image.src = imageData;
      const bytes = convertBase64ToBytes(imageData);
      const url = await uploadImage(bytes, `/tmp/${v4()}.jpg`);
      data = url ? url : imageData;
    }

    const scale = view.view.scale;
    scaledWidth = width * scale;
    scaledHeight = height * scale;
    onUpdate({ ...element, data, width, height, scaledWidth, scaledHeight, aspectRatio });
    setLoading(false);
  };

  const onInputUrl = async (url: string) => {
    const valid = matchUrl(url);
    if (valid) await handleNewImage(url);
  };

  const onFileChangeCapture = (e: any) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].size > MAX_FILE_SIZE) {
      alert("File is bigger than 3.0MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      if (reader.result) {
        let data = reader.result;
        if (typeof data != "string") data = convertImageToBase64(data);
        await handleNewImage(data);
      }
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
        {!element.data && (
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
        )}
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

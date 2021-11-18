/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useState, VFC } from "react";
import { v4 } from "uuid";
import { BASE_URL, MAX_FILE_SIZE } from "../../config";
import { CanvasElementItem } from "../../types/elements";
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
          backgroundColor: "gray",
          width: element.scaledWidth,
          height: element.scaledHeight,
        }}
      />
    );
  }
};

const ImageElement: VFC<ImageElementProps> = ({ element, editing, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const onInputUrl = async (url: string) => {
    let data = url;

    const matchUrl = (val: string) =>
      val.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    const matchBase64 = (val: string) => val.startsWith("data:image");

    const finish = (data?: string) => {
      setLoading(false);
      data && onUpdate({ ...element, data });
      return;
    };

    setLoading(true);
    if (matchUrl(url)) {
      const res = await axios({ url: `${BASE_URL}/api/image-to-base64`, data: { url }, method: "POST" });
      if (res.data) data = res.data;
      finish(data);
    }

    if (matchBase64(url)) finish(data);

    finish();
  };

  const onSelectFile = (e: any) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].size > MAX_FILE_SIZE) {
      alert("File is bigger than 3.0MB");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      const result = reader.result;
      if (result && typeof result === "string") onUpdate({ ...element, data: result });
      setLoading(false);
    });
    reader.readAsDataURL(files[0]);
  };

  if (editing) {
    return (
      <div
        className={styles.imageElement}
        style={{
          width: element.scaledWidth,
          height: element.scaledHeight && element.scaledHeight + 45,
        }}
      >
        <ImageData element={element} loading={loading} />
        <div className={styles.elementBottomButtonsStack}>
          <input
            name="imageinput"
            type="file"
            accept="image/*"
            className={styles.imageInput}
            onChange={(e) => onSelectFile(e)}
          />
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

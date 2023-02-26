import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "../../../styles/ImageUpload.css";

const ImageUpload = (props) => {
  const [imageFile, setImageFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const imageFilePicker = useRef();

  useEffect(() => {
    if (!imageFile) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handlePickImage = () => {
    imageFilePicker.current.click();
  };

  const handlePickedImage = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImageFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        ref={imageFilePicker}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={handlePickedImage}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Please pick an image!!</p>}
        </div>
        <Button type="button" onClick={handlePickImage}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

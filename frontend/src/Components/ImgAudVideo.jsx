import { useEffect, useState } from "react";
import { imgFormats, videoFileFormats } from "../actions/common";
import ImageWithLoader from "./ImageWithLoader";

export default function ImgAudVideo({
  file,
  type,
  classname,
  thumb,
  origFile,
  from,
  noimg,
}) {
  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    const images = document.querySelectorAll('img');

    images.forEach((image) => {
      image.addEventListener('contextmenu', preventContextMenu);
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener('contextmenu', preventContextMenu);
      });
    };
  }, []);
  // console.log("fileeeeeee",file,type)
  var [Check, setCheck] = useState(false)
  const Audioaction = () => {
    var aud = document.getElementById("nftaudio");
    if (Check == false) {
      aud.play();
      setCheck(!Check)
    }
    else {
      aud.pause();
      setCheck(!Check)
    }
  }

  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (imgFormats.includes(extension)) {
      return 'image';
    } else if (videoFileFormats.includes(extension)) {
      return 'video';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    }
    return 'unknown';
  };

  const fileType = getFileType(file);
  console.log('fileTypefileType---->', fileType);
  return file ? (
    fileType === "image" ? (
    
      <ImageWithLoader
        src={file}
        alt="img"
        className={classname}
      />
      // <img
      //   src={file}
      //   alt="img"
      //   className={classname}
      // onContextMenu="return false;"
      // onError={event => {
      //   event.target.src = origFile
      // }}
      // />
    ) : fileType === "video" ? (
      <video
        className={classname}
        loop={true}
        controlsList="nodownload"
        autoPlay={true}
        controls={false}
        playsinline
        poster={thumb}
        muted
        // onContextMenu="return false;"
        type="video/*"
        src={file}
        onError={event => {
          event.target.src = origFile
        }}
      >
      </video>
    ) : fileType === "audio" ? (
      <>
        {" "}
        <img src={thumb} alt="favicon" onClick={Audioaction} className={classname} />
        <audio
          controlsList="nodownload"
          id="nftaudio"
          controls
          autoPlay
          // loop
          muted
          src={file}
        >
          {/* <source  type="audio/*" /> */}
        </audio>
      </>
    ) : (
      <img src={noimg} alt="audio" className={classname} />
    )
  ) : (
    <img src={noimg} alt="noimg" className={classname} />
  );
}

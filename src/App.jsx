import { useEffect, useRef, useState } from "react";
import Perspective from "perspectivets";
import "./index.css";

function App() {
  const [bgImage, setBgImage] = useState();
  const [logoImage, setLogoImage] = useState([]);
  const canvasRef = useRef(null);
  const [topLeft, setTopLeft] = useState([]);
  const [topRight, setTopRight] = useState([]);
  const [bottomRight, setBottomRight] = useState([]);
  const [bottomLeft, setBottomLeft] = useState([]);

  const handler = (mouseDownEvent, size, setSize, index) => {
    const startSize = size;
    const startPosition = {
      x: mouseDownEvent.pageX,
      y: mouseDownEvent.pageY
    };

    function onMouseMove(mouseMoveEvent) {
      setSize((prevTopLeft) => {
        return prevTopLeft.map((item, i) => {
          if (i === index) {
            return {
              x: startSize.x - startPosition.x + mouseMoveEvent.pageX,
              y: startSize.y - startPosition.y + mouseMoveEvent.pageY
            };
          }
          return item;
        });
      });
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, {
      once: true
    });
  };

  const onBackgroundImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImage(url);
    }
  }

  const onLogoImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoImage((prevImages) => [...prevImages, url]);
      setTopLeft((prevImages) => [...prevImages, { x: 30, y: 30 }]);
      setTopRight((prevImages) => [...prevImages, { x: 462, y: 50 }]);
      setBottomRight((prevImages) => [...prevImages, { x: 442, y: 482 }]);
      setBottomLeft((prevImages) => [...prevImages, { x: 10, y: 512 }]);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    logoImage.map((item, index) => {
      var image = new Image();
      image.onload = function () {
        let p = new Perspective(context, image);
        p.draw({
          topLeftX: topLeft[index].x,
          topLeftY: topLeft[index].y,
          topRightX: topRight[index].x,
          topRightY: topRight[index].y,
          bottomRightX: bottomRight[index].x,
          bottomRightY: bottomRight[index].y,
          bottomLeftX: bottomLeft[index].x,
          bottomLeftY: bottomLeft[index].y
        });
      };
      image.src = item;
    })
  }, [logoImage, topLeft, topRight, bottomRight, bottomLeft]);

  return (
    <div className={`w-full h-full`}>
      <input type="file" id="bgImage" onChange={onBackgroundImage} />
      <input type="file" id="logoImage" onChange={onLogoImage} />
      {
        logoImage?.map((_, index) => {
          return (
            <div key={index}>
              <div
                className="node"
                id="tl"
                style={{ left: topLeft[index].x, top: topLeft[index].y }}
                onMouseDown={(e) => handler(e, topLeft[index], setTopLeft, index)}
              ></div>
              <div
                className="node"
                id="tr"
                style={{ left: topRight[index].x, top: topRight[index].y }}
                onMouseDown={(e) => handler(e, topRight[index], setTopRight, index)}
              ></div>
              <div
                className="node"
                id="br"
                style={{ left: bottomRight[index].x, top: bottomRight[index].y }}
                onMouseDown={(e) => handler(e, bottomRight[index], setBottomRight, index)}
              ></div>
              <div
                className="node"
                id="bl"
                style={{ left: bottomLeft[index].x, top: bottomLeft[index].y }}
                onMouseDown={(e) => handler(e, bottomLeft[index], setBottomLeft, index)}
              ></div>
            </div>
          )
        })
      }
      <canvas ref={canvasRef} width={1440} height={768} style={{ backgroundImage: `url(${bgImage})` }} />
    </div>
  );
}

export default App;

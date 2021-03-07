import imagePathRain from "./images/rain.jpg";
import imagePathNight from "./images/night.jpg";
import imagePathSun from "./images/sunny.jpg";
import imageWalks from "./images/j8MwX9.png";

function ChangeBackground(props) {
  let mood = props.mood;

  function changeBackground(mood) {
    if (mood === "rainy") {
      document.body.style.backgroundImage = `url(${imagePathRain})`;
    } else if (mood === "night") {
      document.body.style.backgroundImage = `url(${imagePathNight})`;
    } else if (mood === "sunny") {
      document.body.style.backgroundImage = `url(${imagePathSun})`;
    } else if (mood === "mywalks") {
      document.body.style.backgroundImage = `url(${imageWalks})`;
    }
  }

  changeBackground(mood);

  return null;
}

export default ChangeBackground;

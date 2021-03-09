import imagePathRain from "./images/rain.jpg";
import imagePathNight from "./images/night.jpg";
import imagePathSun from "./images/sunny.jpg";
import imageWalks from "./images/mywalks.jpg";

function ChangeBackground(props) {
  //the props that we are passing is the fina part of the URL, so we will know where we are.
  let mood = props.mood;

  //Depending on where we are, the background will be selected.
  //Here we define the function to do so
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

  //we call it
  changeBackground(mood);

  //and we return null, as we need to return something, but we don't want to render anything
  return null;
}

export default ChangeBackground;

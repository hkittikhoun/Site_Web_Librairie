import "./Icon.css";

const Icon = (props) => {
  return (
    <div className={`icon ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Icon;

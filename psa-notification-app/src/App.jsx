import { useEffect, useState } from "react";
import addNotification from "react-push-notification";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCount(count + 1);
  //   }, 3000);
  // }, [count]);

  useEffect(() => {
    addNotification({
      title: "Warning",
      subtitle: "This is a subtitle",
      message: "This is a very long message",
      theme: "darkblue",
      icon: "http://psa.wf/wp-content/uploads/2024/11/ccv-720x340.jpg",
      native: true, // when using native, your OS will handle theming.
    });
  }, [count]);

  return <>{/* <button>Click to Push Notification {count}</button> */}</>;
}

export default App;

import { Provider } from "react-redux";
import { Routing } from "../Routing"
import store from "../redux/store";
import { Login } from "./Login";
import { Nav } from "./Nav";
import { BrowserRouter } from "react-router";

export const Main = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </Provider>
    </>
  );
};

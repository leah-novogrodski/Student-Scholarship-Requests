import { BrowserRouter, Route, Routes } from "react-router";
import { Nav } from "./comps/Nav";
import { Home } from "./comps/Home";
import { Login } from "./comps/Login";
import { SendRequest } from "./comps/SendRequest";
import { ViewStatus } from "./comps/ViewStatus";
import { PersonalForm } from "./comps/PersonalForm";
import { FamilyForm } from "./comps/FamilyForm";
import { BankForm } from "./comps/BankForm";

import { CourseForm } from "./comps/CourseForm";
import { Verify } from "./comps/Verify";

import { Apply } from "./comps/Apply";

import { Register } from "./comps/Register";
import { ViewRequests } from "./comps/ViewRequests";

export const Routing = () => {
  return (
    <>
      <Nav></Nav>
      <Routes>
                <Route path="" element={<Home></Home>}></Route>
        <Route path="Register" element={<Register></Register>}></Route>
        <Route path="Home" element={<Home></Home>}></Route>
        <Route path="Login" element={<Login></Login>}></Route>
        <Route path="SendRequest"  element={<SendRequest></SendRequest>}>
          <Route
            path="PersonalForm"
            element={<PersonalForm></PersonalForm>}
          ></Route>
          <Route index element={<PersonalForm></PersonalForm>}></Route>
          <Route path="FamilyForm" element={<FamilyForm></FamilyForm>}></Route>
          <Route path="CourseForm" element={<CourseForm></CourseForm>}></Route>
          <Route path="BankForm" element={<BankForm></BankForm>}></Route>
          <Route path="Verify" element={<Verify></Verify>}></Route>
        </Route>
        <Route path="ViewStatus" element={<ViewStatus></ViewStatus>}></Route>
        <Route path="ViewRequests" element={<ViewRequests></ViewRequests>}></Route>
        <Route path="Apply" element={<Apply></Apply>}></Route>
      </Routes>
    </>
  );
};

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import InvoiceForm from "./components/InvoceForm";
import Invoice from "./components/Invoice";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Invoices from "./components/Invoices";
import Preview from "./components/Preview";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Body from "./components/Body";
import ErrorPage from "./components/Error";

const App = () => {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Body />}>
              <Route path="/" element={<InvoiceForm />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="preview/:id" element={<Preview />} />
              <Route path="invoices" element={<Invoices />} />
            </Route>


            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default App;

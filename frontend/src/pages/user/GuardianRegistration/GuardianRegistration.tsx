import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Text, Input } from "../../../components";
import { useNavigate, useLocation } from "react-router-dom";
import OnScreenKeyboard, {
  OnScreenKeyboardHandle,
} from "../../../components/OnScreenKeyboard/OnScreenKeyboard";

const globalStyles = `
  body, html {
    background-color: #C5C3C6; 
    height: 100%;
    margin: 0;
  }
  #root, .app {
    height: 100%;
  }
`;

export default function GuardianRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId } = location.state || {};
  const keyboardRef = useRef<OnScreenKeyboardHandle>(null);

  const [formData, setFormData] = useState({
    guardianfirstname: "",
    guardianmiddlename: "",
    guardianlastname: "",
    guardianaddress: "",
    guardiancontactnumber: "",
    relationship: "",
    tenant: tenantId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/guardian/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Guardian data saved successfully:", responseData);
        navigate("/billregistration", { state: { tenantId } }); // Navigate to the next page on success
      } else {
        const errorData = await response.json();
        console.error("Failed to save guardian data:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (keyboardRef.current) {
      keyboardRef.current.show(input);
    }
  };

  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <style>{globalStyles}</style>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col items-center border border-solid border-white-A700 py-14 md:py-5">
          <div className="container-xs mb-[5px] flex flex-col gap-[139px] md:gap-[104px] md:p-5 sm:gap-[69px]">
            <div className="flex flex-col items-start justify-center gap-[21px]">
              <Text
                size="2xl"
                as="p"
                className="!font-montserrat tracking-[8.00px] !text-black-900"
              >
                Kindly fill your Guardian's details
              </Text>
              <div className="h-px self-stretch bg-cyan-800" />
            </div>
            <div className="flex w-full justify-between gap-[120px] mt-[-50px]">
              <div className="flex w-[48%] flex-col items-start">
                <div className="ml-[33px] flex w-full flex-col items-start md:ml-0">
                  <Text
                    size="md"
                    as="p"
                    className="relative z-[1] !font-opensans tracking-[2.50px]"
                  >
                    Name
                  </Text>
                  <div className="relative mt-[-2px] flex gap-[17px] self-stretch">
                    <Input
                      onFocus={handleFocus}
                      shape="square"
                      name="guardianfirstname"
                      value={formData.guardianfirstname}
                      onChange={handleChange}
                      className="w-[220px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                    />
                    <Input
                      onFocus={handleFocus}
                      shape="square"
                      name="guardianmiddlename"
                      value={formData.guardianmiddlename}
                      onChange={handleChange}
                      className="w-[66px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                    />
                    <Input
                      onFocus={handleFocus}
                      shape="square"
                      name="guardianlastname"
                      value={formData.guardianlastname}
                      onChange={handleChange}
                      className="w-[220px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                    />
                  </div>
                  <Text
                    size="md"
                    as="p"
                    className="mt-[50px] !font-opensans tracking-[2.50px]"
                  >
                    Address
                  </Text>
                  <Input
                    onFocus={handleFocus}
                    shape="square"
                    name="guardianaddress"
                    value={formData.guardianaddress}
                    onChange={handleChange}
                    className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                  />
                </div>
              </div>
              <div className="mr-[33px] flex w-[48%] flex-col items-start md:mr-0 md:w-full mt-[-6px]">
                <Text
                  size="md"
                  as="p"
                  className="!font-opensans tracking-[2.50px]"
                >
                  Contact Number
                </Text>
                <Input
                  onFocus={handleFocus}
                  shape="square"
                  name="guardiancontactnumber"
                  value={formData.guardiancontactnumber}
                  onChange={handleChange}
                  className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                />
                <Text
                  size="md"
                  as="p"
                  className="mt-[50px] !font-opensans tracking-[2.50px]"
                >
                  Relationship
                </Text>
                <Input
                  onFocus={handleFocus}
                  shape="square"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-[546px] border-b-2 border-customColor1 pb-[-30px] pt-[30px] !text-xl mt-[-10px]"
                />
                <div className="self-end p-[50px]">
                  <button
                    type="submit"
                    className="bg-transparent border-none cursor-pointer"
                  >
                    <img src="/images/nxtbtn2.png" alt="arrowleft" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <OnScreenKeyboard ref={keyboardRef} />
    </>
  );
}
